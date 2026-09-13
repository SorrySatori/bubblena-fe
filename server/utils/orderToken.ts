import crypto from 'node:crypto'

/**
 * Capability token for the order-confirmation page: HMAC(orderId) with the
 * INTERNAL_TOKEN shared with bubblena-be, which issues it on order creation and
 * puts it into the Stripe success URL. Mirrors src/utils/orderToken.ts there.
 */
export function signOrderAccess(orderId: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(`order:${orderId}`).digest('base64url')
}

export function verifyOrderAccess(orderId: string, token: unknown, secret: string): boolean {
  if (!secret || typeof token !== 'string' || !token) return false
  const expected = Buffer.from(signOrderAccess(orderId, secret))
  const given = Buffer.from(token)
  return expected.length === given.length && crypto.timingSafeEqual(expected, given)
}
