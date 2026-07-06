import nodemailer from "nodemailer"

// Sends the customer a "your order has been shipped" e-mail.
// Triggered server-to-server by the backend when an order status becomes "shipped".
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const {
    orderId,
    customerInfo,
    items,
    totals,
    shippingMethod,
    selectedPickupPoint,
  } = body

  if (!orderId || !customerInfo?.email || !items || !totals) {
    throw createError({
      statusCode: 400,
      message: "Chybí požadovaná data objednávky.",
    })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.NUXT_SMTP_HOST,
    port: Number(process.env.NUXT_SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.NUXT_ORDERS_SMTP_USER,
      pass: process.env.NUXT_ORDERS_SMTP_PASS,
    },
  })

  const itemsHtml = items
    .map(
      (item: any) => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align:center;">${item.quantity}×</td>
        <td style="text-align:right;">${item.variant?.weight || item.weight} g</td>
        <td style="text-align:right;">${item.price} Kč</td>
      </tr>`
    )
    .join("")

  const shippingHtml = selectedPickupPoint
    ? `<p><b>Doručení:</b> ${shippingMethod} – ${selectedPickupPoint.name}, ${selectedPickupPoint.city}</p>`
    : `<p><b>Doručení:</b> ${shippingMethod || "—"}</p>`

  const customerName = `${customerInfo.firstName} ${customerInfo.lastName}`

  const htmlContent = `
    <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
      <h2>Vaše objednávka č. ${orderId} je na cestě 📦</h2>
      <p>Dobrý den, <b>${customerName}</b>,</p>
      <p>máme skvělou zprávu – vaši objednávku jsme právě předali dopravci a je na cestě k vám! 💫</p>

      <h3>Přehled objednávky:</h3>
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;">Produkt</th>
            <th style="text-align:center;">Množství</th>
            <th style="text-align:right;">Hmotnost</th>
            <th style="text-align:right;">Cena</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <h3>Souhrn:</h3>
      <p><b>Mezisoučet:</b> ${totals.subtotal} Kč</p>
      <p><b>Doprava:</b> ${totals.shipping} Kč</p>
      <p><b>Celkem:</b> ${totals.total} Kč</p>

      ${shippingHtml}

      <hr style="margin:24px 0;"/>
      <p><b>Děkujeme, že nakupujete u Bubbleny 💫</b></p>
      <p>S pozdravem,<br/>Tým Bubblena.cz</p>
    </div>
  `

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.NUXT_CONTACT_ORDERS,
    to: customerInfo.email,
    subject: `Objednávka č. ${orderId} je na cestě 📦 – Bubblena.cz`,
    html: htmlContent,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true, message: "Shipping notification sent successfully." }
  } catch (err: any) {
    console.error("Order shipped email error:", err)
    throw createError({
      statusCode: 500,
      message: "Nepodařilo se odeslat oznámení o odeslání objednávky.",
    })
  }
})
