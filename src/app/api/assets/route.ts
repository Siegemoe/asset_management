import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getAssetsForUser } from "@/lib/auth"
import { generateAssetNumber } from "@/lib/utils"
import { SimpleAuditLogger } from "@/lib/security/simpleAuditLogger"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const assets = await getAssetsForUser(session.user!.id)
    
    // Log data access
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    await SimpleAuditLogger.logDataAccess(
      session.user!.id,
      'assets',
      'list',
      undefined,
      ipAddress,
      userAgent
    )
    
    return NextResponse.json(assets)
  } catch (error) {
    console.error("Error fetching assets:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const {
      brand,
      manufacturerPart,
      serialNumber,
      siteId,
      roomId,
      installedDate,
      type,
      imageUrl // optional
    } = data

    // Validate required fields
    if (!brand || !manufacturerPart || !serialNumber || !siteId || !roomId || !installedDate || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user can create assets for this site
    const user = await prisma.user.findUnique({
      where: { id: session.user!.id },
      select: { role: true, siteIds: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userSiteIds = user.siteIds ? JSON.parse(user.siteIds) : []
    if (user.role !== 'SUPER_ADMIN' && !userSiteIds.includes(siteId)) {
      return NextResponse.json({ error: "Unauthorized to create assets for this site" }, { status: 403 })
    }

    // Validate that the room belongs to the site
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { name: true, siteId: true }
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    if (room.siteId !== siteId) {
      return NextResponse.json({ error: "Room does not belong to the selected site" }, { status: 400 })
    }

    // Generate asset number
    const assetNumber = generateAssetNumber(
      (await prisma.site.findUnique({ where: { id: siteId }, select: { name: true } }))!.name,
      room.name
    )

    const asset = await prisma.asset.create({
      data: {
        assetNumber,
        brand,
        manufacturerPart,
        serialNumber,
        siteId,
        roomId,
        installedDate: new Date(installedDate),
        type,
        userId: session.user!.id as string,
        // images: imageUrl ? {
        //   create: [{
        //     url: imageUrl
        //   }]
        // } : undefined
      },
      include: {
        site: true,
        room: true,
        images: true,
        user: { select: { name: true } }
      }
    })

    // Log data modification
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    await SimpleAuditLogger.logDataModification(
      session.user!.id,
      'assets',
      'create',
      asset.id,
      { brand, manufacturerPart, serialNumber, siteId, roomId, type },
      ipAddress,
      userAgent
    )

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error("Error creating asset:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
