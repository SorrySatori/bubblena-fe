import nodemailer from "nodemailer"
import type { SendMailOptions } from "nodemailer"
import { assertRateLimit } from "../utils/rateLimit"
import { cleanStr, esc, escMultiline, EMAIL_RE } from "../utils/html"

export default defineEventHandler(async (event) => {
  // 5 messages per 10 minutes per IP – enough for humans, useless for spam.
  assertRateLimit(event, { name: "contact", limit: 5, windowMs: 10 * 60 * 1000 })

  const body = await readBody(event)
  const name = cleanStr(body?.name, 100)
  const email = cleanStr(body?.email, 254)
  const subject = cleanStr(body?.subject, 150)
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 5000) : ""

  if (!name || !email || !subject || !message) {
    throw createError({ statusCode: 400, message: "Vyplňte prosím všechna pole." })
  }
  if (!EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, message: "Zadejte platný e-mail." })
  }

  const receiver = process.env.NUXT_CONTACT_RECEIVER
  if (!receiver) {
    console.error("NUXT_CONTACT_RECEIVER není nastaven")
    throw createError({ statusCode: 500, message: "Failed to send email" })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.NUXT_SMTP_HOST,
    port: Number(process.env.NUXT_SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.NUXT_SMTP_USER,
      pass: process.env.NUXT_SMTP_PASS
    }
  })

  // Internal copy: fixed sender, visitor reachable via Reply-To, all fields escaped.
  const mailOptions: SendMailOptions = {
    from: receiver,
    to: receiver,
    replyTo: { name, address: email },
    subject: `Zpráva z webu: ${subject}`,
    text: `Jméno: ${name}\nEmail: ${email}\nPředmět: ${subject}\n\n${message}`,
    html: `
      <p><b>Jméno:</b> ${esc(name)}</p>
      <p><b>Email:</b> ${esc(email)}</p>
      <p><b>Předmět:</b> ${esc(subject)}</p>
      <p><b>Zpráva:</b><br/>${escMultiline(message)}</p>
    `
  }

  // Visitor copy: fixed subject so the endpoint can't be used to send
  // arbitrary-looking mail from our domain.
  const confirmationMailOptions: SendMailOptions = {
    from: receiver,
    to: email,
    subject: "Potvrzení přijetí zprávy – Bubblena.cz",
    html: `
      <p><b>Děkujeme za zprávu, ozveme se vám co nejdříve.</b></p>
      <p><b>Pěně zdar, vaše Bubblena.</b></p>
      <hr/>
      <p><b>Text vaší zprávy:</b></p>
      <p><b>Předmět:</b> ${esc(subject)}</p>
      <p>${escMultiline(message)}</p>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    await transporter.sendMail(confirmationMailOptions)
    return { success: true, message: "Email sent successfully" }
  } catch (err: any) {
    console.error("Email send error:", err)
    throw createError({
      statusCode: 500,
      message: "Failed to send email"
    })
  }
})
