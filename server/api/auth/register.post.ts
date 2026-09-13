import nodemailer from 'nodemailer'
import { backendBase, backendHeaders, rethrowBackendError } from '../../utils/authProxy'
import { assertRateLimit } from '../../utils/rateLimit'
import { esc } from '../../utils/html'

export default defineEventHandler(async (event) => {
  assertRateLimit(event, { name: 'register', limit: 5, windowMs: 60 * 60 * 1000 })

  const body = await readBody(event)
  const { email, password, firstName, lastName, acceptTerms, marketing } = body || {}

  // Backend answers 200 for every case; `kind` tells us which e-mail to send.
  // The browser always gets the same success response (no account enumeration).
  let result: { email: string; verifyToken: string | null; kind: 'verify' | 'exists' | 'google' }
  try {
    result = await $fetch(`${backendBase()}/auth/register`, {
      method: 'POST',
      headers: backendHeaders(),
      body: { email, password, firstName, lastName, acceptTerms, marketing },
    })
  } catch (error: any) {
    rethrowBackendError(error)
  }

  const origin = getRequestURL(event).origin
  const transporter = nodemailer.createTransport({
    host: process.env.NUXT_SMTP_HOST,
    port: Number(process.env.NUXT_SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.NUXT_ORDERS_SMTP_USER,
      pass: process.env.NUXT_ORDERS_SMTP_PASS,
    },
  })

  let subject: string
  let html: string

  if (result.kind === 'verify' && result.verifyToken) {
    const verifyUrl = `${origin}/overeni?email=${encodeURIComponent(result.email)}&token=${encodeURIComponent(result.verifyToken)}`
    const safeUrl = esc(verifyUrl)
    subject = 'Ověření e-mailu – Bubblena.cz'
    html = `
    <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
      <h2>Vítejte v Bubbleně 💫</h2>
      <p>Pro dokončení registrace prosím potvrďte svůj e-mail kliknutím na tlačítko:</p>
      <p style="margin:24px 0;">
        <a href="${safeUrl}"
           style="background:#41b883;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
          Ověřit e-mail
        </a>
      </p>
      <p style="font-size:13px;opacity:0.8;">Pokud tlačítko nefunguje, otevřete tento odkaz:<br/>
        <a href="${safeUrl}">${safeUrl}</a></p>
      <p style="font-size:13px;opacity:0.8;">Odkaz je platný 24 hodin. Pokud jste se neregistrovali, e-mail ignorujte.</p>
      <hr style="margin:24px 0;"/>
      <p>Tým Bubblena.cz</p>
    </div>
  `
  } else {
    const loginUrl = esc(`${origin}/prihlaseni`)
    const hint = result.kind === 'google'
      ? 'Účet s tímto e-mailem je registrovaný přes Google. Přihlaste se tlačítkem „Pokračovat přes Google“.'
      : 'Účet s tímto e-mailem už existuje. Stačí se přihlásit.'
    subject = 'Registrace – účet už existuje – Bubblena.cz'
    html = `
    <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
      <h2>Někdo se pokusil zaregistrovat s vaším e-mailem</h2>
      <p>${hint}</p>
      <p style="margin:24px 0;">
        <a href="${loginUrl}"
           style="background:#41b883;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
          Přihlásit se
        </a>
      </p>
      <p style="font-size:13px;opacity:0.8;">Pokud jste to nebyli vy, nemusíte nic dělat – váš účet se nezměnil.</p>
      <hr style="margin:24px 0;"/>
      <p>Tým Bubblena.cz</p>
    </div>
  `
  }

  try {
    await transporter.sendMail({
      from: process.env.NUXT_CONTACT_ORDERS,
      to: result.email,
      subject,
      html,
    })
  } catch (err) {
    console.error('Registration email error:', err)
    throw createError({
      statusCode: 500,
      message: 'Ověřovací e-mail se nepodařilo odeslat. Zkuste to prosím znovu.',
    })
  }

  return { success: true, email: result.email }
})
