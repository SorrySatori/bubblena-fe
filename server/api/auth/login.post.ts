import {
  backendBase,
  backendHeaders,
  rethrowBackendError,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '../../utils/authProxy'
import { assertRateLimit } from '../../utils/rateLimit'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  // Per IP and per account, so a distributed guess still hits the account cap.
  assertRateLimit(event, { name: 'login-ip', limit: 20, windowMs: 15 * 60 * 1000 })
  if (email) assertRateLimit(event, { name: 'login-acct', key: email, limit: 10, windowMs: 15 * 60 * 1000 })

  try {
    const res = await $fetch<{ token: string; user: any }>(`${backendBase()}/auth/login`, {
      method: 'POST',
      headers: backendHeaders(),
      body: { email: body?.email, password: body?.password },
    })
    setCookie(event, SESSION_COOKIE, res.token, sessionCookieOptions())
    return { user: res.user }
  } catch (error: any) {
    rethrowBackendError(error)
  }
})
