import { describe, it, expect } from 'vitest'
import { signOrderAccess, verifyOrderAccess } from '../server/utils/orderToken'

const ORDER = '11111111-1111-4111-8111-111111111111'

describe('order access token', () => {
  it('round-trips with the same secret', () => {
    const t = signOrderAccess(ORDER, 's3cret')
    expect(verifyOrderAccess(ORDER, t, 's3cret')).toBe(true)
  })
  it('rejects other orders, other secrets, tampering and missing input', () => {
    const t = signOrderAccess(ORDER, 's3cret')
    expect(verifyOrderAccess('22222222-2222-4222-8222-222222222222', t, 's3cret')).toBe(false)
    expect(verifyOrderAccess(ORDER, t, 'other')).toBe(false)
    expect(verifyOrderAccess(ORDER, t.slice(0, -1) + (t.endsWith('A') ? 'B' : 'A'), 's3cret')).toBe(false)
    expect(verifyOrderAccess(ORDER, undefined, 's3cret')).toBe(false)
    expect(verifyOrderAccess(ORDER, t, '')).toBe(false)
  })
  it('matches the backend implementation (HMAC-SHA256 base64url over "order:<id>")', () => {
    // Same vector as bubblena-be/test/orderToken.test.ts uses for the format check.
    expect(signOrderAccess(ORDER, 'test-secret')).toMatch(/^[A-Za-z0-9_-]{43}$/)
  })
})
