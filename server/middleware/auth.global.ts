import crypto from 'node:crypto'
import { defineEventHandler, getCookie, setCookie, createError, type H3Event } from 'h3'
import { hasValidInternalToken } from '../utils/internalAuth'

/**
 * Visitor gate for the pre-launch site (HTTP Basic auth).
 *
 * After a successful login we set a cookie of the form `<expiresAtMs>.<hmac>`
 * signed with a server secret, so it cannot be forged (the previous fixed
 * `auth=ok` value could be set by anyone). Remove this middleware when the
 * site goes public; the internal token check for bubblena-be stays valid.
 */
const COOKIE = 'auth'
const TTL_MS = 60 * 60 * 24 * 1000 // 1 den

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb)
}

/** Signing key: dedicated secret, or derived from the gate credentials. */
function gateKey(config: ReturnType<typeof useRuntimeConfig>): string {
  const explicit = config.basicGateSecret as string
  if (explicit) return explicit
  return crypto
    .createHash('sha256')
    .update(`${config.basicUser}:${config.basicPass}:gate`)
    .digest('hex')
}

function sign(key: string, value: string): string {
  return crypto.createHmac('sha256', key).update(value).digest('hex')
}

function challenge(event: H3Event, message: string): never {
  setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="Restricted Area"')
  throw createError({ statusCode: 401, statusMessage: message })
}

export default defineEventHandler((event) => {
  // Server-to-server calls from bubblena-be carry the shared internal token.
  if (hasValidInternalToken(event)) return

  const config = useRuntimeConfig()
  const basicUser = config.basicUser as string
  const basicPass = config.basicPass as string

  // Fail closed: an unconfigured gate must not become an open door.
  if (!basicUser || !basicPass) {
    throw createError({ statusCode: 503, statusMessage: 'Gate not configured' })
  }

  const key = gateKey(config)

  // 1) Signed session cookie
  const session = getCookie(event, COOKIE)
  if (session) {
    const [exp, mac] = session.split('.')
    if (exp && mac && Number(exp) > Date.now() && safeEqual(mac, sign(key, exp))) {
      return
    }
  }

  // 2) Basic auth
  const header = getHeader(event, 'authorization') || ''
  const [scheme, encoded] = header.split(' ')
  if (!header) challenge(event, 'Auth Required')
  if (scheme !== 'Basic' || !encoded) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Auth Scheme' })
  }

  let decoded = ''
  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8')
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Auth Header' })
  }
  const sep = decoded.indexOf(':')
  const user = sep === -1 ? decoded : decoded.slice(0, sep)
  const pass = sep === -1 ? '' : decoded.slice(sep + 1)

  if (!(safeEqual(user, basicUser) && safeEqual(pass, basicPass))) {
    challenge(event, 'Invalid Credentials')
  }

  const exp = String(Date.now() + TTL_MS)
  setCookie(event, COOKIE, `${exp}.${sign(key, exp)}`, {
    httpOnly: true,
    sameSite: 'strict',
    secure: !import.meta.dev,
    path: '/',
    maxAge: TTL_MS / 1000,
  })
})
