// Password Policy Service
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { SimpleAuditLogger } from "./simpleAuditLogger"

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  maxHistory: number
  maxAge: number // in days, 0 means no expiration
  preventCommonPasswords: boolean
}

export class PasswordPolicyService {
  private static policy: PasswordPolicy = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxHistory: 5,
    maxAge: 90,
    preventCommonPasswords: true,
  }

  /**
   * Validate password against policy
   */
  static validatePassword(password: string): {
    valid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (password.length < this.policy.minLength) {
      errors.push(`Password must be at least ${this.policy.minLength} characters long`)
    }

    if (this.policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }

    if (this.policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }

    if (this.policy.requireNumbers && !/\d/.test(password)) {
      errors.push("Password must contain at least one number")
    }

    if (this.policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character")
    }

    if (this.policy.preventCommonPasswords && this.isCommonPassword(password)) {
      errors.push("Password is too common. Please choose a more unique password")
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Check if password is commonly used
   */
  private static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
      '1234567890', 'dragon', 'master', 'iloveyou', 'sunshine',
      'princess', 'football', 'charlie', 'aa123456', 'donald',
      'qwerty123', '1q2w3e4r', 'password1', 'zaq12wsx'
    ]

    return commonPasswords.includes(password.toLowerCase())
  }

  /**
   * Hash password with bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12)
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  /**
   * Check if password is in user's history
   */
  static async isPasswordInHistory(
    userId: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHistory: true }
    })

    if (!user?.passwordHistory) {
      return false
    }

    try {
      const passwordHistory = JSON.parse(user.passwordHistory) as string[]
      
      // Check against all passwords in history
      for (const oldPasswordHash of passwordHistory) {
        if (await this.verifyPassword(newPassword, oldPasswordHash)) {
          return true
        }
      }
    } catch (error) {
      // If parsing fails, assume no history or invalid format
      console.error('Error parsing password history:', error)
    }

    return false
  }

  /**
   * Add password to user's history
   */
  static async addPasswordToHistory(userId: string, newPasswordHash: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHistory: true }
    })

    let passwordHistory: string[] = []
    
    if (user?.passwordHistory) {
      try {
        passwordHistory = JSON.parse(user.passwordHistory) as string[]
      } catch (error) {
        passwordHistory = []
      }
    }

    // Add new password to history
    passwordHistory.unshift(newPasswordHash)

    // Keep only the last N passwords
    passwordHistory = passwordHistory.slice(0, this.policy.maxHistory)

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHistory: JSON.stringify(passwordHistory)
      }
    })
  }

  /**
   * Check if password has expired
   */
  static async isPasswordExpired(userId: string): Promise<boolean> {
    if (this.policy.maxAge === 0) {
      return false // No expiration
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastPasswordChange: true }
    })

    if (!user?.lastPasswordChange) {
      return true // Consider expired if no change date
    }

    const daysSinceChange = Math.floor(
      (Date.now() - user.lastPasswordChange.getTime()) / (1000 * 60 * 60 * 24)
    )

    return daysSinceChange >= this.policy.maxAge
  }

  /**
   * Update password with all security checks
   */
  static async updatePassword(
    userId: string,
    newPassword: string,
    currentPassword: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      // Validate new password
      const validation = this.validatePassword(newPassword)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        }
      }

      // Get current user with password
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user?.password) {
        return {
          success: false,
          error: "Current password verification failed"
        }
      }

      // Verify current password
      const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        await SimpleAuditLogger.logSecurityEvent('UNAUTHORIZED_ACCESS', userId, {
          action: 'password_change_failed',
          reason: 'Invalid current password'
        }, ipAddress, userAgent)
        
        return {
          success: false,
          error: "Current password is incorrect"
        }
      }

      // Check if new password is in history
      if (await this.isPasswordInHistory(userId, newPassword)) {
        return {
          success: false,
          error: `You cannot reuse any of your last ${this.policy.maxHistory} passwords`
        }
      }

      // Hash new password
      const newPasswordHash = await this.hashPassword(newPassword)

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: newPasswordHash,
          lastPasswordChange: new Date()
        }
      })

      // Add to password history
      await this.addPasswordToHistory(userId, newPasswordHash)

      // Log the password change
      await SimpleAuditLogger.logSecurityEvent('PASSWORD_CHANGE', userId, {
        action: 'password_changed',
        timestamp: new Date().toISOString()
      }, ipAddress, userAgent)

      return { success: true }
    } catch (error) {
      console.error('Error updating password:', error)
      return {
        success: false,
        error: "An error occurred while updating password"
      }
    }
  }

  /**
   * Generate a secure random password
   */
  static generateSecurePassword(): string {
    const length = Math.max(this.policy.minLength, 16)
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
    let password = ''
    
    // Ensure we have at least one character from each required category
    const requiredChars = []
    if (this.policy.requireUppercase) requiredChars.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    if (this.policy.requireLowercase) requiredChars.push('abcdefghijklmnopqrstuvwxyz')
    if (this.policy.requireNumbers) requiredChars.push('0123456789')
    if (this.policy.requireSpecialChars) requiredChars.push('!@#$%^&*()_+-=[]{}|;:,.<>?')
    
    // Add one character from each required category
    requiredChars.forEach(charSet => {
      password += charSet.charAt(Math.floor(Math.random() * charSet.length))
    })
    
    // Fill the rest randomly
    while (password.length < length) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }

  /**
   * Get password strength score (0-100)
   */
  static getPasswordStrength(password: string): {
    score: number
    feedback: string[]
  } {
    let score = 0
    const feedback: string[] = []

    // Length
    if (password.length >= 8) score += 20
    if (password.length >= 12) score += 20
    if (password.length >= 16) score += 10

    // Character types
    if (/[a-z]/.test(password)) score += 10
    if (/[A-Z]/.test(password)) score += 10
    if (/\d/.test(password)) score += 10
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10

    // Special patterns
    if (password.length >= 12 && /[a-zA-Z]/.test(password) && /\d/.test(password)) score += 5
    if (/[a-zA-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) score += 5

    // Feedback
    if (score < 30) feedback.push('Very weak password')
    else if (score < 50) feedback.push('Weak password')
    else if (score < 70) feedback.push('Fair password')
    else if (score < 90) feedback.push('Good password')
    else feedback.push('Strong password')

    if (password.length < 12) feedback.push('Add more characters')
    if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters')
    if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters')
    if (!/\d/.test(password)) feedback.push('Add numbers')
    if (!/[!@#$%^&*]/.test(password)) feedback.push('Add special characters')

    return { score: Math.min(score, 100), feedback }
  }

  /**
   * Update policy configuration
   */
  static updatePolicy(newPolicy: Partial<PasswordPolicy>) {
    this.policy = { ...this.policy, ...newPolicy }
  }

  /**
   * Get current policy
   */
  static getPolicy(): PasswordPolicy {
    return { ...this.policy }
  }
}

// PasswordPolicy is already exported above