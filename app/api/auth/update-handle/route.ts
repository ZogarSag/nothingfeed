import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions)

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { handle } = await request.json()

    if (!handle || typeof handle !== 'string') {
      return NextResponse.json({ error: 'Handle is required' }, { status: 400 })
    }

    const trimmedHandle = handle.trim()

    if (trimmedHandle.length < 2) {
      return NextResponse.json({ error: 'Username must be at least 2 characters long' }, { status: 400 })
    }

    if (trimmedHandle.length > 50) {
      return NextResponse.json({ error: 'Username must be less than 50 characters long' }, { status: 400 })
    }

    // Check if handle contains only allowed characters
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedHandle)) {
      return NextResponse.json({ error: 'Username can only contain letters, numbers, and underscores' }, { status: 400 })
    }

    // Check if handle is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { handle: trimmedHandle },
      select: { id: true }
    })

    if (existingUser && existingUser.id !== session.userId) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 })
    }

    // Update the user's handle
    await prisma.user.update({
      where: { id: session.userId },
      data: { handle: trimmedHandle }
    })

    return NextResponse.json({ message: 'Username updated successfully' })

  } catch (error) {
    console.error('Error in /api/auth/update-handle:', error)
    return NextResponse.json(
      { error: 'Failed to update username' },
      { status: 500 }
    )
  }
}