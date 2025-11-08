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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs) <export randomFillSync as default>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomFillSync"]
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/src/lib/security/simpleAuditLogger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Simple Audit Logger - works with existing schema
// import { prisma } from "@/lib/prisma" // Not used in current implementation
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
"[project]/src/lib/security/simpleAccountLockout.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Simplified Account Lockout Service - works with current schema
__turbopack_context__.s([
    "SimpleAccountLockoutService",
    ()=>SimpleAccountLockoutService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security/simpleAuditLogger.ts [app-route] (ecmascript)");
;
class SimpleAccountLockoutService {
    static config = {
        maxFailedAttempts: 5,
        lockoutDuration: 15,
        progressiveLockout: true,
        maxLockoutDuration: 1440
    };
    /**
   * For now, we'll store lockout data in a separate table
   * This approach works with the current schema
   */ static async recordFailedAttempt(userId, email, ipAddress, userAgent) {
        // For now, we'll use a simple approach with a file-based storage or memory
        // In production, you might want to add a simple table to the existing schema
        console.log('FAILED_LOGIN_ATTEMPT:', {
            userId,
            email,
            timestamp: new Date().toISOString(),
            ipAddress,
            userAgent
        });
    }
    /**
   * Record a login attempt and determine if account should be locked
   */ static async recordLoginAttempt(userId, email, success, ipAddress, userAgent, reason) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logLoginAttempt(userId, email, success, ipAddress, userAgent, reason);
        if (success) {
            return {
                success: true,
                shouldLock: false
            };
        }
        if (!userId) {
            return {
                success: false,
                shouldLock: false,
                reason: "User not found"
            };
        }
        // Record the failed attempt
        await this.recordFailedAttempt(userId, email, ipAddress, userAgent);
        // For now, we'll implement a simple lockout check
        // This would be enhanced once we have the proper Prisma client
        const recentFailures = await this.getRecentFailedAttempts(userId, 15) // Last 15 minutes
        ;
        if (recentFailures >= this.config.maxFailedAttempts) {
            return {
                success: false,
                shouldLock: true,
                lockoutUntil: new Date(Date.now() + this.config.lockoutDuration * 60 * 1000),
                reason: `Account locked for ${this.config.lockoutDuration} minutes due to multiple failed attempts`
            };
        }
        return {
            success: false,
            shouldLock: false,
            reason: `Invalid credentials (${recentFailures + 1}/${this.config.maxFailedAttempts} recent attempts)`
        };
    }
    /**
   * Get number of recent failed attempts for a user
   */ static async getRecentFailedAttempts(userId, minutes) {
        // This is a simplified implementation
        // In the full implementation, this would query the UserLoginAttempt table
        const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
        // For now, return a mock value
        // In production, this would query the database
        return 0;
    }
    /**
   * Check if a user account is currently locked
   * For now, we'll implement a simple check
   */ static async isAccountLocked(userId) {
        // This would be enhanced once we have the proper Prisma client
        // For now, return false (no lockout)
        return {
            locked: false
        };
    }
    /**
   * Unlock an account manually
   */ static async unlockAccount(userId, unlockedBy, ipAddress, userAgent) {
        try {
            // This would clear the lockout data
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logSecurityEvent('PASSWORD_CHANGE', userId, {
                action: 'unlock_account',
                unlockedBy
            }, ipAddress, userAgent);
            return {
                success: true,
                message: "Account unlocked successfully"
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to unlock account"
            };
        }
    }
    /**
   * Get account lockout status and statistics
   */ static async getLockoutStatus(userId) {
        return {
            isLocked: false,
            recentFailedAttempts: 0,
            maxAttempts: this.config.maxFailedAttempts,
            config: this.config
        };
    }
    /**
   * Update lockout configuration
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
"[project]/src/lib/security/securityMiddleware.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Security Middleware and Utilities
__turbopack_context__.s([
    "SecurityMiddleware",
    ()=>SecurityMiddleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
class SecurityMiddleware {
    static rateLimitStore = new Map();
    /**
   * Rate limiting middleware
   */ static rateLimit(identifier, config) {
        const key = `rate_limit:${identifier}`;
        const now = Date.now();
        const current = this.rateLimitStore.get(key);
        if (!current || now > current.resetTime) {
            // Reset or initialize
            this.rateLimitStore.set(key, {
                count: 1,
                resetTime: now + config.windowMs
            });
            return {
                allowed: true,
                remaining: config.max - 1,
                resetTime: now + config.windowMs
            };
        }
        if (current.count >= config.max) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: current.resetTime,
                message: config.message || `Rate limit exceeded. Try again in ${Math.ceil((current.resetTime - now) / 1000)} seconds.`
            };
        }
        // Increment counter
        current.count++;
        this.rateLimitStore.set(key, current);
        return {
            allowed: true,
            remaining: config.max - current.count,
            resetTime: current.resetTime
        };
    }
    /**
   * CSRF Protection
   */ static generateCSRFToken() {
        // Use Web Crypto API for Edge Runtime compatibility
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, (byte)=>byte.toString(16).padStart(2, '0')).join('');
    }
    static verifyCSRFToken(request) {
        try {
            const csrfToken = request.headers.get('x-csrf-token');
            const origin = request.headers.get('origin');
            const referer = request.headers.get('referer');
            if (!csrfToken) {
                return {
                    valid: false,
                    reason: 'CSRF token missing'
                };
            }
            // Check if token format is valid
            if (!/^[a-f0-9]{64}$/.test(csrfToken)) {
                return {
                    valid: false,
                    reason: 'Invalid CSRF token format'
                };
            }
            // In production, you would also verify against stored tokens
            // For now, we'll use a simple validation approach
            return {
                valid: true
            };
        } catch (error) {
            return {
                valid: false,
                reason: 'CSRF validation error'
            };
        }
    }
    /**
   * Validate request origin
   */ static validateOrigin(request, allowedOrigins) {
        const origin = request.headers.get('origin');
        const referer = request.headers.get('referer');
        if (!origin && !referer) {
            // Allow requests without origin (e.g., mobile apps, API clients)
            return {
                valid: true
            };
        }
        const requestOrigin = origin || referer;
        if (!requestOrigin) {
            return {
                valid: false,
                reason: 'No origin or referer header'
            };
        }
        const hostname = new URL(requestOrigin).hostname;
        const isAllowed = allowedOrigins.some((allowed)=>{
            if (allowed === hostname) return true;
            if (allowed.startsWith('*.')) {
                return hostname.endsWith(allowed.substring(2));
            }
            return false;
        });
        return {
            valid: isAllowed,
            reason: isAllowed ? undefined : `Origin ${hostname} not allowed`
        };
    }
    /**
   * Security headers middleware
   */ static getSecurityHeaders() {
        return {
            // Prevent clickjacking
            'X-Frame-Options': 'DENY',
            // Prevent MIME type sniffing
            'X-Content-Type-Options': 'nosniff',
            // Enable XSS protection
            'X-XSS-Protection': '1; mode=block',
            // Force HTTPS
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            // Referrer policy
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            // Content Security Policy (basic)
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self';",
            // Permissions Policy
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        };
    }
    /**
   * Input sanitization utilities
   */ static sanitizeString(input, maxLength) {
        if (typeof input !== 'string') {
            return '';
        }
        let sanitized = input.trim().replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/data:/gi, '') // Remove data: protocol
        .replace(/vbscript:/gi, '') // Remove vbscript: protocol
        ;
        if (maxLength && sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }
        return sanitized;
    }
    static sanitizeEmail(email) {
        const sanitized = this.sanitizeString(email, 254);
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(sanitized) ? sanitized.toLowerCase() : '';
    }
    static sanitizeUrl(url) {
        const sanitized = this.sanitizeString(url, 2048);
        try {
            const parsed = new URL(sanitized);
            // Only allow http and https protocols
            if (![
                'http:',
                'https:'
            ].includes(parsed.protocol)) {
                return '';
            }
            return parsed.toString();
        } catch  {
            return '';
        }
    }
    /**
   * Password strength validation
   */ static validatePasswordStrength(password) {
        const feedback = [];
        let score = 0;
        // Length
        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 20;
        if (password.length >= 16) score += 10;
        // Character types
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/\d/.test(password)) score += 10;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;
        // Patterns
        if (/(.)\1{2,}/.test(password)) score -= 10; // Penalize repeated characters
        if (/123|abc|qwe|asd/i.test(password)) score -= 15; // Penalize common patterns
        // Feedback
        if (password.length < 8) feedback.push('Password must be at least 8 characters long');
        if (!/[a-z]/.test(password)) feedback.push('Include lowercase letters');
        if (!/[A-Z]/.test(password)) feedback.push('Include uppercase letters');
        if (!/\d/.test(password)) feedback.push('Include numbers');
        if (!/[!@#$%^&*]/.test(password)) feedback.push('Include special characters');
        if (/(.)\1{2,}/.test(password)) feedback.push('Avoid repeated characters');
        if (/123|abc|qwe|asd/i.test(password)) feedback.push('Avoid common patterns');
        const valid = score >= 40 && feedback.length === 0;
        return {
            score: Math.max(0, Math.min(100, score)),
            feedback,
            valid
        };
    }
    /**
   * Generate secure random string
   */ static generateSecureRandomString(length, charset) {
        const defaultCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const chars = charset || defaultCharset;
        let result = '';
        // Use Web Crypto API for Edge Runtime compatibility
        const randomValues = new Uint8Array(length);
        crypto.getRandomValues(randomValues);
        for(let i = 0; i < length; i++){
            result += chars.charAt((randomValues[i] || 0) % chars.length);
        }
        return result;
    }
    /**
   * Hash data with salt
   */ static async hashWithSalt(data, salt) {
        // Use bcryptjs for password hashing (Edge Runtime compatible)
        const saltRounds = 12;
        const actualSalt = salt || await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].genSalt(saltRounds);
        const hash = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(data, actualSalt);
        return {
            hash,
            salt: actualSalt
        };
    }
    /**
   * Verify hash
   */ static async verifyHash(data, hash, salt) {
        // Use bcryptjs for password verification (Edge Runtime compatible)
        return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(data, hash);
    }
    /**
   * Detect suspicious patterns
   */ static detectSuspiciousPatterns(input) {
        const patterns = [];
        // SQL injection patterns
        const sqlPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
            /('|(\\)|(--|#|\/\*))/gi,
            /((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi
        ];
        // XSS patterns
        const xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi
        ];
        // Path traversal patterns
        const pathPatterns = [
            /\.\./g,
            /[\\/]/g
        ];
        // Command injection patterns
        const commandPatterns = [
            /;|\||&&|\|\|/g,
            /[`$]/g
        ];
        // Check patterns
        const allPatterns = [
            ...sqlPatterns,
            ...xssPatterns,
            ...pathPatterns,
            ...commandPatterns
        ];
        allPatterns.forEach((pattern, index)=>{
            if (pattern.test(input)) {
                const patternType = index < sqlPatterns.length ? 'SQL injection' : index < sqlPatterns.length + xssPatterns.length ? 'XSS' : index < sqlPatterns.length + xssPatterns.length + pathPatterns.length ? 'Path traversal' : 'Command injection';
                patterns.push(patternType);
            }
        });
        return {
            suspicious: patterns.length > 0,
            patterns
        };
    }
    /**
   * Log security events
   */ static logSecurityEvent(event, details = {}, severity = 'MEDIUM') {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event,
            severity,
            details
        };
        console.log('SECURITY:', logEntry);
    // In production, you would send this to a logging service
    // or store it in a security events table
    }
    /**
   * Clean up expired rate limit entries
   */ static cleanupRateLimitStore() {
        const now = Date.now();
        for (const [key, value] of this.rateLimitStore.entries()){
            if (now > value.resetTime) {
                this.rateLimitStore.delete(key);
            }
        }
    }
} // RateLimitConfig is already exported above
}),
"[project]/src/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "customSignOut",
    ()=>customSignOut,
    "handlers",
    ()=>handlers,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/google.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/node_modules/@auth/core/providers/google.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/node_modules/@auth/core/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAccountLockout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security/simpleAccountLockout.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security/simpleAuditLogger.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security/sessionManager.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$securityMiddleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security/securityMiddleware.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
const { handlers, auth, signIn, signOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize (credentials, req) {
                const ipAddress = req?.headers?.get('x-forwarded-for') || req?.headers?.get('x-real-ip') || 'unknown';
                const userAgent = req?.headers?.get('user-agent') || 'unknown';
                console.log('🔍 Enhanced authentication attempt:', {
                    hasEmail: !!credentials?.email,
                    hasPassword: !!credentials?.password,
                    email: credentials?.email,
                    ipAddress,
                    userAgent
                });
                if (!credentials || typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
                    console.log('❌ Invalid credentials format');
                    return null;
                }
                // Find user by email (case insensitive)
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                    where: {
                        email: credentials.email.toLowerCase()
                    }
                });
                if (!user) {
                    console.log('❌ User not found');
                    // Log failed login attempt for non-existent user
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logLoginAttempt(undefined, credentials.email.toLowerCase(), false, ipAddress, userAgent, 'User not found');
                    return null;
                }
                if (!user.password) {
                    console.log('❌ User has no password set');
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logLoginAttempt(user.id, user.email, false, ipAddress, userAgent, 'No password set');
                    return null;
                }
                // Check account lockout status
                const lockoutStatus = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAccountLockout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAccountLockoutService"].isAccountLocked(user.id);
                if (lockoutStatus.locked) {
                    console.log('❌ Account is locked');
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logLoginAttempt(user.id, user.email, false, ipAddress, userAgent, 'Account locked');
                    return null;
                }
                // Verify password
                const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(credentials.password, user.password);
                console.log('🔐 Password validation:', {
                    valid: isPasswordValid
                });
                if (!isPasswordValid) {
                    console.log('❌ Invalid password');
                    // Record failed login attempt
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAccountLockout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAccountLockoutService"].recordLoginAttempt(user.id, user.email, false, ipAddress, userAgent, 'Invalid password');
                    return null;
                }
                // Check for suspicious activity
                const suspiciousActivity = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].checkSuspiciousActivity(user.id, ipAddress, userAgent);
                if (suspiciousActivity.suspicious) {
                    console.log('⚠️ Suspicious activity detected:', suspiciousActivity.reasons);
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logSecurityEvent('UNAUTHORIZED_ACCESS', user.id, {
                        reasons: suspiciousActivity.reasons,
                        ipAddress,
                        userAgent,
                        eventType: 'SUSPICIOUS_LOGIN'
                    }, ipAddress, userAgent);
                }
                // Create enhanced session
                const sessionToken = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$securityMiddleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SecurityMiddleware"].generateSecureRandomString(32);
                const refreshToken = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$securityMiddleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SecurityMiddleware"].generateSecureRandomString(32);
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$sessionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SessionManager"].createSession(user.id, sessionToken, refreshToken, `Browser: ${userAgent.substring(0, 50)}`, ipAddress, userAgent);
                // Log successful login attempt - THIS WAS MISSING!
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logLoginAttempt(user.id, user.email, true, ipAddress, userAgent, 'Successful login');
                const userData = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    siteIds: user.siteIds,
                    sessionToken,
                    refreshToken
                };
                console.log('✅ Enhanced authentication successful for user:', user.email);
                return userData;
            }
        })
    ],
    callbacks: {
        async session ({ session, token }) {
            if (session.user && token) {
                session.user.id = token.sub;
                session.user.role = token.role || "SITE_MANAGER";
                session.user.siteIds = token.siteIds ? JSON.parse(token.siteIds) : [];
            }
            return session;
        },
        async jwt ({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.siteIds = user.siteIds;
            }
            return token;
        }
    },
    pages: {
        signIn: '/login'
    },
    session: {
        strategy: "jwt"
    }
});
async function customSignOut(options = {}) {
    try {
        // Get current session for logging
        const session = await auth();
        if (session?.user?.id) {
            const ipAddress = 'unknown' // Would need to get from request context
            ;
            const userAgent = 'unknown';
            // Log logout event
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2f$simpleAuditLogger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleAuditLogger"].logLogout(session.user.id, ipAddress, userAgent);
        // Session cleanup would happen here when the method is implemented
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
    // Call original signOut
    return signOut(options);
}
}),
"[project]/src/app/api/users/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
;
async function GET() {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        // Check if user has admin privileges
        if (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Insufficient permissions"
            }, {
                status: 403
            });
        }
        const users = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                siteIds: true,
                image: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        // Check if user has admin privileges
        if (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Insufficient permissions"
            }, {
                status: 403
            });
        }
        const data = await request.json();
        const { name, email, password, role } = data;
        // Validate required fields
        if (!name || !email || !password || !role) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required fields",
                message: "Name, email, password, and role are required"
            }, {
                status: 400
            });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid email",
                message: "Please provide a valid email address"
            }, {
                status: 400
            });
        }
        // Validate password length
        if (password.length < 6) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Password too short",
                message: "Password must be at least 6 characters long"
            }, {
                status: 400
            });
        }
        // Validate role
        const validRoles = [
            'SITE_MANAGER',
            'ADMIN',
            'SUPER_ADMIN'
        ];
        if (!validRoles.includes(role)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid role",
                message: "Please select a valid role"
            }, {
                status: 400
            });
        }
        // Check if user already exists
        const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
            where: {
                email: email.toLowerCase().trim()
            }
        });
        if (existingUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User already exists",
                message: "A user with this email address already exists"
            }, {
                status: 400
            });
        }
        // Hash password
        const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 12);
        // Create user
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                role: role,
                siteIds: JSON.stringify([]) // Empty array as JSON string
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(user, {
            status: 201
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error",
            message: "An error occurred while creating the user"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__01b74eb0._.js.map