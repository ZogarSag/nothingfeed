import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { sessionOptions, SessionData } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, rateLimitOptions } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for file uploads
    if (!checkRateLimit(request, rateLimitOptions.upload)) {
      return NextResponse.json(
        { error: 'Too many uploads. Please try again later.' },
        { status: 429 }
      )
    }

    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions)

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const data = await request.formData()
    const file: File | null = data.get('avatar') as unknown as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${session.userId}-${Date.now()}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    // Save file
    await writeFile(filePath, buffer)

    // Update user in database
    const avatarUrl = `/uploads/avatars/${fileName}`
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { avatarUrl },
      select: {
        id: true,
        handle: true,
        avatarUrl: true,
      }
    })

    return NextResponse.json({
      message: 'Avatar uploaded successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}