import crypto from 'node:crypto'
import type { H3Event } from 'h3'

/**
 * Shared-secret check for server-to-server calls from bubblena-be
 * (INTERNAL_TOKEN there == NUXT_INTERNAL_TOKEN here). Constant-time compare;
 * fails closed when the token is not configured.
 */
export function hasValidInternalToken(event: H3Event): boolean {
  const expected = useRuntimeConfig().internalToken as string
  const given = getHeader(event, 'x-internal-token') || ''
  if (!expected || !given) return false
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function requireInternalToken(event: H3Event): void {
  if (!hasValidInternalToken(event)) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
}
