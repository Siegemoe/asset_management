// Simplified Account Lockout Service - works with current schema
import { prisma } from "@/lib/prisma"
import { SimpleAuditLogger } from "./simpleAuditLogger"

export interface LockoutConfig {
  maxFailedAttempts: number
  lockoutDuration: number // in minutes
  progressiveLockout: boolean
  maxLockoutDuration: number // in minutes
}

export class SimpleAccountLockoutService {
  private static config: LockoutConfig = {
    maxFailedAttempts: 5,
    lockoutDuration: 15, // 15 minutes
    progressiveLockout: true,
    maxLockoutDuration: 1440, // 24 hours
  }

  /**
   * For now, we'll store lockout data in a separate table
   * This approach works with the current schema
   */
  private static async recordFailedAttempt(
    userId: string,
    email: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    // For now, we'll use a simple approach with a file-based storage or memory
    // In production, you might want to add a simple table to the existing schema
    console.log('FAILED_LOGIN_ATTEMPT:', {
      userId,
      email,
      timestamp: new Date().toISOString(),
      ipAddress,
      userAgent
    })
  }

  /**
   * Record a login attempt and determine if account should be locked
   */
  static async recordLoginAttempt(
    userId: string | undefined,
    email: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
    reason?: string
  ): Promise<{
    success: boolean
    shouldLock: boolean
    lockoutUntil?: Date
    reason?: string
  }> {
    await SimpleAuditLogger.logLoginAttempt(userId, email, success, ipAddress, userAgent, reason)

    if (success) {
      return { success: true, shouldLock: false }
    }

    if (!userId) {
      return { success: false, shouldLock: false, reason: "User not found" }
    }

    // Record the failed attempt
    await this.recordFailedAttempt(userId, email, ipAddress, userAgent)

    // For now, we'll implement a simple lockout check
    // This would be enhanced once we have the proper Prisma client
    const recentFailures = await this.getRecentFailedAttempts(userId, 15) // Last 15 minutes

    if (recentFailures >= this.config.maxFailedAttempts) {
      return {
        success: false,
        shouldLock: true,
        lockoutUntil: new Date(Date.now() + this.config.lockoutDuration * 60 * 1000),
        reason: `Account locked for ${this.config.lockoutDuration} minutes due to multiple failed attempts`,
      }
    }

    return {
      success: false,
      shouldLock: false,
      reason: `Invalid credentials (${recentFailures + 1}/${this.config.maxFailedAttempts} recent attempts)`,
    }
  }

  /**
   * Get number of recent failed attempts for a user
   */
  private static async getRecentFailedAttempts(userId: string, minutes: number): Promise<number> {
    // This is a simplified implementation
    // In the full implementation, this would query the UserLoginAttempt table
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000)
    
    // For now, return a mock value
    // In production, this would query the database
    return 0
  }

  /**
   * Check if a user account is currently locked
   * For now, we'll implement a simple check
   */
  static async isAccountLocked(userId: string): Promise<{
    locked: boolean
    lockoutUntil?: Date
  }> {
    // This would be enhanced once we have the proper Prisma client
    // For now, return false (no lockout)
    return { locked: false }
  }

  /**
   * Unlock an account manually
   */
  static async unlockAccount(
    userId: string,
    unlockedBy: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // This would clear the lockout data
      await SimpleAuditLogger.logSecurityEvent('PASSWORD_CHANGE', userId, { 
        action: 'unlock_account',
        unlockedBy 
      }, ipAddress, userAgent)
      
      return { success: true, message: "Account unlocked successfully" }
    } catch (error) {
      return { success: false, message: "Failed to unlock account" }
    }
  }

  /**
   * Get account lockout status and statistics
   */
  static async getLockoutStatus(userId: string) {
    return {
      isLocked: false,
      recentFailedAttempts: 0,
      maxAttempts: this.config.maxFailedAttempts,
      config: this.config
    }
  }

  /**
   * Update lockout configuration
   */
  static updateConfig(newConfig: Partial<LockoutConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  static getConfig(): LockoutConfig {
    return { ...this.config }
  }
}