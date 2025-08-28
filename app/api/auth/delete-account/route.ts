import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions)

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete user's data in the correct order (foreign key constraints)
    await prisma.userStats.deleteMany({
      where: { userId: session.userId }
    })

    await prisma.deletion.deleteMany({
      where: { authorId: session.userId }
    })

    await prisma.user.delete({
      where: { id: session.userId }
    })

    // Clear session
    session.destroy()

    return NextResponse.json({ message: 'Account deleted successfully' })

  } catch (error) {
    console.error('Error in /api/auth/delete-account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}