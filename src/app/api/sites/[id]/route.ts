import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const site = await prisma.site.findUnique({
      where: { id: siteId },
      include: {
        _count: {
          select: { rooms: true, assets: true }
        }
      }
    })

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    return NextResponse.json(site)
  } catch (error) {
    console.error("Error fetching site:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
    const { name, address, status } = data

    // Check if updating name and if the new name already exists
    if (name !== undefined) {
      const existingSite = await prisma.site.findFirst({
        where: {
          name: name.trim(),
          id: { not: siteId } // Exclude the current site being updated
        }
      })

      if (existingSite) {
        return NextResponse.json({
          error: "Site name already exists",
          message: "A site with this name already exists. Please choose a different name."
        }, { status: 400 })
      }
    }

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name.trim()
    if (address !== undefined) updateData.address = address?.trim() || null
    if (status !== undefined) updateData.status = status

    const site = await prisma.site.update({
      where: { id: siteId },
      data: updateData,
      include: {
        _count: {
          select: { rooms: true, assets: true }
        }
      }
    })

    return NextResponse.json(site)
  } catch (error) {
    console.error("Error updating site:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Check if site has assets or rooms
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      include: {
        _count: {
          select: { rooms: true, assets: true }
        }
      }
    })

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    if (site._count.assets > 0 || site._count.rooms > 0) {
      return NextResponse.json({
        error: "Cannot delete site with existing assets or rooms. Please remove all assets and rooms first."
      }, { status: 400 })
    }

    await prisma.site.delete({
      where: { id: siteId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting site:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}