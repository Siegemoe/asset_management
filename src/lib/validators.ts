// Validation utilities for forms and API endpoints
import { z } from 'zod'

// Common validation schemas
export const assetNumberSchema = z.string()
  .min(1, 'Asset number is required')
  .max(50, 'Asset number must be less than 50 characters')
  .regex(/^[A-Z0-9-]+$/, 'Asset number must contain only uppercase letters, numbers, and hyphens')

export const emailSchema = z.string().email('Invalid email address')

export const dateSchema = z.string().refine(
  (dateStr) => {
    const date = new Date(dateStr)
    return !isNaN(date.getTime()) && date <= new Date()
  },
  'Date must be valid and not in the future'
)

export const urlSchema = z.string().url('Invalid URL').optional().or(z.literal(''))

// Asset-related validation schemas
export const createAssetSchema = z.object({
  brand: z.string().min(1, 'Brand is required').max(100, 'Brand must be less than 100 characters'),
  manufacturerPart: z.string().min(1, 'Manufacturer part number is required').max(100, 'Part number must be less than 100 characters'),
  serialNumber: z.string().min(1, 'Serial number is required').max(100, 'Serial number must be less than 100 characters'),
  siteId: z.string().min(1, 'Site is required'),
  roomNumber: z.string().min(1, 'Room number is required').max(50, 'Room number must be less than 50 characters'),
  installedDate: dateSchema,
  type: z.enum(['WASHER', 'DRYER', 'DISH_WASHER', 'REFRIGERATOR', 'AIR_CONDITIONER', 'OVEN_STOVE']),
  imageUrl: urlSchema,
})

export const updateAssetSchema = createAssetSchema.partial()

// Site-related validation schemas
export const createSiteSchema = z.object({
  name: z.string().min(1, 'Site name is required').max(200, 'Site name must be less than 200 characters'),
  address: z.string().max(500, 'Address must be less than 500 characters').optional(),
})

export const updateSiteSchema = createSiteSchema.partial()

// Room-related validation schemas
export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required').max(100, 'Room name must be less than 100 characters'),
  siteId: z.string().min(1, 'Site is required'),
  status: z.enum(['OCCUPIED', 'VACANT', 'READY']).default('READY'),
  tenantName: z.string().max(200, 'Tenant name must be less than 200 characters').optional(),
})

export const updateRoomSchema = createRoomSchema.partial()

// User-related validation schemas
export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters').optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'SITE_MANAGER']).optional(),
  siteIds: z.array(z.string()).optional(),
})

// Utility functions for validation
export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email)
    return true
  } catch {
    return false
  }
}

export const validateAssetNumber = (assetNumber: string): boolean => {
  try {
    assetNumberSchema.parse(assetNumber)
    return true
  } catch {
    return false
  }
}

export const validateDate = (dateStr: string): boolean => {
  try {
    dateSchema.parse(dateStr)
    return true
  } catch {
    return false
  }
}

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ')
}

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}