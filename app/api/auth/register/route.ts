import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  handle: z.string()
    .min(3, 'Handle must be at least 3 characters')
    .max(20, 'Handle must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      )
    }

    const { email, password, handle } = result.data

    // Check if email or handle already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { handle: handle.toLowerCase() }
        ]
      }
    })

    if (existingUser) {
      // Neutral error message for security (don't reveal if email/handle exists)
      return NextResponse.json(
        { error: 'Registration not possible' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        handle: handle.toLowerCase(),
      },
      select: {
        id: true,
        email: true,
        handle: true,
        createdAt: true,
      }
    })

    // Create initial user stats
    await prisma.userStats.create({
      data: {
        userId: user.id,
      }
    })

    // In a real app, you would send a confirmation email here
    // For MVP, we'll just return success
    return NextResponse.json(
      { 
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          handle: user.handle,
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}