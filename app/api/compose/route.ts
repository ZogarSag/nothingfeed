import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { z } from 'zod'
import { sessionOptions, SessionData } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { analyzeText } from '@/lib/textAnalysis'

const composeSchema = z.object({
  text: z.string().max(500, 'Text too long (max 500 characters)'),
  images: z.array(z.string()).optional().default([]),
  links: z.array(z.string().url()).optional().default([]),
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions)
    
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const result = composeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      )
    }

    const { text, images = [], links = [] } = result.data

    // CRITICAL: We NEVER store the actual content!
    // Only calculate metadata and immediately discard the content

    // Analyze the text for metadata before "deleting" it
    const analysis = analyzeText(text)
    
    // Add manual counts for images and links from schema
    analysis.imageCount += images.length
    analysis.linkCount += links.length

    // Ensure at least some content exists
    if (analysis.charCount === 0 && analysis.imageCount === 0 && analysis.linkCount === 0) {
      return NextResponse.json(
        { error: 'Please add some content to delete' },
        { status: 400 }
      )
    }

    // Create deletion entry with metadata only
    const deletion = await prisma.deletion.create({
      data: {
        authorId: session.userId,
        charCount: analysis.charCount,
        wordCount: analysis.wordCount,
        sentenceCount: analysis.sentenceCount,
        imageCount: analysis.imageCount,
        linkCount: analysis.linkCount,
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

    // Update user statistics
    await prisma.userStats.upsert({
      where: { userId: session.userId },
      update: {
        totalChars: { increment: analysis.charCount },
        totalWords: { increment: analysis.wordCount },
        totalSentences: { increment: analysis.sentenceCount },
        totalImages: { increment: analysis.imageCount },
        totalLinks: { increment: analysis.linkCount },
        totalActions: { increment: 1 },
      },
      create: {
        userId: session.userId,
        totalChars: analysis.charCount,
        totalWords: analysis.wordCount,
        totalSentences: analysis.sentenceCount,
        totalImages: analysis.imageCount,
        totalLinks: analysis.linkCount,
        totalActions: 1,
      }
    })

    // IMPORTANT: Content is now destroyed, only metadata remains
    // Return the deletion metadata for the feed
    return NextResponse.json({
      message: 'Content deleted successfully',
      deletion: {
        id: deletion.id,
        charCount: deletion.charCount,
        wordCount: deletion.wordCount,
        sentenceCount: deletion.sentenceCount,
        imageCount: deletion.imageCount,
        linkCount: deletion.linkCount,
        createdAt: deletion.createdAt,
        author: {
          handle: deletion.author.handle,
          avatarUrl: deletion.author.avatarUrl,
        }
      }
    })

  } catch (error) {
    console.error('Compose error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}