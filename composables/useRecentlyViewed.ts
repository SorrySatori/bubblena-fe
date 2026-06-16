import { useState } from '#app'
import { useConsent } from './useConsent'

/**
 * "Naposledy prohlížené produkty" — a comfort feature persisted in
 * localStorage. Strictly opt-in: nothing is stored unless the user accepted
 * the `preferences` consent category. Rejecting clears any prior data.
 */
const STORAGE_KEY = 'bubblena-recently-viewed'
const MAX_ITEMS = 8

export interface RecentlyViewedItem {
  id: string
  name: string
  to: string
  imageUrl?: string
  price?: number
}

export const useRecentlyViewed = () => {
  const { allowsPreferences } = useConsent()
  const items = useState<RecentlyViewedItem[]>('recently-viewed', () => [])

  /** Hydrate from localStorage on the client, honoring consent. */
  const load = () => {
    if (!import.meta.client) return
    if (!allowsPreferences.value) {
      items.value = []
      return
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      items.value = raw ? (JSON.parse(raw) as RecentlyViewedItem[]) : []
    } catch {
      items.value = []
    }
  }

  const trackView = (item: RecentlyViewedItem) => {
    if (!import.meta.client) return
    if (!allowsPreferences.value) return // no consent → never persist
    if (!item?.id) return
    const next = [item, ...items.value.filter((i) => i.id !== item.id)].slice(0, MAX_ITEMS)
    items.value = next
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage full or disabled — keep in-memory list only */
    }
  }

  /** Forget everything (used when the user rejects preferences). */
  const clear = () => {
    items.value = []
    if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
  }

  return { items, trackView, load, clear }
}
