import { defineEventHandler, getCookie, setCookie, createError } from 'h3'
import { hasValidInternalToken } from '../utils/internalAuth'

export default defineEventHandler((event) => {
  // Server-to-server calls from bubblena-be carry the shared internal token
  // and must not be blocked by the visitor gate.
  if (hasValidInternalToken(event)) {
    return
  }

  const session = getCookie(event, 'auth')
  if (session === 'ok') {
    return
  }
  const config = useRuntimeConfig()

  const auth = event.node.req.headers['authorization']
  if (!auth) {
    event.node.res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"')
    throw createError({ statusCode: 401, statusMessage: 'Auth Required' })
  }

  const [scheme, encoded] = auth.split(' ')
  if (scheme !== 'Basic' || !encoded) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Auth Scheme' })
  }

  const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':')

  if (user === config.basicUser && pass === config.basicPass) {
    setCookie(event, 'auth', 'ok', {
      httpOnly: true,
      sameSite: 'strict',
      secure: !import.meta.dev,
      path: '/',
      maxAge: 60 * 60 * 24 // 1 den
    })
    return
  }

  event.node.res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"')
  throw createError({ statusCode: 401, statusMessage: 'Invalid Credentials' })
})
