// Security Middleware and Utilities
import { NextRequest } from "next/server"
import bcrypt from 'bcryptjs'
// import crypto from "crypto" // Not compatible with Edge Runtime

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  max: number // Max requests per window
  message?: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

export class SecurityMiddleware {
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>()

  /**
   * Rate limiting middleware
   */
  static rateLimit(
    identifier: string,
    config: RateLimitConfig
  ): { allowed: boolean; remaining: number; resetTime: number; message?: string } {
    const key = `rate_limit:${identifier}`
    const now = Date.now()
    
    const current = this.rateLimitStore.get(key)
    
    if (!current || now > current.resetTime) {
      // Reset or initialize
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      })
      return {
        allowed: true,
        remaining: config.max - 1,
        resetTime: now + config.windowMs
      }
    }
    
    if (current.count >= config.max) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime,
        message: config.message || `Rate limit exceeded. Try again in ${Math.ceil((current.resetTime - now) / 1000)} seconds.`
      }
    }
    
    // Increment counter
    current.count++
    this.rateLimitStore.set(key, current)
    
    return {
      allowed: true,
      remaining: config.max - current.count,
      resetTime: current.resetTime
    }
  }

  /**
   * CSRF Protection
   */
  static generateCSRFToken(): string {
    // Use Web Crypto API for Edge Runtime compatibility
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  static verifyCSRFToken(request: NextRequest): { valid: boolean; reason?: string } {
    try {
      const csrfToken = request.headers.get('x-csrf-token')
      const origin = request.headers.get('origin')
      const referer = request.headers.get('referer')
      
      if (!csrfToken) {
        return { valid: false, reason: 'CSRF token missing' }
      }
      
      // Check if token format is valid
      if (!/^[a-f0-9]{64}$/.test(csrfToken)) {
        return { valid: false, reason: 'Invalid CSRF token format' }
      }
      
      // In production, you would also verify against stored tokens
      // For now, we'll use a simple validation approach
      
      return { valid: true }
    } catch (error) {
      return { valid: false, reason: 'CSRF validation error' }
    }
  }

  /**
   * Validate request origin
   */
  static validateOrigin(
    request: NextRequest,
    allowedOrigins: string[]
  ): { valid: boolean; reason?: string } {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    
    if (!origin && !referer) {
      // Allow requests without origin (e.g., mobile apps, API clients)
      return { valid: true }
    }
    
    const requestOrigin = origin || referer
    if (!requestOrigin) {
      return { valid: false, reason: 'No origin or referer header' }
    }
    
    const hostname = new URL(requestOrigin).hostname
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed === hostname) return true
      if (allowed.startsWith('*.')) {
        return hostname.endsWith(allowed.substring(2))
      }
      return false
    })
    
    return {
      valid: isAllowed,
      reason: isAllowed ? undefined : `Origin ${hostname} not allowed`
    } as { valid: boolean; reason?: string }
  }

  /**
   * Security headers middleware
   */
  static getSecurityHeaders(): Record<string, string> {
    return {
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      // Enable XSS protection
      'X-XSS-Protection': '1; mode=block',
      // Force HTTPS
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      // Referrer policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Content Security Policy (basic)
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self';",
      // Permissions Policy
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    }
  }

  /**
   * Input sanitization utilities
   */
  static sanitizeString(input: string, maxLength?: number): string {
    if (typeof input !== 'string') {
      return ''
    }
    
    let sanitized = input
      .trim()
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength)
    }
    
    return sanitized
  }

  static sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeString(email, 254)
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(sanitized) ? sanitized.toLowerCase() : ''
  }

  static sanitizeUrl(url: string): string {
    const sanitized = this.sanitizeString(url, 2048)
    try {
      const parsed = new URL(sanitized)
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return ''
      }
      return parsed.toString()
    } catch {
      return ''
    }
  }

  /**
   * Password strength validation
   */
  static validatePasswordStrength(password: string): {
    score: number
    feedback: string[]
    valid: boolean
  } {
    const feedback: string[] = []
    let score = 0

    // Length
    if (password.length >= 8) score += 20
    if (password.length >= 12) score += 20
    if (password.length >= 16) score += 10

    // Character types
    if (/[a-z]/.test(password)) score += 10
    if (/[A-Z]/.test(password)) score += 10
    if (/\d/.test(password)) score += 10
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10

    // Patterns
    if (/(.)\1{2,}/.test(password)) score -= 10 // Penalize repeated characters
    if (/123|abc|qwe|asd/i.test(password)) score -= 15 // Penalize common patterns

    // Feedback
    if (password.length < 8) feedback.push('Password must be at least 8 characters long')
    if (!/[a-z]/.test(password)) feedback.push('Include lowercase letters')
    if (!/[A-Z]/.test(password)) feedback.push('Include uppercase letters')
    if (!/\d/.test(password)) feedback.push('Include numbers')
    if (!/[!@#$%^&*]/.test(password)) feedback.push('Include special characters')
    if (/(.)\1{2,}/.test(password)) feedback.push('Avoid repeated characters')
    if (/123|abc|qwe|asd/i.test(password)) feedback.push('Avoid common patterns')

    const valid = score >= 40 && feedback.length === 0

    return {
      score: Math.max(0, Math.min(100, score)),
      feedback,
      valid
    }
  }

  /**
   * Generate secure random string
   */
  static generateSecureRandomString(length: number, charset?: string): string {
    const defaultCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const chars = charset || defaultCharset
    let result = ''
    
    // Use Web Crypto API for Edge Runtime compatibility
    const randomValues = new Uint8Array(length)
    crypto.getRandomValues(randomValues)
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt((randomValues[i] || 0) % chars.length)
    }
    
    return result
  }

  /**
   * Hash data with salt
   */
  static async hashWithSalt(data: string, salt?: string): Promise<{ hash: string; salt: string }> {
    // Use bcryptjs for password hashing (Edge Runtime compatible)
    const saltRounds = 12
    const actualSalt = salt || await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(data, actualSalt)
    return { hash, salt: actualSalt }
  }

  /**
   * Verify hash
   */
  static async verifyHash(data: string, hash: string, salt: string): Promise<boolean> {
    // Use bcryptjs for password verification (Edge Runtime compatible)
    return await bcrypt.compare(data, hash)
  }

  /**
   * Detect suspicious patterns
   */
  static detectSuspiciousPatterns(input: string): {
    suspicious: boolean
    patterns: string[]
  } {
    const patterns: string[] = []
    
    // SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
      /('|(\\)|(--|#|\/\*))/gi,
      /((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi,
    ]
    
    // XSS patterns
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ]
    
    // Path traversal patterns
    const pathPatterns = [
      /\.\./g,
      /[\\/]/g
    ]
    
    // Command injection patterns
    const commandPatterns = [
      /;|\||&&|\|\|/g,
      /[`$]/g
    ]
    
    // Check patterns
    const allPatterns = [...sqlPatterns, ...xssPatterns, ...pathPatterns, ...commandPatterns]
    allPatterns.forEach((pattern, index) => {
      if (pattern.test(input)) {
        const patternType = index < sqlPatterns.length ? 'SQL injection' :
                          index < sqlPatterns.length + xssPatterns.length ? 'XSS' :
                          index < sqlPatterns.length + xssPatterns.length + pathPatterns.length ? 'Path traversal' : 'Command injection'
        patterns.push(patternType)
      }
    })
    
    return {
      suspicious: patterns.length > 0,
      patterns
    }
  }

  /**
   * Log security events
   */
  static logSecurityEvent(
    event: string,
    details: Record<string, any> = {},
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM'
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      details
    }
    
    console.log('SECURITY:', logEntry)
    
    // In production, you would send this to a logging service
    // or store it in a security events table
  }

  /**
   * Clean up expired rate limit entries
   */
  static cleanupRateLimitStore(): void {
    const now = Date.now()
    for (const [key, value] of this.rateLimitStore.entries()) {
      if (now > value.resetTime) {
        this.rateLimitStore.delete(key)
      }
    }
  }
}

// RateLimitConfig is already exported above