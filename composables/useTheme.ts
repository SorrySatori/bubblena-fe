import { useState } from '#app'

// Experimental site-wide dark mode. Toggles a `dark` class on <html>;
// the actual theming lives in assets/css/dark.css. Persisted in localStorage.
const STORAGE_KEY = 'bubblena-theme'

export const useTheme = () => {
  const isDark = useState<boolean>('theme-dark', () => false)

  const applyClass = (dark: boolean) => {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', dark)
    }
  }

  /** Sync reactive state from localStorage on the client (call once on init). */
  const init = () => {
    if (!import.meta.client) return
    isDark.value = localStorage.getItem(STORAGE_KEY) === 'dark'
    applyClass(isDark.value)
  }

  const set = (dark: boolean) => {
    isDark.value = dark
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    applyClass(dark)
  }

  const toggle = () => set(!isDark.value)

  return { isDark, toggle, set, init }
}
