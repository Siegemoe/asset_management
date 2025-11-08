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
    const { id: roomId } = await params

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        site: {
          select: { id: true, name: true }
        },
        assets: {
          include: {
            images: {
              select: { url: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { assets: true }
        }
      }
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error("Error fetching room:", error)
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
    const { id: roomId } = await params

    const data = await request.json()
    const { name, status, tenantName, tenantPhone, notes } = data

    // Check if updating name and if the new name already exists in the same site
    if (name !== undefined) {
      // First get the current room to find its site
      const currentRoom = await prisma.room.findUnique({
        where: { id: roomId },
        select: { siteId: true }
      })

      if (currentRoom) {
        const existingRoom = await prisma.room.findFirst({
          where: {
            siteId: currentRoom.siteId,
            name: name.trim(),
            id: { not: roomId } // Exclude the current room being updated
          }
        })

        if (existingRoom) {
          return NextResponse.json({ 
            error: "Room name already exists",
            message: "A room with this name already exists in the selected site." 
          }, { status: 400 })
        }
      }
    }

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name.trim()
    if (status !== undefined) updateData.status = status
    if (tenantName !== undefined) updateData.tenantName = tenantName?.trim() || null
    if (tenantPhone !== undefined) updateData.tenantPhone = tenantPhone?.trim() || null
    if (notes !== undefined) updateData.notes = notes?.trim() || null

    const room = await prisma.room.update({
      where: { id: roomId },
      data: updateData,
      include: {
        site: {
          select: { id: true, name: true }
        },
        _count: {
          select: { assets: true }
        }
      }
    })

    return NextResponse.json(room)
  } catch (error) {
    console.error("Error updating room:", error)
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
    const { id: roomId } = await params

    // Check if room has assets
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        _count: {
          select: { assets: true }
        }
      }
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    if (room._count.assets > 0) {
      return NextResponse.json({
        error: "Cannot delete room with existing assets. Please remove all assets first."
      }, { status: 400 })
    }

    await prisma.room.delete({
      where: { id: roomId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting room:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}