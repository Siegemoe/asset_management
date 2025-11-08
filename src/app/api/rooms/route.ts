import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

interface CreateRoomData {
  name: string
  siteId: string
  status?: string
  tenantName?: string
  tenantPhone?: string
  notes?: string
}

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin privileges
    if (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const rooms = await prisma.room.findMany({
      include: {
        site: {
          select: { id: true, name: true }
        },
        _count: {
          select: { assets: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(rooms)
  } catch (error) {
    console.error("Error fetching rooms:", error)
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

    const data = await request.json() as CreateRoomData
    const { name, siteId, tenantName, tenantPhone, notes } = data

    if (!name || !siteId) {
      return NextResponse.json({ error: "Name and site are required" }, { status: 400 })
    }

    // Check if room name already exists in the site
    const existingRoom = await prisma.room.findUnique({
      where: {
        siteId_name: {
          siteId,
          name: name.trim()
        }
      }
    })

    if (existingRoom) {
      return NextResponse.json({
        error: "Room name already exists",
        message: "A room with this name already exists in the selected site."
      }, { status: 400 })
    }

    const room = await prisma.room.create({
      data: {
        name: name.trim(),
        siteId,
        tenantName: tenantName?.trim() || null,
        tenantPhone: tenantPhone?.trim() || null,
        notes: notes?.trim() || null
      },
      include: {
        site: {
          select: { id: true, name: true }
        },
        _count: {
          select: { assets: true }
        }
      }
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}