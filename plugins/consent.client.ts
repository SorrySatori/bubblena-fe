/**
 * Hydrate consent + dependent client state from localStorage on startup.
 * Runs before the app mounts, so components see the resolved consent value
 * (useState initializers don't re-run on the client after SSR payload).
 */
export default defineNuxtPlugin(() => {
  const { loadConsent } = useConsent()
  loadConsent()

  const { load } = useRecentlyViewed()
  load()
})
