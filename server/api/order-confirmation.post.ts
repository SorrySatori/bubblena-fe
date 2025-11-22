import nodemailer from "nodemailer"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const {
    orderId,
    customerInfo,
    items,
    totals,
    shippingMethod,
    paymentMethod,
    selectedPickupPoint,
  } = body

  if (!orderId || !customerInfo || !items || !totals) {
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

  // 🧾 Přehled položek
  const itemsHtml = items
    .map(
      (item: any) => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align:center;">${item.quantity}×</td>
        <td style="text-align:right;">${item.variant} g</td>
        <td style="text-align:right;">${item.price} Kč</td>
      </tr>`
    )
    .join("")

  const shippingHtml = selectedPickupPoint
    ? `<p><b>Doručení:</b> ${shippingMethod} – ${selectedPickupPoint.name}, ${selectedPickupPoint.city}</p>`
    : `<p><b>Doručení:</b> ${shippingMethod}</p>`

  const customerName = `${customerInfo.firstName} ${customerInfo.lastName}`

  // 🧠 Formátovaný JSON pro interní e-mail
  const prettyJson = `<pre style="background:#f4f4f4;padding:12px;border-radius:6px;font-size:13px;line-height:1.4;">${JSON.stringify(
    body,
    null,
    2
  )}</pre>`

  const htmlContent = `
    <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
      <h2>Potvrzení objednávky č. ${orderId}</h2>
      <p>Dobrý den, <b>${customerName}</b>,</p>
      <p>děkujeme za vaši objednávku! Níže naleznete její přehled:</p>

      <h3>Položky objednávky:</h3>
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;">Produkt</th>
            <th style="text-align:center;">Množství</th>
            <th style="text-align:right;">Cena</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <h3>Souhrn:</h3>
      <p><b>Mezisoučet:</b> ${totals.subtotal} Kč</p>
      <p><b>Doprava:</b> ${totals.shipping} Kč</p>
      <p><b>Platba:</b> ${paymentMethod}</p>
      <p><b>Celkem:</b> ${totals.total} Kč</p>

      ${shippingHtml}

      <h3>Kontaktní údaje:</h3>
      <p>
        ${customerName}<br/>
        ${customerInfo.email}<br/>
        Tel: ${customerInfo.phone}<br/>
        ${customerInfo.address.street}, ${customerInfo.address.city}, ${customerInfo.address.postalCode}
      </p>

      <hr style="margin:24px 0;"/>
      <p><b>Děkujeme, že nakupujete u Bubbleny 💫</b></p>
      <p>S pozdravem,<br/>Tým Bubblena.cz</p>
    </div>
  `

  // 💌 E-mail pro tebe (s JSONem navíc)
  const mailOptions = {
    from: process.env.NUXT_CONTACT_ORDERS,
    to: process.env.NUXT_CONTACT_ORDERS, // interní kopie objednávky
    subject: `🧼 Nová objednávka č. ${orderId}`,
    html: `
      ${htmlContent}
      <hr/>
      <h3>📦 Kompletní data objednávky (JSON):</h3>
      ${prettyJson}
    `,
  }

  // 💌 E-mail pro zákazníka
  const confirmationMailOptions = {
    from: process.env.NUXT_CONTACT_ORDERS,
    to: customerInfo.email,
    subject: `Potvrzení objednávky č. ${orderId} – Bubblena.cz`,
    html: htmlContent,
  }

  try {
    await transporter.sendMail(mailOptions)
    await transporter.sendMail(confirmationMailOptions)
    return { success: true, message: "Order confirmation sent successfully." }
  } catch (err: any) {
    console.error("Order confirmation email error:", err)
    throw createError({
      statusCode: 500,
      message: "Nepodařilo se odeslat potvrzení objednávky.",
    })
  }
})
