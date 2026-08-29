// Sync the reactive theme state from localStorage on client startup.
// (The no-flash <html> class is applied even earlier by an inline head
// script in nuxt.config; this keeps the Vue state in sync for the toggle.)
export default defineNuxtPlugin(() => {
  useTheme().init()
})
