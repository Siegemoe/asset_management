// Enhanced Session Management Service
import { prisma } from "@/lib/prisma"
import { SimpleAuditLogger } from "./simpleAuditLogger"

export interface SessionConfig {
  sessionTimeout: number // in minutes
  maxConcurrentSessions: number
  refreshTokenRotation: boolean
  requireHTTPS: boolean
  sessionFingerprinting: boolean
}

export interface SessionInfo {
  id: string
  userId: string
  sessionToken: string
  refreshToken: string | undefined
  deviceInfo: string | undefined
  ipAddress: string | undefined
  userAgent: string | undefined
  createdAt: Date
  lastActivity: Date
  expiresAt: Date
  status: 'active' | 'expired' | 'revoked'
}

export class SessionManager {
  private static config: SessionConfig = {
    sessionTimeout: 30, // 30 minutes
    maxConcurrentSessions: 3,
    refreshTokenRotation: true,
    requireHTTPS: true,
    sessionFingerprinting: true,
  }

  // In-memory session storage (in production, this would be a database)
  private static sessions: Map<string, SessionInfo> = new Map()

  /**
   * Create a new session
   */
  static async createSession(
    userId: string,
    sessionToken: string,
    refreshToken?: string,
    deviceInfo?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<SessionInfo> {
    // Check concurrent session limit
    await this.enforceSessionLimit(userId)

    const expiresAt = new Date(Date.now() + this.config.sessionTimeout * 60 * 1000)

    const now = new Date()
    const sessionInfo: SessionInfo = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sessionToken,
      refreshToken: refreshToken || undefined,
      deviceInfo: deviceInfo || undefined,
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
      createdAt: now,
      lastActivity: now,
      expiresAt,
      status: 'active'
    }

    // Store session in memory
    this.sessions.set(sessionToken, sessionInfo)

    // Log session creation
    await SimpleAuditLogger.logSecurityEvent('PASSWORD_CHANGE', userId, {
      action: 'session_created',
      sessionId: sessionInfo.id,
      deviceInfo,
      timestamp: new Date().toISOString()
    }, ipAddress, userAgent)

    // In a real implementation, you would store this in the database
    console.log('SESSION_CREATED:', sessionInfo)

    return sessionInfo
  }

  /**
   * Validate and refresh session
   */
  static async validateSession(sessionToken: string, ipAddress?: string, userAgent?: string): Promise<{
    valid: boolean
    session?: SessionInfo
    reason?: string
  }> {
    try {
      const session = this.sessions.get(sessionToken)
      
      if (!session) {
        return { valid: false, reason: 'Session not found' }
      }

      if (session.expiresAt < new Date()) {
        session.status = 'expired'
        this.sessions.set(sessionToken, session)
        return { valid: false, reason: 'Session expired' }
      }

      if (session.status !== 'active') {
        return { valid: false, reason: `Session ${session.status}` }
      }

      // Update last activity
      session.lastActivity = new Date()
      this.sessions.set(sessionToken, session)

      return { valid: true, session }
    } catch (error) {
      console.error('Error validating session:', error)
      return { valid: false, reason: 'Session validation failed' }
    }
  }

  /**
   * Refresh session token
   */
  static async refreshSession(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{
    success: boolean
    newSessionToken?: string
    newRefreshToken?: string
    reason?: string
  }> {
    try {
      if (this.config.refreshTokenRotation) {
        // Generate new tokens
        const newSessionToken = this.generateSecureToken(32)
        const newRefreshToken = this.generateSecureToken(32)

        await SimpleAuditLogger.logSecurityEvent('PASSWORD_CHANGE', 'system', {
          action: 'session_refreshed',
          oldRefreshToken: refreshToken.substring(0, 8) + '...',
          newRefreshToken: newRefreshToken.substring(0, 8) + '...',
          timestamp: new Date().toISOString()
        }, ipAddress, userAgent)

        return {
          success: true,
          newSessionToken,
          newRefreshToken
        }
      }

      return { success: false, reason: 'Token rotation disabled' }
    } catch (error) {
      console.error('Error refreshing session:', error)
      return { success: false, reason: 'Session refresh failed' }
    }
  }

  /**
   * Invalidate a session
   */
  static async invalidateSession(
    sessionToken: string,
    userId?: string,
    reason: string = 'manual_invalidation',
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean }> {
    try {
      const session = this.sessions.get(sessionToken)
      
      if (session) {
        session.status = 'revoked'
        this.sessions.set(sessionToken, session)
      }

      await SimpleAuditLogger.logSecurityEvent('PASSWORD_CHANGE', userId || 'system', {
        action: 'session_invalidated',
        reason,
        sessionToken: sessionToken.substring(0, 8) + '...',
        timestamp: new Date().toISOString()
      }, ipAddress, userAgent)

      return { success: true }
    } catch (error) {
      console.error('Error invalidating session:', error)
      return { success: false }
    }
  }

  /**
   * Invalidate all sessions for a user
   */
  static async invalidateAllUserSessions(
    userId: string,
    reason: string = 'security_reason',
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; invalidatedCount: number }> {
    try {
      let invalidatedCount = 0
      
      for (const [token, session] of this.sessions.entries()) {
        if (session.userId === userId && session.status === 'active') {
          session.status = 'revoked'
          this.sessions.set(token, session)
          invalidatedCount++
        }
      }

      await SimpleAuditLogger.logSecurityEvent('PASSWORD_CHANGE', userId, {
        action: 'all_sessions_invalidated',
        reason,
        invalidatedCount,
        timestamp: new Date().toISOString()
      }, ipAddress, userAgent)

      return { success: true, invalidatedCount }
    } catch (error) {
      console.error('Error invalidating all sessions:', error)
      return { success: false, invalidatedCount: 0 }
    }
  }

  /**
   * Get all active sessions for a user
   */
  static async getUserSessions(userId: string): Promise<SessionInfo[]> {
    try {
      return Array.from(this.sessions.values())
        .filter(session => session.userId === userId)
        .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
    } catch (error) {
      console.error('Error getting user sessions:', error)
      return []
    }
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions(): Promise<number> {
    try {
      const now = new Date()
      let cleanedCount = 0
      
      for (const [token, session] of this.sessions.entries()) {
        if (session.expiresAt < now || session.status === 'expired') {
          this.sessions.delete(token)
          cleanedCount++
        }
      }
      
      return cleanedCount
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error)
      return 0
    }
  }

  /**
   * Enforce session limit per user
   */
  private static async enforceSessionLimit(userId: string): Promise<void> {
    const userSessions = await this.getUserSessions(userId)
    
    if (userSessions.length >= this.config.maxConcurrentSessions) {
      // Invalidate the oldest session
      const oldestSession = userSessions.reduce((oldest, session) => 
        session.lastActivity < oldest.lastActivity ? session : oldest
      )
      
      await this.invalidateSession(oldestSession.sessionToken, userId, 'concurrent_session_limit')
    }
  }

  /**
   * Check for suspicious activity
   */
  static async checkSuspiciousActivity(
    userId: string,
    currentIpAddress: string,
    currentUserAgent: string
  ): Promise<{
    suspicious: boolean
    reasons: string[]
  }> {
    const reasons: string[] = []
    let suspicious = false

    try {
      const sessions = await this.getUserSessions(userId)
      
      // Check for IP address changes
      const ipAddresses = [...new Set(sessions.map(s => s.ipAddress))]
      if (ipAddresses.length > 1 && !ipAddresses.includes(currentIpAddress)) {
        reasons.push('Multiple IP addresses detected')
        suspicious = true
      }

      // Check for new device/user agent
      const userAgents = [...new Set(sessions.map(s => s.userAgent))]
      if (userAgents.length > 1 && !userAgents.includes(currentUserAgent)) {
        reasons.push('Multiple devices detected')
        suspicious = true
      }

      // Check for rapid session creation
      const recentSessions = sessions.filter(s => 
        Date.now() - s.createdAt.getTime() < 5 * 60 * 1000 // Last 5 minutes
      )
      if (recentSessions.length > this.config.maxConcurrentSessions) {
        reasons.push('Rapid session creation detected')
        suspicious = true
      }

      if (suspicious) {
        await SimpleAuditLogger.logSecurityEvent('UNAUTHORIZED_ACCESS', userId, {
          action: 'suspicious_activity',
          reasons,
          currentIpAddress,
          currentUserAgent
        }, currentIpAddress, currentUserAgent)
      }

      return { suspicious, reasons }
    } catch (error) {
      console.error('Error checking suspicious activity:', error)
      return { suspicious: false, reasons: [] }
    }
  }

  /**
   * Generate secure random token
   */
  private static generateSecureToken(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''
    
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return token
  }

  /**
   * Get session statistics
   */
  static async getSessionStats(): Promise<{
    totalSessions: number
    activeSessions: number
    expiredSessions: number
    averageSessionDuration: number
  }> {
    try {
      const sessions = Array.from(this.sessions.values())
      const now = new Date()
      
      const activeSessions = sessions.filter(s => s.status === 'active' && s.expiresAt > now).length
      const expiredSessions = sessions.filter(s => s.status === 'expired' || s.expiresAt <= now).length
      
      // Calculate average duration for active sessions
      const activeSessionDurations = sessions
        .filter(s => s.status === 'active')
        .map(s => now.getTime() - s.createdAt.getTime())
      
      const averageSessionDuration = activeSessionDurations.length > 0
        ? activeSessionDurations.reduce((sum, duration) => sum + duration, 0) / activeSessionDurations.length
        : 0
      
      return {
        totalSessions: sessions.length,
        activeSessions,
        expiredSessions,
        averageSessionDuration: Math.round(averageSessionDuration / 1000 / 60) // Convert to minutes
      }
    } catch (error) {
      console.error('Error getting session stats:', error)
      return {
        totalSessions: 0,
        activeSessions: 0,
        expiredSessions: 0,
        averageSessionDuration: 0
      }
    }
  }

  /**
   * Update configuration
   */
  static updateConfig(newConfig: Partial<SessionConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  static getConfig(): SessionConfig {
    return { ...this.config }
  }
}

// SessionConfig and SessionInfo are already exported above