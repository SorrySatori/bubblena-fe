// Route middleware protecting customer-only pages (/ucet/*).
// Opt in via definePageMeta({ middleware: 'auth' }).
export default defineNuxtRouteMiddleware(async (to) => {
  // Auth state is hydrated client-side from the httpOnly cookie; skip on server.
  if (import.meta.server) return

  const { loggedIn, fetchMe } = useAuth()
  if (!loggedIn.value) {
    try {
      await fetchMe()
    } catch {
      // ignore
    }
  }

  if (!loggedIn.value) {
    return navigateTo(`/prihlaseni?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
