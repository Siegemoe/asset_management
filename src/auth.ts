import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { SimpleAccountLockoutService } from "@/lib/security/simpleAccountLockout"
import { SimpleAuditLogger } from "@/lib/security/simpleAuditLogger"
import { SessionManager } from "@/lib/security/sessionManager"
import { SecurityMiddleware } from "@/lib/security/securityMiddleware"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const ipAddress = req?.headers?.get('x-forwarded-for') ||
                         req?.headers?.get('x-real-ip') ||
                         'unknown'
        const userAgent = req?.headers?.get('user-agent') || 'unknown'
        
        console.log('🔍 Enhanced authentication attempt:', {
          hasEmail: !!credentials?.email,
          hasPassword: !!credentials?.password,
          email: credentials?.email,
          ipAddress,
          userAgent
        })
        
        if (!credentials || typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
          console.log('❌ Invalid credentials format')
          return null
        }

        // Find user by email (case insensitive)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        })

        if (!user) {
          console.log('❌ User not found')
          // Log failed login attempt for non-existent user
          await SimpleAuditLogger.logLoginAttempt(
            undefined,
            credentials.email.toLowerCase(),
            false,
            ipAddress,
            userAgent,
            'User not found'
          )
          return null
        }

        if (!user.password) {
          console.log('❌ User has no password set')
          await SimpleAuditLogger.logLoginAttempt(
            user.id,
            user.email,
            false,
            ipAddress,
            userAgent,
            'No password set'
          )
          return null
        }

        // Check account lockout status
        const lockoutStatus = await SimpleAccountLockoutService.isAccountLocked(user.id)
        if (lockoutStatus.locked) {
          console.log('❌ Account is locked')
          await SimpleAuditLogger.logLoginAttempt(
            user.id,
            user.email,
            false,
            ipAddress,
            userAgent,
            'Account locked'
          )
          return null
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        console.log('🔐 Password validation:', { valid: isPasswordValid })
        
        if (!isPasswordValid) {
          console.log('❌ Invalid password')
          // Record failed login attempt
          await SimpleAccountLockoutService.recordLoginAttempt(
            user.id,
            user.email,
            false,
            ipAddress,
            userAgent,
            'Invalid password'
          )
          return null
        }

        // Check for suspicious activity
        const suspiciousActivity = await SessionManager.checkSuspiciousActivity(
          user.id,
          ipAddress,
          userAgent
        )
        
        if (suspiciousActivity.suspicious) {
          console.log('⚠️ Suspicious activity detected:', suspiciousActivity.reasons)
          await SimpleAuditLogger.logSecurityEvent(
            'UNAUTHORIZED_ACCESS',
            user.id,
            {
              reasons: suspiciousActivity.reasons,
              ipAddress,
              userAgent,
              eventType: 'SUSPICIOUS_LOGIN'
            },
            ipAddress,
            userAgent
          )
        }

        // Create enhanced session
        const sessionToken = SecurityMiddleware.generateSecureRandomString(32)
        const refreshToken = SecurityMiddleware.generateSecureRandomString(32)
        
        await SessionManager.createSession(
          user.id,
          sessionToken,
          refreshToken,
          `Browser: ${userAgent.substring(0, 50)}`,
          ipAddress,
          userAgent
        )

        // Log successful login attempt - THIS WAS MISSING!
        await SimpleAuditLogger.logLoginAttempt(
          user.id,
          user.email,
          true,
          ipAddress,
          userAgent,
          'Successful login'
        )

        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          siteIds: user.siteIds,
          sessionToken,
          refreshToken,
        }
        
        console.log('✅ Enhanced authentication successful for user:', user.email)
        return userData
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string
        session.user.role = (token.role as "SUPER_ADMIN" | "ADMIN" | "SITE_MANAGER") || "SITE_MANAGER"
        session.user.siteIds = token.siteIds ? JSON.parse(token.siteIds as string) : []
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role as "SUPER_ADMIN" | "ADMIN" | "SITE_MANAGER"
        token.siteIds = user.siteIds as string
      }
      return token
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
})

// Custom signOut function with logout logging
export async function customSignOut(options: { callbackUrl?: string; redirect?: boolean } = {}) {
  try {
    // Get current session for logging
    const session = await auth()
    if (session?.user?.id) {
      const ipAddress = 'unknown' // Would need to get from request context
      const userAgent = 'unknown'
      
      // Log logout event
      await SimpleAuditLogger.logLogout(
        session.user.id,
        ipAddress,
        userAgent
      )
      
      // Session cleanup would happen here when the method is implemented
    }
  } catch (error) {
    console.error('Error during logout:', error)
  }
  
  // Call original signOut
  return signOut(options)
}
