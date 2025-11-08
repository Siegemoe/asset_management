// Account Lockout Service
import { prisma } from "@/lib/prisma"
// import { SimpleAuditLogger } from "./simpleAuditLogger"

export interface LockoutConfig {
  maxFailedAttempts: number
  lockoutDuration: number // in minutes
  progressiveLockout: boolean
  maxLockoutDuration: number // in minutes
}

export class AccountLockoutService {
  private static config: LockoutConfig = {
    maxFailedAttempts: 5,
    lockoutDuration: 15, // 15 minutes
    progressiveLockout: true,
    maxLockoutDuration: 1440, // 24 hours
  }

  /**
   * Record a login attempt and determine if account should be locked
   */
  static async recordLoginAttempt(
    userId: string,
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
    // Record the login attempt
    await prisma.userLoginAttempt.create({
      data: {
        userId: userId || 'unknown',
        email,
        success,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        reason: reason || null,
      },
    })

    // await SimpleAuditLogger.logLoginAttempt(userId, email, success, ipAddress, userAgent, reason)

    if (success) {
      // Successful login, reset failed attempts
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAttempt: new Date(),
            lastLoginSuccess: new Date(),
          },
        })
      }
      return { success: true, shouldLock: false }
    }

    // Failed login attempt
    if (!userId) {
      return { success: false, shouldLock: false, reason: "User not found" }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return { success: false, shouldLock: false, reason: "User not found" }
    }

    // Check if account is currently locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      // // await SimpleAuditLogger.logSecurityEvent('ACCOUNT_LOCKED', userId, {
      // //   reason: "Login attempt on locked account",
      // //   ipAddress,
      // //   userAgent
      // // }, ipAddress, userAgent)
      return {
        success: false,
        shouldLock: true,
        lockoutUntil: user.lockedUntil,
        reason: "Account is locked",
      }
    }

    // Increment failed attempts
    const failedAttempts = user.failedLoginAttempts + 1
    let shouldLock = false
    let lockoutDuration = this.config.lockoutDuration

    if (failedAttempts >= this.config.maxFailedAttempts) {
      shouldLock = true

      if (this.config.progressiveLockout) {
        // Progressive lockout: increase duration based on previous locks
        const previousLockCount = await this.getPreviousLockCount(userId)
        lockoutDuration = Math.min(
          this.config.lockoutDuration * Math.pow(2, previousLockCount),
          this.config.maxLockoutDuration
        )
      }

      const lockoutUntil = new Date()
      lockoutUntil.setMinutes(lockoutUntil.getMinutes() + lockoutDuration)

      // Lock the account
      await prisma.user.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: failedAttempts,
          lockedUntil: lockoutUntil,
          lastLoginAttempt: new Date(),
        },
      })

      // await SimpleAuditLogger.logSecurityEvent('ACCOUNT_LOCKED', userId, {
      //   reason: `Exceeded ${this.config.maxFailedAttempts} failed login attempts`,
      //   ipAddress,
      //   userAgent
      // }, ipAddress, userAgent)

      return {
        success: false,
        shouldLock: true,
        lockoutUntil,
        reason: `Account locked for ${lockoutDuration} minutes`,
      }
    }

    // Update failed attempts without locking
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: failedAttempts,
        lastLoginAttempt: new Date(),
      },
    })

    return {
      success: false,
      shouldLock: false,
      reason: `Invalid credentials (${failedAttempts}/${this.config.maxFailedAttempts} attempts)`,
    }
  }

  /**
   * Check if a user account is currently locked
   */
  static async isAccountLocked(userId: string): Promise<{
    locked: boolean
    lockoutUntil?: Date
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lockedUntil: true },
    })

    if (!user) {
      return { locked: false }
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return { locked: true, lockoutUntil: user.lockedUntil }
    }

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
      await prisma.user.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      })

      // await AuditLogger.logAccountUnlocked(userId, unlockedBy, ipAddress, userAgent)

      return { success: true, message: "Account unlocked successfully" }
    } catch (error) {
      return { success: false, message: "Failed to unlock account" }
    }
  }

  /**
   * Get the number of previous lockouts for progressive lockout calculation
   */
  private static async getPreviousLockCount(userId: string): Promise<number> {
    const count = await prisma.securityEvent.count({
      where: {
        userId,
        eventType: 'ACCOUNT_LOCKED',
      },
    })
    return count
  }

  /**
   * Clean up expired failed attempts (older than 24 hours)
   */
  static async cleanupExpiredAttempts(): Promise<number> {
    const cutoff = new Date()
    cutoff.setHours(cutoff.getHours() - 24)

    const deleted = await prisma.userLoginAttempt.deleteMany({
      where: {
        createdAt: { lt: cutoff },
        success: false,
      },
    })

    return deleted.count
  }

  /**
   * Get account lockout status and statistics
   */
  static async getLockoutStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        failedLoginAttempts: true,
        lockedUntil: true,
        lastLoginAttempt: true,
        lastLoginSuccess: true,
      },
    })

    if (!user) {
      return null
    }

    const recentFailedAttempts = await prisma.userLoginAttempt.count({
      where: {
        userId,
        success: false,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
      },
    })

    return {
      failedAttempts: user.failedLoginAttempts,
      isLocked: user.lockedUntil ? user.lockedUntil > new Date() : false,
      lockoutUntil: user.lockedUntil,
      lastLoginAttempt: user.lastLoginAttempt,
      lastLoginSuccess: user.lastLoginSuccess,
      recentFailedAttempts,
      maxAttempts: this.config.maxFailedAttempts,
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

// LockoutConfig is already exported above