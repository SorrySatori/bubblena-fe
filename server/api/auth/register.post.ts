import nodemailer from 'nodemailer'
import { backendBase, backendHeaders, rethrowBackendError } from '../../utils/authProxy'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, firstName, lastName } = body || {}

  // Create the (unverified) user on the backend; it returns a verification token.
  let result: { email: string; verifyToken: string }
  try {
    result = await $fetch(`${backendBase()}/auth/register`, {
      method: 'POST',
      headers: backendHeaders(),
      body: { email, password, firstName, lastName },
    })
  } catch (error: any) {
    rethrowBackendError(error)
  }

  // Build the verification link against the current origin (works in dev + prod).
  const origin = getRequestURL(event).origin
  const verifyUrl = `${origin}/overeni?email=${encodeURIComponent(result.email)}&token=${result.verifyToken}`

  const transporter = nodemailer.createTransport({
    host: process.env.NUXT_SMTP_HOST,
    port: Number(process.env.NUXT_SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.NUXT_ORDERS_SMTP_USER,
      pass: process.env.NUXT_ORDERS_SMTP_PASS,
    },
  })

  const html = `
    <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
      <h2>Vítejte v Bubbleně 💫</h2>
      <p>Pro dokončení registrace prosím potvrďte svůj e-mail kliknutím na tlačítko:</p>
      <p style="margin:24px 0;">
        <a href="${verifyUrl}"
           style="background:#41b883;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
          Ověřit e-mail
        </a>
      </p>
      <p style="font-size:13px;opacity:0.8;">Pokud tlačítko nefunguje, otevřete tento odkaz:<br/>
        <a href="${verifyUrl}">${verifyUrl}</a></p>
      <p style="font-size:13px;opacity:0.8;">Odkaz je platný 24 hodin. Pokud jste se neregistrovali, e-mail ignorujte.</p>
      <hr style="margin:24px 0;"/>
      <p>Tým Bubblena.cz</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: process.env.NUXT_CONTACT_ORDERS,
      to: result.email,
      subject: 'Ověření e-mailu – Bubblena.cz',
      html,
    })
  } catch (err) {
    console.error('Verification email error:', err)
    throw createError({
      statusCode: 500,
      message: 'Účet byl vytvořen, ale ověřovací e-mail se nepodařilo odeslat. Zkuste to prosím znovu.',
    })
  }

  return { success: true, email: result.email }
})
