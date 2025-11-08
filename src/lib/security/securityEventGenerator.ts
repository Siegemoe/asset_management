// Security Event Generator - for testing and demonstration
import { SimpleAuditLogger } from "./simpleAuditLogger"

export class SecurityEventGenerator {
  /**
   * Generate test security events for demonstration
   */
  static async generateTestEvents() {
    const events = [
      {
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        eventType: 'LOGIN_FAILURE',
        description: 'Failed login attempt - incorrect password',
        severity: 'MEDIUM' as const,
        userId: 'user123'
      },
      {
        ipAddress: '203.0.113.45',
        userAgent: 'curl/7.68.0',
        eventType: 'UNAUTHORIZED_ACCESS',
        description: 'Unauthorized access attempt to admin panel',
        severity: 'HIGH' as const,
        userId: undefined
      },
      {
        ipAddress: '198.51.100.23',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        eventType: 'LOGIN_SUCCESS',
        description: 'Successful login from new device',
        severity: 'LOW' as const,
        userId: 'admin456'
      },
      {
        ipAddress: '192.168.1.150',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        eventType: 'BRUTE_FORCE',
        description: 'Multiple failed login attempts detected from same IP',
        severity: 'HIGH' as const,
        userId: 'user789'
      },
      {
        ipAddress: '10.0.0.50',
        userAgent: 'PostmanRuntime/7.32.3',
        eventType: 'API_ACCESS',
        description: 'API access to security dashboard',
        severity: 'LOW' as const,
        userId: 'admin456'
      }
    ]

    for (const eventData of events) {
      // Simulate different timestamps
      const timestamp = new Date(Date.now() - Math.random() * 3600000) // Within last hour
      
      // Log each event
      if (eventData.eventType === 'LOGIN_FAILURE') {
        await SimpleAuditLogger.logLoginAttempt(
          eventData.userId,
          'user@example.com',
          false,
          eventData.ipAddress,
          eventData.userAgent,
          'Incorrect password'
        )
      } else if (eventData.eventType === 'LOGIN_SUCCESS') {
        await SimpleAuditLogger.logLoginAttempt(
          eventData.userId,
          'admin@example.com',
          true,
          eventData.ipAddress,
          eventData.userAgent
        )
      } else if (eventData.eventType === 'UNAUTHORIZED_ACCESS') {
        await SimpleAuditLogger.logSecurityEvent(
          'UNAUTHORIZED_ACCESS',
          eventData.userId || 'unknown',
          {
            attemptedResource: '/admin',
            method: 'GET',
            blocked: true
          },
          eventData.ipAddress,
          eventData.userAgent
        )
      } else {
        // Generic security event
        await SimpleAuditLogger.logSecurityEvent(
          'UNAUTHORIZED_ACCESS',
          eventData.userId || 'system',
          {
            eventType: eventData.eventType,
            description: eventData.description
          },
          eventData.ipAddress,
          eventData.userAgent
        )
      }
    }
  }

  /**
   * Generate failed login events
   */
  static async generateFailedLogins(count: number = 5) {
    for (let i = 0; i < count; i++) {
      const ipAddress = `192.168.1.${Math.floor(Math.random() * 255)}`
      await SimpleAuditLogger.logLoginAttempt(
        'user123',
        'user@example.com',
        false,
        ipAddress,
        'Mozilla/5.0 (test)',
        'Incorrect password'
      )
      // Add small delay to spread events
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  /**
   * Generate session events
   */
  static async generateSessionEvents() {
    // Generate some session-related events
    await SimpleAuditLogger.logSecurityEvent(
      'PASSWORD_CHANGE',
      'admin456',
      {
        sessionId: 'sess_' + Date.now(),
        deviceInfo: 'Desktop Chrome',
        location: 'New York, US',
        eventType: 'SESSION_CREATED'
      },
      '192.168.1.100',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    )

    await SimpleAuditLogger.logSecurityEvent(
      'PASSWORD_CHANGE',
      'user789',
      {
        sessionId: 'sess_' + (Date.now() - 3600000),
        reason: 'timeout',
        eventType: 'SESSION_EXPIRED'
      },
      '10.0.0.25',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    )
  }

  /**
   * Generate IP blocking events
   */
  static async generateIPBlockingEvents() {
    const suspiciousIPs = [
      '203.0.113.45',
      '198.51.100.123',
      '192.0.2.88'
    ]

    for (const ip of suspiciousIPs) {
      await SimpleAuditLogger.logSecurityEvent(
        'ACCOUNT_LOCKED',
        'system',
        {
          ipAddress: ip,
          reason: 'Multiple failed login attempts',
          duration: '24 hours',
          action: 'auto-blocked',
          eventType: 'IP_BLOCKED'
        },
        ip,
        'Automated system'
      )
    }
  }

  /**
   * Generate comprehensive demo data
   */
  static async generateDemoData() {
    console.log('Generating security event demo data...')
    
    // Clear any existing events (optional)
    // You could add a method to clear the audit store here
    
    // Generate various types of events
    await this.generateFailedLogins(8)
    await this.generateSessionEvents()
    await this.generateIPBlockingEvents()
    await this.generateTestEvents()
    
    console.log('Demo data generated successfully!')
  }
}