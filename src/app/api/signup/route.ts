import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

interface SignupData {
  email: string
  password: string
  name: string
  role?: string
}

interface ValidationError {
  field: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const data: SignupData = await request.json()
    const { email, password, name, role } = data

    // Input validation
    const validationErrors: ValidationError[] = []

    // Email validation
    if (!email) {
      validationErrors.push({ field: 'email', message: 'Email address is required' })
    } else if (!isValidEmail(email)) {
      validationErrors.push({ field: 'email', message: 'Please enter a valid email address' })
    }

    // Password validation
    if (!password) {
      validationErrors.push({ field: 'password', message: 'Password is required' })
    } else if (password.length < 6) {
      validationErrors.push({ field: 'password', message: 'Password must be at least 6 characters long' })
    }

    // Name validation
    if (!name || !name.trim()) {
      validationErrors.push({ field: 'name', message: 'Full name is required' })
    } else if (name.trim().length < 2) {
      validationErrors.push({ field: 'name', message: 'Name must be at least 2 characters long' })
    }

    // Role validation
    const validRoles = ['SITE_MANAGER', 'ADMIN', 'SUPER_ADMIN']
    if (role && !validRoles.includes(role)) {
      validationErrors.push({ field: 'role', message: 'Invalid role selected' })
    }

    // Return validation errors
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationErrors,
          message: 'Please check your information and try again'
        },
        { status: 422 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim()
      }
    })

    if (existingUser) {
      return NextResponse.json(
        {
          error: 'Account already exists',
          message: 'An account with this email address already exists. Please use a different email address or try signing in instead.'
        },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Password too weak',
          message: passwordValidation.message
        },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with default SITE_MANAGER role
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        password: hashedPassword,
        role: "SITE_MANAGER", // Default role for new users
        siteIds: JSON.stringify([]) // Empty array as JSON string
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        siteIds: true
      }
    })

    return NextResponse.json(
      {
        message: 'Account created successfully! You can now sign in.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          {
            error: 'Account already exists',
            message: 'An account with this email address already exists.'
          },
          { status: 400 }
        )
      }
      
      if (error.message.includes('Database connection')) {
        return NextResponse.json(
          {
            error: 'Service temporarily unavailable',
            message: 'Our service is temporarily unavailable. Please try again in a few moments.'
          },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      {
        error: 'Unable to create account',
        message: 'We encountered an unexpected issue while creating your account. Please try again later.'
      },
      { status: 500 }
    )
  }
}

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password strength validation
function validatePasswordStrength(password: string): { isValid: boolean; message: string } {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' }
  }
  
  // Check for common weak passwords
  const commonPasswords = ['password', '123456', '123456789', 'qwerty', 'abc123']
  if (commonPasswords.includes(password.toLowerCase())) {
    return { isValid: false, message: 'This password is too common. Please choose a stronger password.' }
  }
  
  // Basic strength check - at least some variety
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  if (!hasLetter && !hasNumber) {
    return { isValid: false, message: 'Password must contain letters or numbers' }
  }
  
  return { isValid: true, message: '' }
}