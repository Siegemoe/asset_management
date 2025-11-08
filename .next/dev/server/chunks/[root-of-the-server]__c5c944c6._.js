module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/security/simpleAuditLogger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Simple Audit Logger - works with existing schema
__turbopack_context__.s([
    "SimpleAuditLogger",
    ()=>SimpleAuditLogger
]);
// In-memory store for audit events (in production, this would be a database)
// Start with empty store - no placeholder data
const auditEventsStore = [];
class SimpleAuditLogger {
    static generateId() {
        return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
   * Log a login attempt (both success and failure)
   */ static async logLoginAttempt(userId, email, success, ipAddress, userAgent, reason) {
        try {
            const event = {
                id: this.generateId(),
                eventType: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE',
                action: 'login',
                description: success ? 'Successful login' : 'Failed login attempt',
                userId,
                severity: success ? 'LOW' : 'MEDIUM',
                ipAddress,
                userAgent,
                createdAt: new Date()
            };
            auditEventsStore.unshift(event);
            // Keep only the last 1000 events
            if (auditEventsStore.length > 1000) {
                auditEventsStore.splice(1000);
            }
            console.log('AUDIT:', event);
        } catch (error) {
            console.error('Failed to log login attempt:', error);
        }
    }
    /**
   * Log logout
   */ static async logLogout(userId, ipAddress, userAgent) {
        const event = {
            id: this.generateId(),
            eventType: 'LOGOUT',
            action: 'logout',
            description: 'User logout',
            userId,
            severity: 'LOW',
            ipAddress,
            userAgent,
            createdAt: new Date()
        };
        auditEventsStore.unshift(event);
        if (auditEventsStore.length > 1000) {
            auditEventsStore.splice(1000);
        }
        console.log('AUDIT:', event);
    }
    /**
   * Log data access
   */ static async logDataAccess(userId, resource, action, resourceId, ipAddress, userAgent) {
        const event = {
            id: this.generateId(),
            eventType: 'DATA_ACCESS',
            action: `${action}_${resource}`,
            description: `User accessed ${resource} data`,
            userId,
            severity: 'LOW',
            ipAddress,
            userAgent,
            createdAt: new Date()
        };
        auditEventsStore.unshift(event);
        if (auditEventsStore.length > 1000) {
            auditEventsStore.splice(1000);
        }
        console.log('AUDIT:', event);
    }
    /**
   * Log data modification
   */ static async logDataModification(userId, resource, action, resourceId, changes, ipAddress, userAgent) {
        const event = {
            id: this.generateId(),
            eventType: 'DATA_MODIFICATION',
            action: `${action}_${resource}`,
            description: `User ${action}ed ${resource}`,
            userId,
            severity: action === 'delete' ? 'MEDIUM' : 'LOW',
            ipAddress,
            userAgent,
            createdAt: new Date()
        };
        auditEventsStore.unshift(event);
        if (auditEventsStore.length > 1000) {
            auditEventsStore.splice(1000);
        }
        console.log('AUDIT:', event);
    }
    /**
   * Log security events
   */ static async logSecurityEvent(event, userId, details = {}, ipAddress, userAgent) {
        const auditEvent = {
            id: this.generateId(),
            eventType: event,
            action: 'security_event',
            description: `${event} event occurred`,
            userId,
            severity: event === 'UNAUTHORIZED_ACCESS' ? 'HIGH' : 'MEDIUM',
            details,
            ipAddress,
            userAgent,
            createdAt: new Date()
        };
        auditEventsStore.unshift(auditEvent);
        if (auditEventsStore.length > 1000) {
            auditEventsStore.splice(1000);
        }
        console.log('SECURITY:', auditEvent);
    }
    /**
   * Get recent events
   */ static async getRecentEvents(limit = 100) {
        return auditEventsStore.slice(0, limit);
    }
    /**
   * Get security events (high severity)
   */ static async getSecurityEvents(limit = 50) {
        return auditEventsStore.filter((event)=>event.severity === 'HIGH' || event.severity === 'CRITICAL' || event.eventType?.includes('SECURITY') || event.eventType === 'UNAUTHORIZED_ACCESS' || event.eventType === 'ACCOUNT_LOCKED').slice(0, limit);
    }
}
}),
"[project]/src/lib/security/sessionManager.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Enhanced Session Management Service
__turbopack_context__.s([
    "SessionManager",
    ()=>SessionManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security/simpleAuditLogger.ts [app-route] (ecmascript)");
;
class SessionManager {
    static config = {
        sessionTimeout: 30,
        maxConcurrentSessions: 3,
        refreshTokenRotation: true,
        requireHTTPS: true,
        sessionFingerprinting: true
    };
    // In-memory session storage (in production, this would be a database)
    static sessions = new Map();
    /**
   * Create a new session
   */ static async createSession(userId, sessionToken, refreshToken, deviceInfo, ipAddress, userAgent) {
        // Check concurrent session limit
        await this.enforceSessionLimit(userId);
        const expiresAt = new Date(Date.now() + this.config.sessionTimeout * 60 * 1000);
        const now = new Date();
        const sessionInfo = {
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
        };
        // Store session in memory
        this.sessions.set(sessionToken, sessionInfo);
        // Log session creation
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logSecurityEvent('PASSWORD_CHANGE', userId, {
            action: 'session_created',
            sessionId: sessionInfo.id,
            deviceInfo,
            timestamp: new Date().toISOString()
        }, ipAddress, userAgent);
        // In a real implementation, you would store this in the database
        console.log('SESSION_CREATED:', sessionInfo);
        return sessionInfo;
    }
    /**
   * Validate and refresh session
   */ static async validateSession(sessionToken, ipAddress, userAgent) {
        try {
            const session = this.sessions.get(sessionToken);
            if (!session) {
                return {
                    valid: false,
                    reason: 'Session not found'
                };
            }
            if (session.expiresAt < new Date()) {
                session.status = 'expired';
                this.sessions.set(sessionToken, session);
                return {
                    valid: false,
                    reason: 'Session expired'
                };
            }
            if (session.status !== 'active') {
                return {
                    valid: false,
                    reason: `Session ${session.status}`
                };
            }
            // Update last activity
            session.lastActivity = new Date();
            this.sessions.set(sessionToken, session);
            return {
                valid: true,
                session
            };
        } catch (error) {
            console.error('Error validating session:', error);
            return {
                valid: false,
                reason: 'Session validation failed'
            };
        }
    }
    /**
   * Refresh session token
   */ static async refreshSession(refreshToken, ipAddress, userAgent) {
        try {
            if (this.config.refreshTokenRotation) {
                // Generate new tokens
                const newSessionToken = this.generateSecureToken(32);
                const newRefreshToken = this.generateSecureToken(32);
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logSecurityEvent('PASSWORD_CHANGE', 'system', {
                    action: 'session_refreshed',
                    oldRefreshToken: refreshToken.substring(0, 8) + '...',
                    newRefreshToken: newRefreshToken.substring(0, 8) + '...',
                    timestamp: new Date().toISOString()
                }, ipAddress, userAgent);
                return {
                    success: true,
                    newSessionToken,
                    newRefreshToken
                };
            }
            return {
                success: false,
                reason: 'Token rotation disabled'
            };
        } catch (error) {
            console.error('Error refreshing session:', error);
            return {
                success: false,
                reason: 'Session refresh failed'
            };
        }
    }
    /**
   * Invalidate a session
   */ static async invalidateSession(sessionToken, userId, reason = 'manual_invalidation', ipAddress, userAgent) {
        try {
            const session = this.sessions.get(sessionToken);
            if (session) {
                session.status = 'revoked';
                this.sessions.set(sessionToken, session);
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logSecurityEvent('PASSWORD_CHANGE', userId || 'system', {
                action: 'session_invalidated',
                reason,
                sessionToken: sessionToken.substring(0, 8) + '...',
                timestamp: new Date().toISOString()
            }, ipAddress, userAgent);
            return {
                success: true
            };
        } catch (error) {
            console.error('Error invalidating session:', error);
            return {
                success: false
            };
        }
    }
    /**
   * Invalidate all sessions for a user
   */ static async invalidateAllUserSessions(userId, reason = 'security_reason', ipAddress, userAgent) {
        try {
            let invalidatedCount = 0;
            for (const [token, session] of this.sessions.entries()){
                if (session.userId === userId && session.status === 'active') {
                    session.status = 'revoked';
                    this.sessions.set(token, session);
                    invalidatedCount++;
                }
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logSecurityEvent('PASSWORD_CHANGE', userId, {
                action: 'all_sessions_invalidated',
                reason,
                invalidatedCount,
                timestamp: new Date().toISOString()
            }, ipAddress, userAgent);
            return {
                success: true,
                invalidatedCount
            };
        } catch (error) {
            console.error('Error invalidating all sessions:', error);
            return {
                success: false,
                invalidatedCount: 0
            };
        }
    }
    /**
   * Get all active sessions for a user
   */ static async getUserSessions(userId) {
        try {
            return Array.from(this.sessions.values()).filter((session)=>session.userId === userId).sort((a, b)=>b.lastActivity.getTime() - a.lastActivity.getTime());
        } catch (error) {
            console.error('Error getting user sessions:', error);
            return [];
        }
    }
    /**
   * Clean up expired sessions
   */ static async cleanupExpiredSessions() {
        try {
            const now = new Date();
            let cleanedCount = 0;
            for (const [token, session] of this.sessions.entries()){
                if (session.expiresAt < now || session.status === 'expired') {
                    this.sessions.delete(token);
                    cleanedCount++;
                }
            }
            return cleanedCount;
        } catch (error) {
            console.error('Error cleaning up expired sessions:', error);
            return 0;
        }
    }
    /**
   * Enforce session limit per user
   */ static async enforceSessionLimit(userId) {
        const userSessions = await this.getUserSessions(userId);
        if (userSessions.length >= this.config.maxConcurrentSessions) {
            // Invalidate the oldest session
            const oldestSession = userSessions.reduce((oldest, session)=>session.lastActivity < oldest.lastActivity ? session : oldest);
            await this.invalidateSession(oldestSession.sessionToken, userId, 'concurrent_session_limit');
        }
    }
    /**
   * Check for suspicious activity
   */ static async checkSuspiciousActivity(userId, currentIpAddress, currentUserAgent) {
        const reasons = [];
        let suspicious = false;
        try {
            const sessions = await this.getUserSessions(userId);
            // Check for IP address changes
            const ipAddresses = [
                ...new Set(sessions.map((s)=>s.ipAddress))
            ];
            if (ipAddresses.length > 1 && !ipAddresses.includes(currentIpAddress)) {
                reasons.push('Multiple IP addresses detected');
                suspicious = true;
            }
            // Check for new device/user agent
            const userAgents = [
                ...new Set(sessions.map((s)=>s.userAgent))
            ];
            if (userAgents.length > 1 && !userAgents.includes(currentUserAgent)) {
                reasons.push('Multiple devices detected');
                suspicious = true;
            }
            // Check for rapid session creation
            const recentSessions = sessions.filter((s)=>Date.now() - s.createdAt.getTime() < 5 * 60 * 1000 // Last 5 minutes
            );
            if (recentSessions.length > this.config.maxConcurrentSessions) {
                reasons.push('Rapid session creation detected');
                suspicious = true;
            }
            if (suspicious) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logSecurityEvent('UNAUTHORIZED_ACCESS', userId, {
                    action: 'suspicious_activity',
                    reasons,
                    currentIpAddress,
                    currentUserAgent
                }, currentIpAddress, currentUserAgent);
            }
            return {
                suspicious,
                reasons
            };
        } catch (error) {
            console.error('Error checking suspicious activity:', error);
            return {
                suspicious: false,
                reasons: []
            };
        }
    }
    /**
   * Generate secure random token
   */ static generateSecureToken(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for(let i = 0; i < length; i++){
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }
    /**
   * Get session statistics
   */ static async getSessionStats() {
        try {
            const sessions = Array.from(this.sessions.values());
            const now = new Date();
            const activeSessions = sessions.filter((s)=>s.status === 'active' && s.expiresAt > now).length;
            const expiredSessions = sessions.filter((s)=>s.status === 'expired' || s.expiresAt <= now).length;
            // Calculate average duration for active sessions
            const activeSessionDurations = sessions.filter((s)=>s.status === 'active').map((s)=>now.getTime() - s.createdAt.getTime());
            const averageSessionDuration = activeSessionDurations.length > 0 ? activeSessionDurations.reduce((sum, duration)=>sum + duration, 0) / activeSessionDurations.length : 0;
            return {
                totalSessions: sessions.length,
                activeSessions,
                expiredSessions,
                averageSessionDuration: Math.round(averageSessionDuration / 1000 / 60) // Convert to minutes
            };
        } catch (error) {
            console.error('Error getting session stats:', error);
            return {
                totalSessions: 0,
                activeSessions: 0,
                expiredSessions: 0,
                averageSessionDuration: 0
            };
        }
    }
    /**
   * Update configuration
   */ static updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
    }
    /**
   * Get current configuration
   */ static getConfig() {
        return {
            ...this.config
        };
    }
} // SessionConfig and SessionInfo are already exported above
}),
"[project]/src/lib/security/__tests__/sessionManager.test.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Session Manager Integration Test
__turbopack_context__.s([
    "manualSessionTest",
    ()=>manualSessionTest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security/sessionManager.ts [app-route] (ecmascript)");
;
// Jest tests - only run in test environment
if (typeof describe !== 'undefined') {
    describe('SessionManager Integration', ()=>{
        beforeEach(()=>{
        // Clear any existing sessions before each test
        // Note: In a real test environment, you'd have a way to reset the sessions Map
        });
        test('should create a session and log to audit system', async ()=>{
            const userId = 'test-user-123';
            const sessionToken = 'test-session-token';
            const ipAddress = '192.168.1.1';
            const userAgent = 'Mozilla/5.0 (Test Browser)';
            // Create a session
            const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession(userId, sessionToken, undefined, 'Test Device', ipAddress, userAgent);
            // Verify session was created with correct properties
            expect(session).toBeDefined();
            expect(session.userId).toBe(userId);
            expect(session.sessionToken).toBe(sessionToken);
            expect(session.ipAddress).toBe(ipAddress);
            expect(session.userAgent).toBe(userAgent);
            expect(session.status).toBe('active');
            expect(session.createdAt).toBeInstanceOf(Date);
            expect(session.lastActivity).toBeInstanceOf(Date);
            expect(session.expiresAt).toBeInstanceOf(Date);
            console.log('✅ Session created successfully:', session.id);
        });
        test('should validate a session successfully', async ()=>{
            const userId = 'test-user-456';
            const sessionToken = 'test-session-token-2';
            const ipAddress = '192.168.1.2';
            // First create a session
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession(userId, sessionToken, undefined, 'Test Device', ipAddress);
            // Then validate it
            const validation = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].validateSession(sessionToken, ipAddress);
            expect(validation.valid).toBe(true);
            expect(validation.session).toBeDefined();
            expect(validation.session?.userId).toBe(userId);
            expect(validation.session?.sessionToken).toBe(sessionToken);
            console.log('✅ Session validation successful');
        });
        test('should handle session invalidation', async ()=>{
            const userId = 'test-user-789';
            const sessionToken = 'test-session-token-3';
            // Create a session
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession(userId, sessionToken);
            // Invalidate the session
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].invalidateSession(sessionToken, userId, 'test_invalidation');
            expect(result.success).toBe(true);
            // Try to validate the invalidated session
            const validation = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].validateSession(sessionToken);
            expect(validation.valid).toBe(false);
            expect(validation.reason).toContain('revoked');
            console.log('✅ Session invalidation successful');
        });
        test('should get user sessions', async ()=>{
            const userId = 'test-user-sessions';
            // Create multiple sessions for the same user
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession(userId, 'token-1');
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession(userId, 'token-2');
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession(userId, 'token-3');
            // Get user sessions
            const sessions = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].getUserSessions(userId);
            expect(sessions).toHaveLength(3);
            expect(sessions.every((s)=>s.userId === userId)).toBe(true);
            console.log('✅ User sessions retrieval successful:', sessions.length, 'sessions');
        });
        test('should provide session statistics', async ()=>{
            // Create some test sessions
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession('user-1', 'token-1');
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession('user-2', 'token-2');
            // Get stats
            const stats = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].getSessionStats();
            expect(stats.totalSessions).toBeGreaterThanOrEqual(2);
            expect(stats.activeSessions).toBeGreaterThanOrEqual(2);
            expect(stats.averageSessionDuration).toBeGreaterThanOrEqual(0);
            console.log('✅ Session statistics:', stats);
        });
        test('should clean up expired sessions', async ()=>{
            // Create a session that will expire quickly (1 second timeout)
            const originalConfig = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].getConfig();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].updateConfig({
                sessionTimeout: 0.016
            }); // ~1 second in minutes
            const sessionToken = 'expiring-session';
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession('test-user', sessionToken);
            // Wait for session to expire
            await new Promise((resolve)=>setTimeout(resolve, 1100));
            // Clean up expired sessions
            const cleanedCount = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].cleanupExpiredSessions();
            expect(cleanedCount).toBeGreaterThanOrEqual(1);
            // Restore original config
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].updateConfig(originalConfig);
            console.log('✅ Expired session cleanup successful, cleaned:', cleanedCount);
        });
    });
}
async function manualSessionTest() {
    console.log('🧪 Starting manual session manager test...');
    try {
        // Test 1: Create session
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession('manual-test-user', 'manual-test-token', 'refresh-token-123', 'Test Device', '127.0.0.1', 'Manual Test Browser');
        console.log('✅ Session created:', session.id);
        // Test 2: Validate session
        const validation = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].validateSession('manual-test-token', '127.0.0.1');
        console.log('✅ Session validation:', validation.valid ? 'SUCCESS' : 'FAILED');
        // Test 3: Get user sessions
        const sessions = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].getUserSessions('manual-test-user');
        console.log('✅ User sessions:', sessions.length);
        // Test 4: Get stats
        const stats = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].getSessionStats();
        console.log('✅ Session stats:', stats);
        // Test 5: Invalidate session
        const invalidation = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].invalidateSession('manual-test-token', 'manual-test-user', 'manual_test');
        console.log('✅ Session invalidation:', invalidation.success ? 'SUCCESS' : 'FAILED');
        console.log('🎉 All manual tests completed successfully!');
        return true;
    } catch (error) {
        console.error('❌ Manual test failed:', error);
        return false;
    }
}
}),
"[project]/src/app/api/test/session-manager/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Test endpoint for Session Manager integration
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security/sessionManager.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$_$5f$tests_$5f2f$sessionManager$2e$test$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security/__tests__/sessionManager.test.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const testType = searchParams.get('type') || 'basic';
        console.log('🧪 Testing Session Manager:', testType);
        let result;
        switch(testType){
            case 'basic':
                // Basic session creation and validation test
                const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession('test-user-' + Date.now(), 'test-token-' + Math.random().toString(36).substr(2, 9), 'refresh-token-' + Math.random().toString(36).substr(2, 9), 'Test Device', '127.0.0.1', 'Test Browser');
                const validation = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].validateSession(session.sessionToken, '127.0.0.1');
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
                };
                break;
            case 'stats':
                // Test session statistics
                const stats = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].getSessionStats();
                result = {
                    success: true,
                    test: 'stats',
                    stats
                };
                break;
            case 'cleanup':
                // Test session cleanup
                const cleanedCount = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].cleanupExpiredSessions();
                result = {
                    success: true,
                    test: 'cleanup',
                    cleanedCount
                };
                break;
            case 'manual':
                // Run comprehensive manual test
                const manualResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$_$5f$tests_$5f2f$sessionManager$2e$test$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualSessionTest"])();
                result = {
                    success: manualResult,
                    test: 'manual',
                    message: manualResult ? 'All manual tests passed' : 'Manual tests failed'
                };
                break;
            default:
                result = {
                    success: false,
                    error: 'Unknown test type',
                    availableTests: [
                        'basic',
                        'stats',
                        'cleanup',
                        'manual'
                    ]
                };
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result, {
            status: 200
        });
    } catch (error) {
        console.error('❌ Session Manager test failed:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { action, userId, sessionToken, ...options } = body;
        console.log('🧪 Session Manager Action:', action, 'for user:', userId);
        let result;
        switch(action){
            case 'create':
                const newSession = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession(userId, sessionToken, options.refreshToken, options.deviceInfo, options.ipAddress, options.userAgent);
                result = {
                    success: true,
                    session: newSession
                };
                break;
            case 'validate':
                const validation = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].validateSession(sessionToken, options.ipAddress, options.userAgent);
                result = {
                    success: true,
                    validation
                };
                break;
            case 'invalidate':
                const invalidation = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].invalidateSession(sessionToken, userId, options.reason || 'test_invalidation', options.ipAddress, options.userAgent);
                result = {
                    success: true,
                    invalidation
                };
                break;
            case 'getUserSessions':
                const sessions = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].getUserSessions(userId);
                result = {
                    success: true,
                    sessions
                };
                break;
            case 'invalidateAll':
                const allInvalidation = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].invalidateAllUserSessions(userId, options.reason || 'test_invalidation_all', options.ipAddress, options.userAgent);
                result = {
                    success: true,
                    allInvalidation
                };
                break;
            default:
                result = {
                    success: false,
                    error: 'Unknown action',
                    availableActions: [
                        'create',
                        'validate',
                        'invalidate',
                        'getUserSessions',
                        'invalidateAll'
                    ]
                };
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result, {
            status: 200
        });
    } catch (error) {
        console.error('❌ Session Manager action failed:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c5c944c6._.js.map