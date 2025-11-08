import { prisma } from "@/lib/prisma"

export interface UserWithPermissions {
  id: string
  role: string
  siteIds: string
}

export interface AssetWithRelations {
  id: string
  assetNumber: string
  brand: string
  manufacturerPart: string
  serialNumber: string
  siteId: string
  roomId: string
  installedDate: Date
  type: string
  site: {
    id: string
    name: string
    address: string | null
  }
  room: {
    id: string
    name: string
  }
  images: {
    id: string
    url: string
  }[]
  user: {
    name: string | null
    email: string
  }
}

/**
 * Get user with role and site permissions
 */
export async function getUserWithPermissions(userId: string): Promise<UserWithPermissions | null> {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      id: true, 
      role: true, 
      siteIds: true 
    }
  })
}

/**
 * Parse siteIds from JSON string
 */
export function parseSiteIds(siteIdsField: string | null): string[] {
  if (!siteIdsField) return []
  try {
    return JSON.parse(siteIdsField)
  } catch {
    return []
  }
}

/**
 * Check if user can access a specific site
 */
export function canUserAccessSite(user: UserWithPermissions, siteId: string): boolean {
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
    return true
  }
  
  if (user.role === 'SITE_MANAGER') {
    const userSiteIds = parseSiteIds(user.siteIds)
    return userSiteIds.includes(siteId)
  }
  
  return false
}

/**
 * Build Prisma where clause based on user permissions
 */
export function buildAssetFilter(user: UserWithPermissions) {
  if (user.role === 'SUPER_ADMIN') {
    return {}
  }
  
  if (user.role === 'ADMIN' || user.role === 'SITE_MANAGER') {
    const userSiteIds = parseSiteIds(user.siteIds)
    return { siteId: { in: userSiteIds } }
  }
  
  return {}
}

/**
 * Get assets with authorization and proper filtering
 */
export async function getAssetsForUser(userId: string): Promise<AssetWithRelations[]> {
  const user = await getUserWithPermissions(userId)
  if (!user) {
    return [] // Return empty array instead of throwing error
  }

  const whereClause = buildAssetFilter(user)
  
  return await prisma.asset.findMany({
    where: whereClause,
    include: {
      site: true,
      room: true,
      images: true,
      user: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

/**
 * Get single asset with authorization check
 */
export async function getAssetForUser(userId: string, assetId: string): Promise<AssetWithRelations | null> {
  const user = await getUserWithPermissions(userId)
  if (!user) {
    throw new Error("User not found")
  }

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    include: {
      site: true,
      room: true,
      images: true,
      user: { select: { name: true, email: true } }
    }
  })

  if (!asset) {
    return null
  }

  // Check authorization
  if (!canUserAccessSite(user, asset.siteId)) {
    throw new Error("Unauthorized")
  }

  return asset
}