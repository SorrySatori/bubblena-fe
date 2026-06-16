import { computed } from 'vue'
import { useState } from '#app'

/**
 * Granular cookie/storage consent.
 *
 * Necessary storage (login session, košík) is always on and not represented
 * here — it's exempt from consent because the user explicitly requested it.
 * The only opt-in category is `preferences`, which currently gates the
 * "naposledy prohlížené produkty" feature. Bump CONSENT_VERSION when the set
 * of purposes changes so users are asked to decide again.
 */
const STORAGE_KEY = 'bubblena-consent'
const CONSENT_VERSION = 1

export interface ConsentState {
  preferences: boolean
  version: number
  decidedAt: string | null
}

const defaultConsent = (): ConsentState => ({
  preferences: false,
  version: CONSENT_VERSION,
  decidedAt: null,
})

export const useConsent = () => {
  const consent = useState<ConsentState>('cookie-consent', defaultConsent)

  // Whether the user has made an explicit choice (drives banner visibility).
  const hasDecided = computed(() => consent.value.decidedAt !== null)
  const allowsPreferences = computed(() => consent.value.preferences)

  /** Hydrate from localStorage on the client (SSR can't read it). */
  const loadConsent = () => {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as ConsentState
      // Stored under an older purpose set → discard and re-ask.
      if (parsed.version === CONSENT_VERSION) consent.value = parsed
    } catch {
      /* malformed storage → keep defaults, banner will re-ask */
    }
  }

  const persist = () => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent.value))
    }
  }

  const acceptAll = () => {
    consent.value = {
      preferences: true,
      version: CONSENT_VERSION,
      decidedAt: new Date().toISOString(),
    }
    persist()
  }

  const rejectAll = () => {
    consent.value = {
      preferences: false,
      version: CONSENT_VERSION,
      decidedAt: new Date().toISOString(),
    }
    persist()
  }

  /**
   * Re-show the consent banner so the user can change their choice (GDPR:
   * withdrawal must be as easy as giving consent). Resets only in-memory —
   * if they don't pick anything and reload, the stored choice is restored.
   */
  const reopen = () => {
    consent.value = { ...consent.value, decidedAt: null }
  }

  return { consent, hasDecided, allowsPreferences, loadConsent, acceptAll, rejectAll, reopen }
}
