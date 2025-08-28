import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

    // Get deletions from database, ordered by creation time (newest first)
    const deletions = await prisma.deletion.findMany({
      take: limit + 1, // Take one extra to check if there are more
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // Skip the cursor itself
      }),
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
                  select: {
          handle: true,
          avatarUrl: true,
        }
        }
      }
    })

    // Check if there are more items
    const hasMore = deletions.length > limit
    const items = hasMore ? deletions.slice(0, -1) : deletions

    // Transform for frontend
    const feedItems = items.map(deletion => ({
      id: deletion.id,
      charCount: deletion.charCount,
      wordCount: deletion.wordCount,
      sentenceCount: deletion.sentenceCount,
      imageCount: deletion.imageCount,
      linkCount: deletion.linkCount,
      createdAt: deletion.createdAt.toISOString(),
      author: {
        handle: deletion.author.handle,
        avatarUrl: deletion.author.avatarUrl,
      }
    }))

    return NextResponse.json({
      items: feedItems,
      hasMore,
      nextCursor: hasMore ? items[items.length - 1].id : null,
    })

  } catch (error) {
    console.error('Error in /api/feed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}