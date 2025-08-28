import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData, defaultSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions)
    
    if (!session.isLoggedIn) {
      return NextResponse.json({ isLoggedIn: false })
    }

    // Get user data from database
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        handle: true,
        avatarUrl: true,
        createdAt: true,
      }
    })

    if (!user) {
      // Session exists but user was deleted - clear session
      session.destroy()
      return NextResponse.json({ isLoggedIn: false })
    }

    return NextResponse.json({
      isLoggedIn: true,
      user: {
        id: user.id,
        email: user.email,
        handle: user.handle,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      }
    })
  } catch (error) {
    console.error('Error in /api/me:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}