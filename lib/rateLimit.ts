import { NextRequest } from 'next/server'

interface RateLimitOptions {
  windowMs: number
  maxRequests: number
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  isAllowed(ip: string, options: RateLimitOptions): boolean {
    const now = Date.now()
    const windowStart = now - options.windowMs
    
    // Get existing requests for this IP
    const ipRequests = this.requests.get(ip) || []
    
    // Remove requests outside the time window
    const validRequests = ipRequests.filter(time => time > windowStart)
    
    // Check if limit exceeded
    if (validRequests.length >= options.maxRequests) {
      return false
    }
    
    // Add current request
    validRequests.push(now)
    this.requests.set(ip, validRequests)
    
    return true
  }

  cleanup() {
    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    
    for (const [ip, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > now - oneHour)
      if (validRequests.length === 0) {
        this.requests.delete(ip)
      } else {
        this.requests.set(ip, validRequests)
      }
    }
  }
}

const rateLimiter = new RateLimiter()

// Cleanup old entries every 10 minutes
setInterval(() => rateLimiter.cleanup(), 10 * 60 * 1000)

export function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions = { windowMs: 15 * 60 * 1000, maxRequests: 100 }
): boolean {
  const ip = request.ip || 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') || 
    'unknown'
    
  return rateLimiter.isAllowed(ip, options)
}

export const rateLimitOptions = {
  // Standard API calls
  standard: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes
  
  // Authentication endpoints (more restrictive)
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 10 }, // 10 requests per 15 minutes
  
  // File uploads (very restrictive)
  upload: { windowMs: 60 * 60 * 1000, maxRequests: 20 }, // 20 uploads per hour
}