import { SessionOptions } from 'iron-session'

export interface SessionData {
  userId?: string
  isLoggedIn: boolean
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
}

// In production, a SESSION_SECRET must be provided via environment variables.
// We throw early to avoid accidentally running with an insecure fallback.
const isProduction = process.env.NODE_ENV === 'production'
const sessionPassword = process.env.SESSION_SECRET

if (isProduction && (!sessionPassword || sessionPassword.length < 32)) {
  throw new Error('SESSION_SECRET must be set to a strong value in production')
}

export const sessionOptions: SessionOptions = {
  password: sessionPassword || 'development-only-weak-secret-do-not-use-in-production',
  cookieName: 'nothingfeed-session',
  cookieOptions: {
    httpOnly: true,
    // Only transmit cookies over HTTPS in production
    secure: isProduction,
    // Use strict in production to improve CSRF resilience; keep lax in dev for convenience
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}