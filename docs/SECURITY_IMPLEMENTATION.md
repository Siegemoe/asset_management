# Security Implementation Documentation

This document provides a comprehensive overview of the security enhancements implemented in the Asset Management system.

## Overview

The security implementation includes four main components:
1. **Account Lockout System** - Prevents brute force attacks
2. **Password Policy System** - Enforces strong password requirements
3. **Role-Based Access Control (RBAC)** - Granular permission management
4. **Session Management** - Enhanced session handling and monitoring
5. **Security Middleware** - Rate limiting, CSRF protection, and input sanitization
6. **Audit Logging** - Comprehensive security event tracking

## Security Components

### 1. Account Lockout System (`src/lib/security/simpleAccountLockout.ts`)

**Purpose**: Prevents brute force attacks by locking accounts after multiple failed login attempts.

**Features**:
- Configurable maximum failed attempts (default: 5)
- Progressive lockout duration (15min, 30min, 1hr, 24hr)
- Account unlock capabilities for administrators
- IP-based tracking for additional security
- Cleanup of expired failed attempts

**Key Methods**:
- `recordLoginAttempt()` - Records and processes login attempts
- `isAccountLocked()` - Checks if account is currently locked
- `unlockAccount()` - Manually unlock an account
- `getLockoutStatus()` - Get account lockout status and statistics

**Configuration**:
```typescript
const config: LockoutConfig = {
  maxFailedAttempts: 5,
  lockoutDuration: 15, // minutes
  progressiveLockout: true,
  maxLockoutDuration: 1440, // 24 hours
}
```

### 2. Password Policy System (`src/lib/security/passwordPolicy.ts`)

**Purpose**: Enforces strong password requirements and prevents password reuse.

**Features**:
- Minimum 12 characters with complexity requirements
- Password history tracking (prevents reuse of last 5 passwords)
- Password expiration (90 days with reminders)
- Common password detection
- Password strength validation
- Secure password generation

**Key Methods**:
- `validatePassword()` - Validates password against policy
- `updatePassword()` - Updates password with all security checks
- `isPasswordInHistory()` - Checks if password was previously used
- `generateSecurePassword()` - Generates cryptographically secure passwords
- `getPasswordStrength()` - Provides password strength feedback

**Policy Configuration**:
```typescript
const policy: PasswordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxHistory: 5,
  maxAge: 90, // days
  preventCommonPasswords: true,
}
```

### 3. Role-Based Access Control (RBAC) (`src/lib/security/rbac.ts`)

**Purpose**: Provides granular permission management based on user roles and resource access.

**Features**:
- Resource-based permissions (asset, site, room, user)
- Action-based permissions (create, read, update, delete, list)
- Site-level access control for Site Managers
- Permission checking middleware
- Audit logging for permission checks

**Default Role Permissions**:

**SUPER_ADMIN**: Full access to all permissions
**ADMIN**: Site creation, management, user listing, security viewing
**SITE_MANAGER**: Limited to assigned sites, asset and room management

**Key Methods**:
- `hasPermission()` - Checks if user has specific permission
- `canAccessResource()` - Validates resource access
- `getUserAllowedSites()` - Gets sites user can access
- `createPermissionMiddleware()` - Creates authorization middleware

**Available Permissions**:
```
- asset:create, asset:read, asset:update, asset:delete, asset:list
- site:create, site:read, site:update, site:delete, site:list
- room:create, room:read, room:update, room:delete, room:list
- user:create, user:read, user:update, user:delete, user:list
- security:read, security:manage
- admin:full
```

### 4. Session Management (`src/lib/security/sessionManager.ts`)

**Purpose**: Enhanced session handling with monitoring and security features.

**Features**:
- Configurable session timeout (default: 30 minutes)
- Concurrent session limits (max 3 per user)
- Refresh token rotation
- Device fingerprinting
- Suspicious activity detection
- Session invalidation capabilities

**Key Methods**:
- `createSession()` - Creates new session with tracking
- `validateSession()` - Validates and refreshes session
- `refreshSession()` - Rotates refresh tokens
- `invalidateSession()` - Invalidates specific session
- `invalidateAllUserSessions()` - Invalidates all user sessions
- `checkSuspiciousActivity()` - Detects suspicious login patterns

**Configuration**:
```typescript
const config: SessionConfig = {
  sessionTimeout: 30, // minutes
  maxConcurrentSessions: 3,
  refreshTokenRotation: true,
  requireHTTPS: true,
  sessionFingerprinting: true,
}
```

### 5. Security Middleware (`src/lib/security/securityMiddleware.ts`)

**Purpose**: Provides security utilities and protection mechanisms.

**Features**:
- Rate limiting for API endpoints
- CSRF protection
- Input sanitization
- Security headers
- Suspicious pattern detection
- Secure random token generation
- Password strength validation

**Key Methods**:
- `rateLimit()` - Implements rate limiting
- `generateCSRFToken()` - CSRF token generation
- `verifyCSRFToken()` - CSRF token validation
- `validateOrigin()` - Request origin validation
- `getSecurityHeaders()` - Security headers configuration
- `sanitizeString()` - Input sanitization
- `detectSuspiciousPatterns()` - Pattern-based threat detection

**Security Headers**:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; ...
```

### 6. Audit Logging (`src/lib/security/simpleAuditLogger.ts`)

**Purpose**: Comprehensive logging of security events and user actions.

**Features**:
- Login attempt tracking
- Data access logging
- Data modification tracking
- Security event logging
- Audit trail maintenance

**Logged Events**:
- Login attempts (success/failure)
- Logout events
- Data access (read, list, search)
- Data modification (create, update, delete)
- Security events (account locked, password changes, unauthorized access)

## Authentication Flow Enhancements

The authentication flow (`src/auth.ts`) has been enhanced with:

1. **Account Lockout Integration**: Checks account lockout status before password verification
2. **Failed Attempt Tracking**: Records all failed login attempts with IP and user agent
3. **Session Creation**: Creates enhanced sessions with tracking
4. **Suspicious Activity Detection**: Monitors for unusual login patterns
5. **Audit Logging**: Logs all authentication events

## Integration Points

### API Endpoints
All API endpoints should integrate the security services:

```typescript
// Example integration in API routes
import { RBACService } from "@/lib/security/rbac"
import { SecurityMiddleware } from "@/lib/security/securityMiddleware"
import { SimpleAuditLogger } from "@/lib/security/simpleAuditLogger"

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimit = SecurityMiddleware.rateLimit(
    `assets:${request.headers.get('x-forwarded-for')}`,
    { windowMs: 60000, max: 100 }
  )
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: rateLimit.message }, { status: 429 })
  }

  // Authorization check
  const userId = await getUserIdFromRequest(request)
  const permission = await RBACService.canAccessResource(
    userId, 'asset', 'read', undefined, siteId
  )
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.reason }, { status: 403 })
  }

  // Audit logging
  await SimpleAuditLogger.logDataAccess(
    userId, 'asset', 'list', undefined, 
    request.headers.get('x-forwarded-for'),
    request.headers.get('user-agent')
  )
}
```

### Frontend Integration
Security services can be used in frontend components:

```typescript
// Client-side security checks
import { SecurityMiddleware } from "@/lib/security/securityMiddleware"

// Password strength validation
const { score, valid, feedback } = SecurityMiddleware.validatePasswordStrength(password)

// CSRF token for forms
const csrfToken = SecurityMiddleware.generateCSRFToken()
```

## Configuration Management

All security services support configuration updates:

```typescript
// Update password policy
PasswordPolicyService.updatePolicy({
  minLength: 16,
  maxHistory: 10,
  maxAge: 60
})

// Update session configuration
SessionManager.updateConfig({
  sessionTimeout: 60,
  maxConcurrentSessions: 5
})

// Update account lockout settings
SimpleAccountLockoutService.updateConfig({
  maxFailedAttempts: 3,
  lockoutDuration: 30
})
```

## Monitoring and Alerts

Security events are logged and can be monitored:

1. **Failed Login Attempts**: Tracked per user and IP
2. **Account Lockouts**: Logged with reason and duration
3. **Suspicious Activity**: Detected and logged
4. **Permission Denials**: Tracked for security analysis
5. **Session Anomalies**: Monitored for unusual patterns

## Security Best Practices Implemented

1. **Defense in Depth**: Multiple layers of security
2. **Principle of Least Privilege**: Users only have necessary permissions
3. **Input Validation**: All inputs are sanitized and validated
4. **Session Security**: Secure session management with timeouts
5. **Audit Trail**: Comprehensive logging of security events
6. **Rate Limiting**: Protection against brute force and DoS attacks
7. **Account Lockout**: Prevention of credential stuffing
8. **Password Security**: Strong password requirements and history
9. **Security Headers**: Protection against common web vulnerabilities
10. **Suspicious Activity Detection**: Automated threat detection

## Future Enhancements

Potential future security improvements:

1. **Multi-Factor Authentication (MFA)**: SMS, email, or app-based 2FA
2. **Advanced Threat Detection**: ML-based anomaly detection
3. **API Rate Limiting**: Per-user and per-endpoint limits
4. **Security Dashboard**: Real-time security monitoring interface
5. **Passwordless Authentication**: Biometric or hardware token authentication
6. **Advanced Session Management**: Device registration and trust levels
7. **Compliance Reporting**: GDPR, SOX, HIPAA compliance features
8. **Security Orchestration**: Automated incident response

## Maintenance

Regular maintenance tasks:

1. **Log Rotation**: Implement automated log archival
2. **Security Updates**: Keep all dependencies updated
3. **Configuration Review**: Periodically review security settings
4. **Audit Review**: Regular review of security logs
5. **Penetration Testing**: Regular security assessments
6. **Backup Verification**: Ensure security event backups

## Support

For questions or issues with the security implementation:

1. Review this documentation
2. Check the security service source code
3. Review the audit logs for security events
4. Contact the system administrator for configuration changes
5. Follow the incident response procedures for security breaches

---

*This documentation covers the security implementation as of the latest version. For the most current information, refer to the source code and security service documentation.*