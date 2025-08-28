import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params

    if (!handle) {
      return NextResponse.json({ error: 'Handle is required' }, { status: 400 })
    }

    // Find user by handle
    const user = await prisma.user.findUnique({
      where: {
        handle: handle
      },
      select: {
        id: true,
        handle: true,
        avatarUrl: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user stats
    const stats = await prisma.userStats.findUnique({
      where: {
        userId: user.id
      }
    })

    // Get user's recent deletions
    const deletions = await prisma.deletion.findMany({
      where: {
        authorId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      select: {
        id: true,
        charCount: true,
        wordCount: true,
        sentenceCount: true,
        imageCount: true,
        linkCount: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      user,
      stats: stats || {
        totalChars: 0,
        totalImages: 0,
        totalLinks: 0,
        totalActions: 0
      },
      deletions
    })

  } catch (error) {
    console.error('Error in /api/profile/[handle]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}