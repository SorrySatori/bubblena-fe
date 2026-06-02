import {
  backendBase,
  backendHeaders,
  rethrowBackendError,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '../../utils/authProxy'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
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
