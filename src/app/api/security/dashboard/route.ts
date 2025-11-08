import { NextRequest, NextResponse } from 'next/server'
import { RBACService } from '@/lib/security/rbac'
import { SimpleAuditLogger } from '@/lib/security/simpleAuditLogger'
import { SimpleAccountLockoutService } from '@/lib/security/simpleAccountLockout'
import { SessionManager } from '@/lib/security/sessionManager'
import { auth } from '@/auth'

// Get dashboard metrics
async function getDashboardMetrics(userId: string) {
  try {
    // In a real implementation, these would be actual database queries
    const recentSecurityEvents = await SimpleAuditLogger.getRecentEvents(50)
    const sessionStats = await SessionManager.getSessionStats()
    
    // Mock metrics calculation
    const failedLogins = recentSecurityEvents.filter(event => 
      event.eventType === 'LOGIN_FAILURE'
    ).length

    const securityEvents = recentSecurityEvents.length
    const blockedIPs = Math.floor(Math.random() * 10) // Mock data
    const activeSessions = sessionStats.activeSessions

    return {
      failedLogins,
      activeSessions,
      securityEvents,
      blockedIPs,
      recentEvents: recentSecurityEvents.slice(0, 10)
    }
  } catch (error) {
    console.error('Error getting dashboard metrics:', error)
    return {
      failedLogins: 0,
      activeSessions: 0,
      securityEvents: 0,
      blockedIPs: 0,
      recentEvents: []
    }
  }
}

// Get security events
async function getSecurityEvents(userId: string, params: URLSearchParams) {
  try {
    const page = parseInt(params.get('page') || '1')
    const limit = parseInt(params.get('limit') || '50')
    const severity = params.get('severity')
    const eventType = params.get('eventType')
    const search = params.get('search')
    const startDate = params.get('startDate')
    const endDate = params.get('endDate')

    // In a real implementation, this would query the database
    const allEvents = await SimpleAuditLogger.getRecentEvents(1000)
    
    // Apply filters
    let filteredEvents = allEvents
    
    if (severity) {
      filteredEvents = filteredEvents.filter(event => event.severity === severity)
    }
    
    if (eventType) {
      filteredEvents = filteredEvents.filter(event =>
        (event.eventType || '').toLowerCase().includes(eventType.toLowerCase())
      )
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredEvents = filteredEvents.filter(event =>
        (event.description || '').toLowerCase().includes(searchLower) ||
        (event.ipAddress && event.ipAddress.toLowerCase().includes(searchLower)) ||
        (event.userId && event.userId.toLowerCase().includes(searchLower))
      )
    }
    
    if (startDate) {
      const start = new Date(startDate)
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.createdAt) >= start
      )
    }
    
    if (endDate) {
      const end = new Date(endDate)
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.createdAt) <= end
      )
    }

    // Sort by creation date (newest first)
    filteredEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Paginate
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex)

    return {
      events: paginatedEvents,
      pagination: {
        page,
        limit,
        total: filteredEvents.length,
        totalPages: Math.ceil(filteredEvents.length / limit)
      }
    }
  } catch (error) {
    console.error('Error getting security events:', error)
    return {
      events: [],
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0
      }
    }
  }
}

// Get security alerts
async function getSecurityAlerts(userId: string) {
  try {
    // In a real implementation, this would come from a alerts table
    const recentEvents = await SimpleAuditLogger.getRecentEvents(100)
    
    const alerts = recentEvents
      .filter(event => 
        event.severity === 'HIGH' || 
        event.severity === 'CRITICAL' ||
        event.eventType === 'BRUTE_FORCE' ||
        event.eventType === 'UNAUTHORIZED_ACCESS'
      )
      .slice(0, 20)
      .map(event => ({
        id: event.id,
        type: event.eventType,
        message: event.description,
        severity: event.severity,
        timestamp: event.createdAt,
        acknowledged: false // Mock data
      }))

    return { alerts }
  } catch (error) {
    console.error('Error getting security alerts:', error)
    return { alerts: [] }
  }
}

// GET /api/security/dashboard
export async function GET(request: NextRequest) {
  try {
    // Get the session
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    
    // Check if user has security read permission
    const hasPermission = await RBACService.hasPermission(userId, 'security:read')
    if (!hasPermission) {
      await SimpleAuditLogger.logSecurityEvent('UNAUTHORIZED_ACCESS', userId, {
        action: 'security_dashboard_access_denied',
        path: request.nextUrl.pathname
      }, request.headers.get('x-forwarded-for') || undefined, request.headers.get('user-agent') || undefined)
      
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Get the data type from query parameter
    const dataType = request.nextUrl.searchParams.get('type') || 'metrics'
    
    let response
    
    switch (dataType) {
      case 'metrics':
        response = await getDashboardMetrics(userId)
        break
        
      case 'events':
        response = await getSecurityEvents(userId, request.nextUrl.searchParams)
        break
        
      case 'alerts':
        response = await getSecurityAlerts(userId)
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid data type' },
          { status: 400 }
        )
    }

    // Log the access
    await SimpleAuditLogger.logDataAccess(
      userId,
      'security_dashboard',
      'read',
      dataType,
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Security dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}