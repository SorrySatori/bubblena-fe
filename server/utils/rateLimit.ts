import type { H3Event } from 'h3'

/**
 * Minimal in-memory fixed-window rate limiter keyed by (bucket, client IP).
 * Good enough for a single Nitro instance; swap the store for Redis/KV if the
 * app is ever scaled horizontally.
 */
interface Window { count: number; resetAt: number }

const store = new Map<string, Window>()
const MAX_ENTRIES = 10_000

function clientIp(event: H3Event): string {
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}

function sweep(now: number) {
  if (store.size < MAX_ENTRIES) return
  for (const [key, w] of store) {
    if (w.resetAt <= now) store.delete(key)
  }
}

export interface RateLimitOptions {
  /** Bucket name, e.g. 'contact' or 'login'. */
  name: string
  /** Max requests per window. */
  limit: number
  /** Window length in ms. */
  windowMs: number
  /** Extra key component (e.g. normalized e-mail) to limit per account as well as per IP. */
  key?: string
}

/** Throws 429 when the caller exceeded `limit` requests in the current window. */
export function assertRateLimit(event: H3Event, opts: RateLimitOptions): void {
  const now = Date.now()
  sweep(now)

  const key = `${opts.name}:${opts.key ?? clientIp(event)}`
  const current = store.get(key)

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs })
    return
  }

  current.count += 1
  if (current.count > opts.limit) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    setResponseHeader(event, 'Retry-After', retryAfter)
    throw createError({
      statusCode: 429,
      message: 'Příliš mnoho požadavků. Zkuste to prosím za chvíli znovu.',
    })
  }
}
