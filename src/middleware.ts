import { auth } from "@/auth"
import { SimpleAuditLogger } from "@/lib/security/simpleAuditLogger"
import { NextResponse } from "next/server"

export default auth(async (req) => {
  const isAuth = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/login')
  const isHomePage = req.nextUrl.pathname === '/'
  
  // Get request details for security logging
  const ipAddress = req.headers.get('x-forwarded-for') ||
                   req.headers.get('x-real-ip') ||
                   'unknown'
  const userAgent = req.headers.get('user-agent') || 'unknown'
  const attemptedPath = req.nextUrl.pathname

  if (isHomePage && isAuth) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }

  if (isAuthPage && isAuth) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }

  if (!isAuth && (req.nextUrl.pathname.startsWith('/dashboard') ||
                  req.nextUrl.pathname.startsWith('/admin') ||
                  req.nextUrl.pathname.startsWith('/security'))) {
    
    // Log unauthorized access attempt
    try {
      await SimpleAuditLogger.logSecurityEvent(
        'UNAUTHORIZED_ACCESS',
        'anonymous',
        {
          attemptedPath,
          httpMethod: req.method,
          reason: 'Authentication required'
        },
        ipAddress,
        userAgent
      )
    } catch (error) {
      console.error('Failed to log unauthorized access attempt:', error)
    }
    
    return Response.redirect(new URL('/login', req.nextUrl))
  }

  // Allow the request to continue
  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
