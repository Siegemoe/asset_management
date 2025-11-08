// Role-Based Access Control (RBAC) Service
import { prisma } from "@/lib/prisma"
import { SimpleAuditLogger } from "./simpleAuditLogger"

export interface Permission {
  id: string
  name: string
  description?: string
  resource: string // e.g., 'asset', 'site', 'user'
  action: string   // e.g., 'create', 'read', 'update', 'delete'
}

export interface UserPermission {
  userId: string
  permissionId: string
  granted: boolean
}

export class RBACService {
  /**
   * Get all available permissions
   */
  static getAvailablePermissions(): Permission[] {
    const permissions: Permission[] = []

    // Asset permissions
    permissions.push(
      { id: 'asset:create', name: 'Create Asset', resource: 'asset', action: 'create' },
      { id: 'asset:read', name: 'Read Asset', resource: 'asset', action: 'read' },
      { id: 'asset:update', name: 'Update Asset', resource: 'asset', action: 'update' },
      { id: 'asset:delete', name: 'Delete Asset', resource: 'asset', action: 'delete' },
      { id: 'asset:list', name: 'List Assets', resource: 'asset', action: 'list' }
    )

    // Site permissions
    permissions.push(
      { id: 'site:create', name: 'Create Site', resource: 'site', action: 'create' },
      { id: 'site:read', name: 'Read Site', resource: 'site', action: 'read' },
      { id: 'site:update', name: 'Update Site', resource: 'site', action: 'update' },
      { id: 'site:delete', name: 'Delete Site', resource: 'site', action: 'delete' },
      { id: 'site:list', name: 'List Sites', resource: 'site', action: 'list' }
    )

    // Room permissions
    permissions.push(
      { id: 'room:create', name: 'Create Room', resource: 'room', action: 'create' },
      { id: 'room:read', name: 'Read Room', resource: 'room', action: 'read' },
      { id: 'room:update', name: 'Update Room', resource: 'room', action: 'update' },
      { id: 'room:delete', name: 'Delete Room', resource: 'room', action: 'delete' },
      { id: 'room:list', name: 'List Rooms', resource: 'room', action: 'list' }
    )

    // User management permissions
    permissions.push(
      { id: 'user:create', name: 'Create User', resource: 'user', action: 'create' },
      { id: 'user:read', name: 'Read User', resource: 'user', action: 'read' },
      { id: 'user:update', name: 'Update User', resource: 'user', action: 'update' },
      { id: 'user:delete', name: 'Delete User', resource: 'user', action: 'delete' },
      { id: 'user:list', name: 'List Users', resource: 'user', action: 'list' }
    )

    // Security permissions
    permissions.push(
      { id: 'security:read', name: 'Read Security Events', resource: 'security', action: 'read' },
      { id: 'security:manage', name: 'Manage Security Settings', resource: 'security', action: 'manage' }
    )

    // Admin permissions
    permissions.push(
      { id: 'admin:full', name: 'Full Admin Access', resource: 'admin', action: 'full' }
    )

    return permissions
  }

  /**
   * Get default role permissions
   */
  static getDefaultRolePermissions(): Record<string, string[]> {
    return {
      SUPER_ADMIN: this.getAvailablePermissions().map(p => p.id),
      ADMIN: [
        'site:create', 'site:read', 'site:update', 'site:list',
        'room:create', 'room:read', 'room:update', 'room:list',
        'asset:create', 'asset:read', 'asset:update', 'asset:delete', 'asset:list',
        'user:read', 'user:list',
        'security:read'
      ],
      SITE_MANAGER: [
        'site:read', 'site:list',
        'room:read', 'room:list',
        'asset:create', 'asset:read', 'asset:update', 'asset:list'
      ]
    }
  }

  /**
   * Check if user has permission
   * For now, this uses the existing role-based system with site access
   */
  static async hasPermission(
    userId: string,
    permission: string,
    resourceId?: string,
    siteId?: string
  ): Promise<boolean> {
    try {
      // Get user with role and site access
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          role: true,
          siteIds: true
        }
      })

      if (!user) {
        return false
      }

      // Super admin has all permissions
      if (user.role === 'SUPER_ADMIN') {
        return true
      }

      // Admin has most permissions
      if (user.role === 'ADMIN') {
        // Admin can't create users or access security without special permissions
        if (permission.startsWith('user:create') || permission.startsWith('security:manage')) {
          return false
        }
        return true
      }

      // Site manager has limited permissions
      if (user.role === 'SITE_MANAGER') {
        const siteIds = user.siteIds ? JSON.parse(user.siteIds) : []
        
        // Must have access to the specific site
        if (siteId && !siteIds.includes(siteId)) {
          return false
        }

        // Site manager can only manage assets, rooms, and read sites
        const allowedPermissions = [
          'site:read', 'site:list',
          'room:read', 'room:list',
          'asset:create', 'asset:read', 'asset:update', 'asset:list'
        ]

        return allowedPermissions.includes(permission)
      }

      return false
    } catch (error) {
      console.error('Error checking permission:', error)
      return false
    }
  }

  /**
   * Check if user can access a specific resource
   */
  static async canAccessResource(
    userId: string,
    resource: string,
    action: string,
    resourceId?: string,
    siteId?: string
  ): Promise<{
    allowed: boolean
    reason?: string
  }> {
    const permission = `${resource}:${action}`

    // Try to get the resource's site ID if not provided
    if (!siteId && resourceId) {
      siteId = await this.getResourceSiteId(resource, resourceId) || undefined
    }

    const allowed = await this.hasPermission(userId, permission, resourceId, siteId)

    if (!allowed) {
      return {
        allowed: false,
        reason: `User does not have permission to ${action} ${resource}`
      }
    }

    return { allowed: true }
  }

  /**
   * Get the site ID for a resource
   */
  private static async getResourceSiteId(resource: string, resourceId: string): Promise<string | null> {
    try {
      switch (resource) {
        case 'asset':
          const asset = await prisma.asset.findUnique({
            where: { id: resourceId },
            select: { siteId: true }
          })
          return asset?.siteId || null

        case 'room':
          const room = await prisma.room.findUnique({
            where: { id: resourceId },
            select: { siteId: true }
          })
          return room?.siteId || null

        case 'site':
          return resourceId

        default:
          return null
      }
    } catch (error) {
      console.error('Error getting resource site ID:', error)
      return null
    }
  }

  /**
   * Filter resources based on user permissions
   */
  static async filterResourcesByPermission<T extends { id: string; siteId?: string }>(
    userId: string,
    resources: T[],
    permission: string,
    action: 'read' | 'list'
  ): Promise<T[]> {
    const allowedSites = await this.getUserAllowedSites(userId)

    return resources.filter(resource => {
      // If resource has a site ID, check if user can access that site
      if (resource.siteId && !allowedSites.includes(resource.siteId)) {
        return false
      }

      // Check permission
      return this.hasPermission(userId, `${resource.id.split(':')[0]}:${action}`)
    })
  }

  /**
   * Get all sites a user has access to
   */
  static async getUserAllowedSites(userId: string): Promise<string[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        siteIds: true
      }
    })

    if (!user) {
      return []
    }

    // Super admin and admin have access to all sites
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      // Get all site IDs
      const sites = await prisma.site.findMany({
        select: { id: true }
      })
      return sites.map(site => site.id)
    }

    // Site manager has access to assigned sites only
    if (user.role === 'SITE_MANAGER') {
      return user.siteIds ? JSON.parse(user.siteIds) : []
    }

    return []
  }

  /**
   * Log permission check for audit
   */
  static async logPermissionCheck(
    userId: string,
    permission: string,
    resourceId?: string,
    granted: boolean = false,
    ipAddress?: string,
    userAgent?: string
  ) {
    await SimpleAuditLogger.logDataAccess(
      userId,
      'permission',
      'read',
      resourceId,
      ipAddress,
      userAgent
    )

    if (!granted) {
      await SimpleAuditLogger.logSecurityEvent('UNAUTHORIZED_ACCESS', userId, {
        permission,
        resourceId,
        action: 'permission_denied'
      }, ipAddress, userAgent)
    }
  }

  /**
   * Get user's permission summary
   */
  static async getUserPermissions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        siteIds: true
      }
    })

    if (!user) {
      return null
    }

    const defaultPermissions = this.getDefaultRolePermissions()
    const allowedSites = await this.getUserAllowedSites(userId)

    return {
      role: user.role,
      permissions: defaultPermissions[user.role] || [],
      allowedSites,
      siteIds: user.siteIds ? JSON.parse(user.siteIds) : []
    }
  }

  /**
   * Middleware to check permissions
   */
  static createPermissionMiddleware(resource: string, action: string) {
    return async (
      userId: string,
      resourceId?: string,
      siteId?: string,
      ipAddress?: string,
      userAgent?: string
    ) => {
      const result = await this.canAccessResource(userId, resource, action, resourceId, siteId)
      
      await this.logPermissionCheck(userId, `${resource}:${action}`, resourceId, result.allowed, ipAddress, userAgent)

      if (!result.allowed) {
        throw new Error(`Access denied: ${result.reason}`)
      }

      return result
    }
  }
}

// Permission and UserPermission are already exported above