// Formatting utilities for dates, numbers, and text

// Date formatting utilities
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

  if (diffInMinutes < 1) {
    return 'just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  } else {
    return formatDate(dateObj)
  }
}

// Number formatting utilities
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency
  })
}

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${formatNumber(value * 100, decimals)}%`
}

// Text formatting utilities
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const titleCase = (str: string): string => {
  return str
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ')
}

export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, char => char.toUpperCase())
}

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if the number is valid (10 digits for US)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  return phone // Return original if format is not recognized
}

// Asset-specific formatting
export const formatAssetNumber = (assetNumber: string): string => {
  return assetNumber.toUpperCase()
}

export const formatSerialNumber = (serialNumber: string): string => {
  return serialNumber.toUpperCase()
}

export const formatBrandName = (brand: string): string => {
  return titleCase(brand.toLowerCase())
}

// Status formatting
export const formatStatus = (status: string): string => {
  return status
    .toLowerCase()
    .split('_')
    .map(word => capitalizeFirst(word))
    .join(' ')
}

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Site statuses
    'ACTIVE': 'green',
    'SUSPENDED': 'yellow',
    'ARCHIVED': 'gray',
    
    // Room statuses
    'OCCUPIED': 'green',
    'VACANT': 'red',
    'READY': 'yellow',
    
    // Asset statuses
    'MAINTENANCE': 'yellow',
    'RETIRED': 'gray',
    
    // User roles
    'SUPER_ADMIN': 'purple',
    'ADMIN': 'blue',
    'SITE_MANAGER': 'indigo'
  }
  
  return statusColors[status] || 'gray'
}

// File size formatting
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)
  
  return `${formatNumber(size, i === 0 ? 0 : 1)} ${sizes[i]}`
}

// URL formatting
export const formatUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}

export const getDomainFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(formatUrl(url))
    return urlObj.hostname
  } catch {
    return url
  }
}