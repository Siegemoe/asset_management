import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/auth"
import { SecurityEventGenerator } from '@/lib/security/securityEventGenerator'

// POST /api/security/generate-demo
export async function POST(request: NextRequest) {
  try {
    // Get the session
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (for demo generation)
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const { type } = await request.json().catch(() => ({ type: 'all' }))

    switch (type) {
      case 'all':
        await SecurityEventGenerator.generateDemoData()
        return NextResponse.json({ message: 'Demo data generated successfully' })
        
      case 'failed_logins':
        await SecurityEventGenerator.generateFailedLogins(10)
        return NextResponse.json({ message: 'Failed login events generated' })
        
      case 'sessions':
        await SecurityEventGenerator.generateSessionEvents()
        return NextResponse.json({ message: 'Session events generated' })
        
      case 'ip_blocks':
        await SecurityEventGenerator.generateIPBlockingEvents()
        return NextResponse.json({ message: 'IP blocking events generated' })
        
      default:
        return NextResponse.json(
          { error: 'Invalid demo type' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Demo generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}