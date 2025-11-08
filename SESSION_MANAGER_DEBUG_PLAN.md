# Session Manager Debugging Plan

## Issues Identified

### 1. Missing `createdAt` Property
**Problem**: Line 291 references `s.createdAt` but `SessionInfo` interface doesn't include this property
**Location**: `src/lib/security/sessionManager.ts:291`
**Fix**: Add `createdAt: Date` to `SessionInfo` interface

### 2. Import Path Verification
**Problem**: Import statement looks correct but may have build issues
**Location**: `src/lib/security/sessionManager.ts:3`
**Current**: `import { SimpleAuditLogger } from "./simpleAuditLogger"`
**Status**: ✅ Correct - file exists at this location

### 3. Method Implementation Gaps
**Problem**: Several methods return mock data instead of functional implementations
**Affected Methods**:
- `getUserSessions()` - returns empty array
- `cleanupExpiredSessions()` - returns mock count
- `getSessionStats()` - returns all zeros
- `validateSession()` - returns mock session data

### 4. Session Storage Missing
**Problem**: No actual session storage mechanism implemented
**Impact**: Sessions are created but not persisted or retrievable

## Detailed Fixes Required

### Fix 1: Update SessionInfo Interface
```typescript
export interface SessionInfo {
  id: string
  userId: string
  sessionToken: string
  refreshToken: string | undefined
  deviceInfo: string | undefined
  ipAddress: string | undefined
  userAgent: string | undefined
  createdAt: Date  // ← ADD THIS
  lastActivity: Date
  expiresAt: Date
  status: 'active' | 'expired' | 'revoked'
}
```

### Fix 2: Add Session Storage
```typescript
// Add at class level
private static sessions: Map<string, SessionInfo> = new Map()
```

### Fix 3: Implement Real Session Storage
- Store sessions in the Map when created
- Retrieve sessions from Map in `getUserSessions()`
- Update session data in `validateSession()`
- Remove sessions in `invalidateSession()`

### Fix 4: Fix Method Implementations

#### getUserSessions()
```typescript
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
```

#### validateSession()
```typescript
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
```

#### cleanupExpiredSessions()
```typescript
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
```

#### getSessionStats()
```typescript
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
```

### Fix 5: Update createSession() to Store Session
```typescript
// Add this after creating sessionInfo
this.sessions.set(sessionToken, sessionInfo)
```

### Fix 6: Update invalidateSession() to Remove from Storage
```typescript
// Add this after logging
this.sessions.delete(sessionToken)
```

### Fix 7: Update invalidateAllUserSessions()
```typescript
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
```

## Testing Plan

### 1. Unit Tests
- Test session creation and storage
- Test session validation
- Test session invalidation
- Test session cleanup
- Test concurrent session limits

### 2. Integration Tests
- Test with SimpleAuditLogger
- Test with authentication flow
- Test session statistics

### 3. Manual Testing
- Create sessions via login
- Validate active sessions
- Test session expiration
- Test session invalidation
- Verify audit logs are created

## Implementation Priority

1. **High Priority**: Fix `createdAt` property and basic session storage
2. **Medium Priority**: Implement real method bodies
3. **Low Priority**: Add advanced features like session fingerprinting

## Files to Modify

- `src/lib/security/sessionManager.ts` - Main fixes
- Consider adding `src/lib/security/__tests__/sessionManager.test.ts` - Tests

## Dependencies

- ✅ `SimpleAuditLogger` - Already available and working
- ✅ `prisma` - Already imported (though not used in current implementation)
- ✅ TypeScript interfaces - Already defined

## Security Considerations

- Session tokens should be properly secured
- Session data should be encrypted in production
- Consider adding session fingerprinting
- Implement proper session timeout handling
- Add rate limiting for session creation