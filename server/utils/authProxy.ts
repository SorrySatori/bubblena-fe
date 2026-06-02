import type { H3Event } from 'h3'

// httpOnly session cookie set on the Nuxt origin. Holds the JWT issued by the
// backend; never exposed to browser JS.
export const SESSION_COOKIE = 'bubblena_session'

export function backendBase() {
  return useRuntimeConfig().public.apiBase
}

/** Headers for backend calls: api-key always, Bearer token when authenticated. */
export function backendHeaders(token?: string) {
  const config = useRuntimeConfig()
  const headers: Record<string, string> = {
    'x-api-key': (config.apiKey as string) || '',
    'Content-Type': 'application/json',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 dní, ladí s expirací JWT
  }
}

export function getSessionToken(event: H3Event): string | null {
  return getCookie(event, SESSION_COOKIE) || null
}

/** Re-throw a backend $fetch error as an H3 error preserving its status + message. */
export function rethrowBackendError(error: any): never {
  const statusCode = error?.statusCode || error?.response?.status || 500
  const data = error?.data || error?.response?._data
  throw createError({
    statusCode,
    message: data?.message || data?.error || 'Požadavek se nezdařil.',
    data,
  })
}
