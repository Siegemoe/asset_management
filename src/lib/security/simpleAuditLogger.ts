// Simple Audit Logger - works with existing schema
// import { prisma } from "@/lib/prisma" // Not used in current implementation

export interface AuditEvent {
  id: string
  userId?: string | undefined
  action: string
  resource?: string
  details?: Record<string, any>
  ipAddress?: string | undefined
  userAgent?: string | undefined
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  eventType?: string
  description?: string
  createdAt: Date
}

// In-memory store for audit events (in production, this would be a database)
// Start with empty store - no placeholder data
const auditEventsStore: AuditEvent[] = []

export class SimpleAuditLogger {
  private static generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Log a login attempt (both success and failure)
   */
  static async logLoginAttempt(
    userId: string | undefined,
    email: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
    reason?: string
  ) {
    try {
      const event: AuditEvent = {
        id: this.generateId(),
        eventType: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE',
        action: 'login',
        description: success ? 'Successful login' : 'Failed login attempt',
        userId,
        severity: success ? 'LOW' : 'MEDIUM',
        ipAddress,
        userAgent,
        createdAt: new Date()
      }

      auditEventsStore.unshift(event)
      // Keep only the last 1000 events
      if (auditEventsStore.length > 1000) {
        auditEventsStore.splice(1000)
      }

      console.log('AUDIT:', event)
    } catch (error) {
      console.error('Failed to log login attempt:', error)
    }
  }

  /**
   * Log logout
   */
  static async logLogout(
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const event: AuditEvent = {
      id: this.generateId(),
      eventType: 'LOGOUT',
      action: 'logout',
      description: 'User logout',
      userId,
      severity: 'LOW',
      ipAddress,
      userAgent,
      createdAt: new Date()
    }

    auditEventsStore.unshift(event)
    if (auditEventsStore.length > 1000) {
      auditEventsStore.splice(1000)
    }

    console.log('AUDIT:', event)
  }

  /**
   * Log data access
   */
  static async logDataAccess(
    userId: string,
    resource: string,
    action: 'read' | 'list' | 'search',
    resourceId?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const event: AuditEvent = {
      id: this.generateId(),
      eventType: 'DATA_ACCESS',
      action: `${action}_${resource}`,
      description: `User accessed ${resource} data`,
      userId,
      severity: 'LOW',
      ipAddress,
      userAgent,
      createdAt: new Date()
    }

    auditEventsStore.unshift(event)
    if (auditEventsStore.length > 1000) {
      auditEventsStore.splice(1000)
    }

    console.log('AUDIT:', event)
  }

  /**
   * Log data modification
   */
  static async logDataModification(
    userId: string,
    resource: string,
    action: 'create' | 'update' | 'delete',
    resourceId?: string,
    changes?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ) {
    const event: AuditEvent = {
      id: this.generateId(),
      eventType: 'DATA_MODIFICATION',
      action: `${action}_${resource}`,
      description: `User ${action}ed ${resource}`,
      userId,
      severity: action === 'delete' ? 'MEDIUM' : 'LOW',
      ipAddress,
      userAgent,
      createdAt: new Date()
    }

    auditEventsStore.unshift(event)
    if (auditEventsStore.length > 1000) {
      auditEventsStore.splice(1000)
    }

    console.log('AUDIT:', event)
  }

  /**
   * Log security events
   */
  static async logSecurityEvent(
    event: 'ACCOUNT_LOCKED' | 'PASSWORD_CHANGE' | 'UNAUTHORIZED_ACCESS',
    userId: string,
    details: Record<string, any> = {},
    ipAddress?: string,
    userAgent?: string
  ) {
    const auditEvent: AuditEvent = {
      id: this.generateId(),
      eventType: event,
      action: 'security_event',
      description: `${event} event occurred`,
      userId,
      severity: event === 'UNAUTHORIZED_ACCESS' ? 'HIGH' : 'MEDIUM',
      details,
      ipAddress,
      userAgent,
      createdAt: new Date()
    }

    auditEventsStore.unshift(auditEvent)
    if (auditEventsStore.length > 1000) {
      auditEventsStore.splice(1000)
    }

    console.log('SECURITY:', auditEvent)
  }

  /**
   * Get recent events
   */
  static async getRecentEvents(limit: number = 100): Promise<AuditEvent[]> {
    return auditEventsStore.slice(0, limit)
  }

  /**
   * Get security events (high severity)
   */
  static async getSecurityEvents(limit: number = 50): Promise<AuditEvent[]> {
    return auditEventsStore
      .filter(event =>
        event.severity === 'HIGH' ||
        event.severity === 'CRITICAL' ||
        event.eventType?.includes('SECURITY') ||
        event.eventType === 'UNAUTHORIZED_ACCESS' ||
        event.eventType === 'ACCOUNT_LOCKED'
      )
      .slice(0, limit)
  }
}