import nodemailer from "nodemailer"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, subject, message } = body

  if (!name || !email || !subject || !message) {
    throw createError({
      statusCode: 400,
      message: "Missing required fields"
    })
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

  const mailOptions = {
    from: process.env.NUXT_CONTACT_RECEIVER,
    to: process.env.NUXT_CONTACT_RECEIVER, // email, na který mají chodit zprávy
    subject: subject,
    text: message,
    html: `
      <p><b>Jméno:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Předmět:</b> ${subject}</p>
      <p><b>Zpráva:</b><br/>${message}</p>
    `
  }

  const confirmationMailOptions = {
    from: process.env.NUXT_CONTACT_RECEIVER,
    to: email,
    subject: subject,
    html: `
      <p><b>Děkujeme za zprávu, ozveme se vám co nejdříve.</b></p>
      <p><b>Pěně zdar, vaše Bubblena.</b></p>
      <hr/>
      <p><b>Text vaší zprávy:</b></p>
      <p><b>Zpráva:</b><br/>${message}</p>
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
