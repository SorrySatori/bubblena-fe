import nodemailer from "nodemailer"
import {
  createSubject,
  createInvoice,
  markInvoiceAsPaid,
  downloadInvoicePdf,
} from "../utils/fakturoid"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const {
    orderId,
    customerInfo,
    items,
    totals,
    discount,
    shippingMethod,
    paymentMethod,
    selectedPickupPoint,
    bankTransferPayment,
  } = body

  if (!orderId || !customerInfo || !items || !totals) {
    throw createError({
      statusCode: 400,
      message: "Chybí požadovaná data objednávky.",
    })
  }

  let invoicePdfBuffer: Buffer | null = null
  let invoiceNumber: string | null = null
  try {
    const subject = await createSubject(customerInfo)
    const invoice = await createInvoice(subject.id, orderId, items, totals, discount)
    invoiceNumber = invoice.number
    if (paymentMethod === 'card') {
      await markInvoiceAsPaid(invoice.id)
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
    invoicePdfBuffer = await downloadInvoicePdf(invoice.id)
  } catch (err) {
    console.error("Fakturoid invoice error:", err)
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
    : `<p><b>Doručení:</b> ${shippingMethod}</p>`

  const discountHtml = discount?.totalDiscount && discount.totalDiscount > 0
    ? `<p><b>Sleva:</b> -${discount.totalDiscount} Kč</p>`
    : ''

  const paymentMethodLabel = paymentMethod === 'bank-transfer'
    ? 'Bankovní převod'
    : paymentMethod === 'card'
      ? 'Platební karta'
      : paymentMethod

  const formattedBankAccount = bankTransferPayment?.accountNumber
    ? `${bankTransferPayment.accountNumber}${bankTransferPayment.bankCode ? `/${bankTransferPayment.bankCode}` : ''}`
    : ''

  const bankTransferHtml = paymentMethod === 'bank-transfer' && bankTransferPayment
    ? `
      <h3>Platební údaje:</h3>
      <p>Objednávku prosím uhraďte bankovním převodem.</p>
      <p><b>Příjemce:</b> ${bankTransferPayment.recipient || 'Bubblena.cz'}</p>
      ${formattedBankAccount ? `<p><b>Číslo účtu:</b> ${formattedBankAccount}</p>` : ''}
      ${bankTransferPayment.iban ? `<p><b>IBAN:</b> ${bankTransferPayment.iban}</p>` : ''}
      ${bankTransferPayment.bic ? `<p><b>BIC/SWIFT:</b> ${bankTransferPayment.bic}</p>` : ''}
      <p><b>Částka:</b> ${Number(bankTransferPayment.amount || totals.total).toFixed(2)} Kč</p>
      <p><b>Zpráva pro příjemce:</b> ${bankTransferPayment.message || `Objednávka ${orderId}`}</p>
    `
    : ''

  const customerName = `${customerInfo.firstName} ${customerInfo.lastName}`

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
            <th style="text-align:right;">Hmotnost</th>
            <th style="text-align:right;">Cena</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <h3>Souhrn:</h3>
      <p><b>Mezisoučet:</b> ${totals.subtotal} Kč</p>
      <p><b>Doprava:</b> ${totals.shipping} Kč</p>
      ${discountHtml}
      <p><b>Platba:</b> ${paymentMethodLabel}</p>
      <p><b>Celkem:</b> ${totals.total} Kč</p>

      ${bankTransferHtml}

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

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.NUXT_CONTACT_ORDERS,
    to: process.env.NUXT_CONTACT_ORDERS,
    subject: `🧼 Nová objednávka č. ${orderId}`,
    html: `
      ${htmlContent}
      <hr/>
      <h3>📦 Kompletní data objednávky (JSON):</h3>
      ${prettyJson}
    `,
    ...(invoicePdfBuffer
      ? {
          attachments: [
            {
              filename: `faktura-${invoiceNumber || orderId}.pdf`,
              content: invoicePdfBuffer,
              contentType: "application/pdf",
            },
          ],
        }
      : {}),
  }

  const confirmationMailOptions: nodemailer.SendMailOptions = {
    from: process.env.NUXT_CONTACT_ORDERS,
    to: customerInfo.email,
    subject: `Potvrzení objednávky č. ${orderId} – Bubblena.cz`,
    html: htmlContent,
  }

  const invoiceMailOptions: nodemailer.SendMailOptions | null = invoicePdfBuffer
    ? {
        from: process.env.NUXT_CONTACT_ORDERS,
        to: customerInfo.email,
        subject: `Faktura k objednávce č. ${orderId} – Bubblena.cz`,
        html: `
          <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
            <p>Dobrý den, <b>${customerName}</b>,</p>
            ${paymentMethod === 'bank-transfer'
              ? `<p>fakturu k objednávce <b>${orderId}</b> najdete v příloze. Objednávku prosím uhraďte dle platebních údajů uvedených v potvrzení objednávky.</p>`
              : `<p>děkujeme za zaplacení objednávky. Fakturu k objednávce <b>${orderId}</b> najdete v příloze.</p>`}
            <p>Jakmile bude vaše objednávka na cestě, dáme vám vědět.</p>
            <hr style="margin:24px 0;"/>
            <p>S pozdravem,<br/>Tým Bubblena.cz</p>
          </div>
        `,
        attachments: [
          {
            filename: `faktura-${invoiceNumber || orderId}.pdf`,
            content: invoicePdfBuffer,
            contentType: "application/pdf",
          },
        ],
      }
    : null

  try {
    await transporter.sendMail(mailOptions)
    await transporter.sendMail(confirmationMailOptions)
    if (invoiceMailOptions) {
      await transporter.sendMail(invoiceMailOptions)
    }
    return { success: true, message: "Order confirmation sent successfully." }
  } catch (err: any) {
    console.error("Order confirmation email error:", err)
    throw createError({
      statusCode: 500,
      message: "Nepodařilo se odeslat potvrzení objednávky.",
    })
  }
})
