import {
  backendBase,
  backendHeaders,
  getSessionToken,
  SESSION_COOKIE,
} from '../../utils/authProxy'

export default defineEventHandler(async (event) => {
  const token = getSessionToken(event)
  if (!token) return { user: null }

  try {
    const res = await $fetch<{ user: any }>(`${backendBase()}/auth/me`, {
      method: 'GET',
      headers: backendHeaders(token),
    })
    return { user: res.user }
  } catch (error: any) {
    // Stale/invalid token → clear it and report logged-out rather than erroring.
    if (error?.statusCode === 401 || error?.response?.status === 401) {
      deleteCookie(event, SESSION_COOKIE, { path: '/' })
      return { user: null }
    }
    console.error('me.get error:', error)
    return { user: null }
  }
})
