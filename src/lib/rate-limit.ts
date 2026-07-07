import { auth } from "./auth"
import { prisma } from "./prisma"

export class MemoryRateLimit {
  private hits = new Map<string, { count: number; resetAt: number }>()

  async limit(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<{ success: boolean; remaining: number; reset: number }> {
    const now = Date.now()
    const windowKey = Math.floor(now / windowMs)
    const key = `${identifier}:${windowKey}`
    const entry = this.hits.get(key) || { count: 0, resetAt: now + windowMs }

    if (now > entry.resetAt) {
      entry.count = 0
      entry.resetAt = now + windowMs
    }

    entry.count++
    this.hits.set(key, entry)

    if (this.hits.size > 10000) {
      const keys = [...this.hits.keys()]
      for (const k of keys) {
        const e = this.hits.get(k)
        if (e && now > e.resetAt) this.hits.delete(k)
      }
    }

    return {
      success: entry.count <= limit,
      remaining: Math.max(0, limit - entry.count),
      reset: entry.resetAt,
    }
  }
}

const rateLimiter = new MemoryRateLimit()

export async function rateLimit(
  identifier: string,
  limit = 10,
  windowMs = 10000
) {
  return rateLimiter.limit(identifier, limit, windowMs)
}

export function getRateLimitHeaders(result: {
  remaining: number
  reset: number
}) {
  return {
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
  }
}
