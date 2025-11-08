import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get sites with user assignments
    const sites = await prisma.site.findMany({
      include: {
        _count: {
          select: { rooms: true, assets: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get user assignments for each site
    const sitesWithUsers = await Promise.all(
      sites.map(async (site) => {
        const assignedUsers = await prisma.user.findMany({
          where: {
            siteIds: {
              contains: site.id
            }
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        })
        return {
          ...site,
          assignedUsers
        }
      })
    )

    return NextResponse.json(sitesWithUsers)
  } catch (error) {
    console.error("Error fetching sites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin privileges
    if (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const data = await request.json()
    const { name, address } = data

    if (!name) {
      return NextResponse.json({ error: "Site name is required" }, { status: 400 })
    }

    // Check if site with this name already exists
    const existingSite = await prisma.site.findFirst({
      where: {
        name: name.trim()
      }
    })

    if (existingSite) {
      return NextResponse.json({
        error: "Site name already exists",
        message: "A site with this name already exists. Please choose a different name."
      }, { status: 400 })
    }

    const site = await prisma.site.create({
      data: {
        name: name.trim(),
        address: address || null
      },
      include: {
        _count: {
          select: { rooms: true, assets: true }
        }
      }
    })

    return NextResponse.json(site, { status: 201 })
  } catch (error) {
    console.error("Error creating site:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}