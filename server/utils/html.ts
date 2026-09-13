/** Escape a value for safe interpolation into HTML (e-mail templates). */
export const esc = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  )

/** Escape and turn newlines into <br/> for multi-line user text. */
export const escMultiline = (value: unknown): string => esc(value).replace(/\r?\n/g, '<br/>')

/** Trim, cap length and strip CR/LF (header injection) from a user-supplied string. */
export const cleanStr = (value: unknown, max = 200): string =>
  typeof value === 'string' ? value.replace(/[\r\n]+/g, ' ').trim().slice(0, max) : ''

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Format a CZK amount for e-mails; never interpolates raw client values. */
export const czk = (value: unknown): string => {
  const n = Number(value)
  return `${(Number.isFinite(n) ? n : 0).toFixed(2)} Kč`
}
