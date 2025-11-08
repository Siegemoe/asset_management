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

    // Unwrap params promise
    const { id: siteId } = await params

    // Get rooms for the specific site
    const rooms = await prisma.room.findMany({
      where: { siteId },
      include: {
        _count: {
          select: { assets: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(rooms)
  } catch (error) {
    console.error("Error fetching site rooms:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
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

    // Unwrap params promise
    const { id: siteId } = await params

    const data = await request.json()
    const { name, status = 'READY', tenantName, tenantPhone, notes } = data

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 })
    }

    // Check if room name already exists in this site
    const existingRoom = await prisma.room.findUnique({
      where: {
        siteId_name: {
          siteId,
          name: name
        }
      }
    })

    if (existingRoom) {
      return NextResponse.json({ error: "Room with this name already exists in this site" }, { status: 400 })
    }

    const room = await prisma.room.create({
      data: {
        name,
        siteId,
        status,
        tenantName: tenantName || null,
        tenantPhone: tenantPhone || null,
        notes: notes || null
      },
      include: {
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