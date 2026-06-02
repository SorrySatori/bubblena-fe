// Hydrate auth state on app start by reading the httpOnly session cookie
// (server-side via /api/auth/me). Runs once on the client.
export default defineNuxtPlugin(async () => {
  const { fetchMe } = useAuth()
  try {
    await fetchMe()
  } catch {
    // Not logged in / cookie invalid — stay anonymous.
  }
})
