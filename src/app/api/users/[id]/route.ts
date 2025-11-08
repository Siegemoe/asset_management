import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

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
    const { id: userId } = await params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
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
    const { id: userId } = await params

    const data = await request.json()
    const { name, email, role, password } = data

    // Validate input
    if (!name || !email || !role) {
      return NextResponse.json({
        error: "Missing required fields",
        message: "Name, email, and role are required"
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: "Invalid email",
        message: "Please provide a valid email address"
      }, { status: 400 })
    }

    // Validate role
    const validRoles = ['SITE_MANAGER', 'ADMIN', 'SUPER_ADMIN']
    if (!validRoles.includes(role)) {
      return NextResponse.json({
        error: "Invalid role",
        message: "Please select a valid role"
      }, { status: 400 })
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        NOT: { id: userId }
      }
    })

    if (existingUser) {
      return NextResponse.json({
        error: "Email already exists",
        message: "A user with this email address already exists"
      }, { status: 400 })
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role as import('@prisma/client').Role,
      updatedAt: new Date()
    }

    // Add password if provided
    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({
      error: "Internal server error",
      message: "An error occurred while updating the user"
    }, { status: 500 })
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
    const { id: userId } = await params

    // Prevent self-deletion
    if (session.user.id === userId) {
      return NextResponse.json({
        error: "Cannot delete yourself",
        message: "You cannot delete your own account"
      }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has assets
    const assetCount = await prisma.asset.count({
      where: { userId: userId }
    })

    if (assetCount > 0) {
      return NextResponse.json({
        error: "User has associated assets",
        message: "Cannot delete user. This user has associated assets that need to be reassigned first."
      }, { status: 400 })
    }

    // Delete user and associated data
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: "User deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({
      error: "Internal server error",
      message: "An error occurred while deleting the user"
    }, { status: 500 })
  }
}