import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

interface UserAssignment {
  userId: string
  role: string
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin privileges
    if (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Await params since they're now a Promise in Next.js 13+
    const { id: siteId } = await params

    const data = await request.json()
    const { userAssignments }: { userAssignments: UserAssignment[] } = data

    if (!userAssignments || !Array.isArray(userAssignments)) {
      return NextResponse.json({ error: "Invalid user assignments" }, { status: 400 })
    }

    // Verify site exists
    const site = await prisma.site.findUnique({
      where: { id: siteId }
    })

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    // Process each user assignment
    for (const assignment of userAssignments) {
      const user = await prisma.user.findUnique({
        where: { id: assignment.userId }
      })

      if (!user) {
        continue // Skip non-existent users
      }

      // Get current siteIds or initialize empty array
      let currentSiteIds: string[] = []
      if (user.siteIds) {
        try {
          currentSiteIds = JSON.parse(user.siteIds)
        } catch {
          currentSiteIds = []
        }
      }

      // Add this site if not already present
      if (!currentSiteIds.includes(siteId)) {
        currentSiteIds.push(siteId)
      }

      // Update user with new siteIds and role
      await prisma.user.update({
        where: { id: assignment.userId },
        data: {
          siteIds: JSON.stringify(currentSiteIds),
          role: (assignment.role as import('@prisma/client').Role) || 'SITE_MANAGER'
        }
      })
    }

    return NextResponse.json({ success: true, message: "Users assigned successfully" })
  } catch (error) {
    console.error("Error assigning users to site:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}