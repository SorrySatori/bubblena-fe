import { describe, it, expect } from 'vitest'
import { esc, escMultiline, cleanStr, czk, EMAIL_RE } from '../server/utils/html'

describe('e-mail HTML helpers', () => {
  it('escapes every HTML-significant character', () => {
    expect(esc(`<img src=x onerror="alert('1')"> & co`)).toBe(
      '&lt;img src=x onerror=&quot;alert(&#39;1&#39;)&quot;&gt; &amp; co'
    )
  })
  it('handles null/undefined and numbers', () => {
    expect(esc(null)).toBe('')
    expect(esc(undefined)).toBe('')
    expect(esc(42)).toBe('42')
  })
  it('turns newlines into <br/> after escaping', () => {
    expect(escMultiline('a<b\r\nc')).toBe('a&lt;b<br/>c')
  })
  it('cleanStr strips header-injection newlines and caps length', () => {
    expect(cleanStr('Subject\r\nBcc: x@y.z', 100)).toBe('Subject Bcc: x@y.z')
    expect(cleanStr('x'.repeat(300), 10)).toHaveLength(10)
    expect(cleanStr(123)).toBe('')
  })
  it('formats CZK amounts defensively', () => {
    expect(czk(199.9)).toBe('199.90 Kč')
    expect(czk('abc')).toBe('0.00 Kč')
  })
  it('EMAIL_RE accepts plain addresses and rejects junk', () => {
    expect(EMAIL_RE.test('jan.novak@example.cz')).toBe(true)
    expect(EMAIL_RE.test('not an email')).toBe(false)
  })
})
