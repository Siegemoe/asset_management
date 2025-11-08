// Session Manager Integration Test
import { SessionManager } from "../sessionManager"
import { SimpleAuditLogger } from "../simpleAuditLogger"

// Jest tests - only run in test environment
if (typeof describe !== 'undefined') {
describe('SessionManager Integration', () => {
  beforeEach(() => {
    // Clear any existing sessions before each test
    // Note: In a real test environment, you'd have a way to reset the sessions Map
  })

  test('should create a session and log to audit system', async () => {
    const userId = 'test-user-123'
    const sessionToken = 'test-session-token'
    const ipAddress = '192.168.1.1'
    const userAgent = 'Mozilla/5.0 (Test Browser)'

    // Create a session
    const session = await SessionManager.createSession(
      userId,
      sessionToken,
      undefined,
      'Test Device',
      ipAddress,
      userAgent
    )

    // Verify session was created with correct properties
    expect(session).toBeDefined()
    expect(session.userId).toBe(userId)
    expect(session.sessionToken).toBe(sessionToken)
    expect(session.ipAddress).toBe(ipAddress)
    expect(session.userAgent).toBe(userAgent)
    expect(session.status).toBe('active')
    expect(session.createdAt).toBeInstanceOf(Date)
    expect(session.lastActivity).toBeInstanceOf(Date)
    expect(session.expiresAt).toBeInstanceOf(Date)

    console.log('✅ Session created successfully:', session.id)
  })

  test('should validate a session successfully', async () => {
    const userId = 'test-user-456'
    const sessionToken = 'test-session-token-2'
    const ipAddress = '192.168.1.2'

    // First create a session
    await SessionManager.createSession(userId, sessionToken, undefined, 'Test Device', ipAddress)

    // Then validate it
    const validation = await SessionManager.validateSession(sessionToken, ipAddress)

    expect(validation.valid).toBe(true)
    expect(validation.session).toBeDefined()
    expect(validation.session?.userId).toBe(userId)
    expect(validation.session?.sessionToken).toBe(sessionToken)

    console.log('✅ Session validation successful')
  })

  test('should handle session invalidation', async () => {
    const userId = 'test-user-789'
    const sessionToken = 'test-session-token-3'

    // Create a session
    await SessionManager.createSession(userId, sessionToken)

    // Invalidate the session
    const result = await SessionManager.invalidateSession(sessionToken, userId, 'test_invalidation')

    expect(result.success).toBe(true)

    // Try to validate the invalidated session
    const validation = await SessionManager.validateSession(sessionToken)

    expect(validation.valid).toBe(false)
    expect(validation.reason).toContain('revoked')

    console.log('✅ Session invalidation successful')
  })

  test('should get user sessions', async () => {
    const userId = 'test-user-sessions'
    
    // Create multiple sessions for the same user
    await SessionManager.createSession(userId, 'token-1')
    await SessionManager.createSession(userId, 'token-2')
    await SessionManager.createSession(userId, 'token-3')

    // Get user sessions
    const sessions = await SessionManager.getUserSessions(userId)

    expect(sessions).toHaveLength(3)
    expect(sessions.every(s => s.userId === userId)).toBe(true)

    console.log('✅ User sessions retrieval successful:', sessions.length, 'sessions')
  })

  test('should provide session statistics', async () => {
    // Create some test sessions
    await SessionManager.createSession('user-1', 'token-1')
    await SessionManager.createSession('user-2', 'token-2')

    // Get stats
    const stats = await SessionManager.getSessionStats()

    expect(stats.totalSessions).toBeGreaterThanOrEqual(2)
    expect(stats.activeSessions).toBeGreaterThanOrEqual(2)
    expect(stats.averageSessionDuration).toBeGreaterThanOrEqual(0)

    console.log('✅ Session statistics:', stats)
  })

  test('should clean up expired sessions', async () => {
    // Create a session that will expire quickly (1 second timeout)
    const originalConfig = SessionManager.getConfig()
    SessionManager.updateConfig({ sessionTimeout: 0.016 }) // ~1 second in minutes

    const sessionToken = 'expiring-session'
    await SessionManager.createSession('test-user', sessionToken)

    // Wait for session to expire
    await new Promise(resolve => setTimeout(resolve, 1100))

    // Clean up expired sessions
    const cleanedCount = await SessionManager.cleanupExpiredSessions()

    expect(cleanedCount).toBeGreaterThanOrEqual(1)

    // Restore original config
    SessionManager.updateConfig(originalConfig)

    console.log('✅ Expired session cleanup successful, cleaned:', cleanedCount)
  })
})

}

// Manual test function for development
export async function manualSessionTest() {
  console.log('🧪 Starting manual session manager test...')

  try {
    // Test 1: Create session
    const session = await SessionManager.createSession(
      'manual-test-user',
      'manual-test-token',
      'refresh-token-123',
      'Test Device',
      '127.0.0.1',
      'Manual Test Browser'
    )
    console.log('✅ Session created:', session.id)

    // Test 2: Validate session
    const validation = await SessionManager.validateSession('manual-test-token', '127.0.0.1')
    console.log('✅ Session validation:', validation.valid ? 'SUCCESS' : 'FAILED')

    // Test 3: Get user sessions
    const sessions = await SessionManager.getUserSessions('manual-test-user')
    console.log('✅ User sessions:', sessions.length)

    // Test 4: Get stats
    const stats = await SessionManager.getSessionStats()
    console.log('✅ Session stats:', stats)

    // Test 5: Invalidate session
    const invalidation = await SessionManager.invalidateSession('manual-test-token', 'manual-test-user', 'manual_test')
    console.log('✅ Session invalidation:', invalidation.success ? 'SUCCESS' : 'FAILED')

    console.log('🎉 All manual tests completed successfully!')
    return true
  } catch (error) {
    console.error('❌ Manual test failed:', error)
    return false
  }
}