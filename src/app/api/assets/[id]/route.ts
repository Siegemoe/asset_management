import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getAssetForUser, getUserWithPermissions, parseSiteIds } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params for Next.js 13+ compatibility
    const { id } = await params

    // Get asset with authorization check using shared utility
    const asset = await getAssetForUser(session.user!.id, id)

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    return NextResponse.json(asset)
  } catch (error) {
    console.error("Error fetching asset:", error)
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user with permissions
    const user = await getUserWithPermissions(session.user!.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Await params for Next.js 13+ compatibility
    const { id } = await params

    const data = await request.json()
    const {
      brand,
      manufacturerPart,
      serialNumber,
      siteId,
      roomId,
      installedDate,
      type,
      imageUrl
    } = data

    // Check if user can update assets for this site
    const userSiteIds = parseSiteIds(user.siteIds)
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      if (user.role === 'SITE_MANAGER' && !userSiteIds.includes(siteId)) {
        return NextResponse.json({ error: "Unauthorized to update assets for this site" }, { status: 403 })
      }
    }

    // Note: This is a simplified version for now
    // In a full implementation, you'd need to validate that the roomId belongs to the correct siteId
    const updateData: any = {
      brand,
      manufacturerPart,
      serialNumber,
      siteId,
      roomId,
      installedDate: installedDate ? new Date(installedDate) : undefined,
      type,
    }
    
    // Only add images field if imageUrl is provided
    if (imageUrl) {
      updateData.images = {
        deleteMany: {},
        create: [{ url: imageUrl }]
      }
    }

    const asset = await prisma.asset.update({
      where: { id },
      data: updateData,
      include: {
        site: true,
        room: true,
        images: true,
        user: { select: { name: true } }
      }
    })

    return NextResponse.json(asset)
  } catch (error) {
    console.error("Error updating asset:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin privileges
    if (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Await params for Next.js 13+ compatibility
    const { id } = await params

    await prisma.asset.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting asset:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}