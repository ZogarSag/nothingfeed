import { SessionOptions } from 'iron-session'

export interface SessionData {
  userId?: string
  isLoggedIn: boolean
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'fallback-secret-key-for-development-only-change-in-production',
  cookieName: 'nothingfeed-session',
  cookieOptions: {
    httpOnly: true,
    secure: false, // Set to false for HTTP servers
    sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}