import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAssetNumber(site: string, room: string): string {
  const year = new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000) // 1000-9999
  return `AM-${site.replace(/\s+/g, '').toUpperCase()}-${room.replace(/\s+/g, '').toUpperCase()}-${year}-${random}`
}
