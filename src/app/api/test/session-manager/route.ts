// Test endpoint for Session Manager integration
import { NextRequest, NextResponse } from "next/server"
import { SessionManager } from "@/lib/security/sessionManager"
import { manualSessionTest } from "@/lib/security/__tests__/sessionManager.test"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testType = searchParams.get('type') || 'basic'

    console.log('🧪 Testing Session Manager:', testType)

    let result

    switch (testType) {
      case 'basic':
        // Basic session creation and validation test
        const session = await SessionManager.createSession(
          'test-user-' + Date.now(),
          'test-token-' + Math.random().toString(36).substr(2, 9),
          'refresh-token-' + Math.random().toString(36).substr(2, 9),
          'Test Device',
          '127.0.0.1',
          'Test Browser'
        )

        const validation = await SessionManager.validateSession(session.sessionToken, '127.0.0.1')
        
        result = {
          success: true,
          test: 'basic',
          session: {
            id: session.id,
            userId: session.userId,
            status: session.status,
            createdAt: session.createdAt,
            expiresAt: session.expiresAt
          },
          validation: {
            valid: validation.valid,
            reason: validation.reason
          }
        }
        break

      case 'stats':
        // Test session statistics
        const stats = await SessionManager.getSessionStats()
        result = {
          success: true,
          test: 'stats',
          stats
        }
        break

      case 'cleanup':
        // Test session cleanup
        const cleanedCount = await SessionManager.cleanupExpiredSessions()
        result = {
          success: true,
          test: 'cleanup',
          cleanedCount
        }
        break

      case 'manual':
        // Run comprehensive manual test
        const manualResult = await manualSessionTest()
        result = {
          success: manualResult,
          test: 'manual',
          message: manualResult ? 'All manual tests passed' : 'Manual tests failed'
        }
        break

      default:
        result = {
          success: false,
          error: 'Unknown test type',
          availableTests: ['basic', 'stats', 'cleanup', 'manual']
        }
    }

    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('❌ Session Manager test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, sessionToken, ...options } = body

    console.log('🧪 Session Manager Action:', action, 'for user:', userId)

    let result

    switch (action) {
      case 'create':
        const newSession = await SessionManager.createSession(
          userId,
          sessionToken,
          options.refreshToken,
          options.deviceInfo,
          options.ipAddress,
          options.userAgent
        )
        result = { success: true, session: newSession }
        break

      case 'validate':
        const validation = await SessionManager.validateSession(
          sessionToken,
          options.ipAddress,
          options.userAgent
        )
        result = { success: true, validation }
        break

      case 'invalidate':
        const invalidation = await SessionManager.invalidateSession(
          sessionToken,
          userId,
          options.reason || 'test_invalidation',
          options.ipAddress,
          options.userAgent
        )
        result = { success: true, invalidation }
        break

      case 'getUserSessions':
        const sessions = await SessionManager.getUserSessions(userId)
        result = { success: true, sessions }
        break

      case 'invalidateAll':
        const allInvalidation = await SessionManager.invalidateAllUserSessions(
          userId,
          options.reason || 'test_invalidation_all',
          options.ipAddress,
          options.userAgent
        )
        result = { success: true, allInvalidation }
        break

      default:
        result = {
          success: false,
          error: 'Unknown action',
          availableActions: ['create', 'validate', 'invalidate', 'getUserSessions', 'invalidateAll']
        }
    }

    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('❌ Session Manager action failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}