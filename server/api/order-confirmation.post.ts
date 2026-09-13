import { requireInternalToken } from "../utils/internalAuth"
import { createInvoice, markInvoiceAsPaid, downloadInvoicePdf } from "../utils/fakturoid"
import {
  fetchOrder,
  ordersTransport,
  customerName,
  renderItemsTable,
  renderShipping,
  renderTotals,
  renderContact,
} from "../utils/orderMail"
import { esc, czk } from "../utils/html"

/**
 * Order confirmation: Fakturoid invoice + e-mails (shop owner, customer,
 * invoice PDF). Called server-to-server by bubblena-be:
 *   - bank transfer: right after the order is created
 *   - card: from the Stripe webhook once the payment is captured
 * Body: { orderId }. All data comes from the backend, never from the caller.
 */
export default defineEventHandler(async (event) => {
  requireInternalToken(event)

  const body = await readBody(event)
  const order = await fetchOrder(body?.orderId)
  const config = useRuntimeConfig()

  const isBankTransfer = order.paymentMethod === "bank-transfer"
  const isPaid = order.status === "paid"
  const orderId = esc(order.orderId)

  // --- Fakturoid -----------------------------------------------------------
  let invoicePdfBuffer: Buffer | null = null
  let invoiceNumber: string | null = null
  let invoiceError: string | null = null
  try {
    const invoice = await createInvoice(
      order.customerInfo,
      order.orderId,
      order.items,
      order.totals,
      order.discount || undefined
    )
    invoiceNumber = invoice.number
    // Only a payment verified by the Stripe webhook may mark the invoice paid.
    if (isPaid) {
      await markInvoiceAsPaid(invoice.id)
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
    invoicePdfBuffer = await downloadInvoicePdf(invoice.id)
  } catch (err: any) {
    invoiceError =
      err?.data?.errors ? JSON.stringify(err.data.errors)
      : err?.statusCode ? `${err.statusCode} ${err?.statusMessage || ''}`.trim()
      : err?.message || String(err)
    console.error("Fakturoid invoice error:", invoiceError, err)
  }

  // --- Bank transfer details (from config, not from the request) -----------
  const bank = {
    recipient: (config.public.bankRecipient as string) || "Bubblena.cz",
    accountNumber: (config.public.bankAccountNumber as string) || "",
    bankCode: (config.public.bankCode as string) || "",
    iban: (config.public.bankIban as string) || "",
    bic: (config.public.bankBic as string) || "",
  }
  const formattedBankAccount = bank.accountNumber
    ? `${bank.accountNumber}${bank.bankCode ? `/${bank.bankCode}` : ""}`
    : ""

  const bankTransferHtml = isBankTransfer
    ? `
      <h3>Platební údaje:</h3>
      <p>Objednávku prosím uhraďte bankovním převodem.</p>
      <p><b>Příjemce:</b> ${esc(bank.recipient)}</p>
      ${formattedBankAccount ? `<p><b>Číslo účtu:</b> ${esc(formattedBankAccount)}</p>` : ""}
      ${bank.iban ? `<p><b>IBAN:</b> ${esc(bank.iban)}</p>` : ""}
      ${bank.bic ? `<p><b>BIC/SWIFT:</b> ${esc(bank.bic)}</p>` : ""}
      <p><b>Částka:</b> ${czk(order.totals.total)}</p>
      <p><b>Zpráva pro příjemce:</b> Objednávka ${orderId}</p>
    `
    : ""

  // --- E-mail bodies -------------------------------------------------------
  const htmlContent = `
    <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
      <h2>Potvrzení objednávky č. ${orderId}</h2>
      <p>Dobrý den, <b>${customerName(order)}</b>,</p>
      <p>děkujeme za vaši objednávku! Níže naleznete její přehled:</p>

      <h3>Položky objednávky:</h3>
      ${renderItemsTable(order)}

      <h3>Souhrn:</h3>
      ${renderTotals(order)}

      ${bankTransferHtml}

      ${renderShipping(order)}

      <h3>Kontaktní údaje:</h3>
      ${renderContact(order)}
      ${order.orderNotes ? `<h3>Poznámka k objednávce:</h3><p>${esc(order.orderNotes)}</p>` : ""}

      <hr style="margin:24px 0;"/>
      <p><b>Děkujeme, že nakupujete u Bubbleny 💫</b></p>
      <p>S pozdravem,<br/>Tým Bubblena.cz</p>
    </div>
  `

  const invoiceStatusHtml = invoiceError
    ? `<div style="background:#fdecea;border:1px solid #f5c6cb;color:#a12622;padding:12px;border-radius:6px;">
         <b>⚠️ Faktura se NEVYGENEROVALA</b><br/>
         Objednávka <b>${orderId}</b> proběhla, ale Fakturoid vrátil chybu – fakturu je potřeba vystavit ručně.<br/>
         <small>${esc(invoiceError)}</small>
       </div>`
    : `<div style="background:#e7f5ea;border:1px solid #b6dfc0;color:#1d6b35;padding:12px;border-radius:6px;">
         ✅ Faktura <b>${esc(invoiceNumber)}</b> vygenerována${invoicePdfBuffer ? " a přiložena v PDF" : " (PDF se zatím nestáhlo)"}.
       </div>`

  const paymentStatusHtml = isBankTransfer
    ? `<p><b>Platba:</b> bankovní převod – čeká na úhradu.</p>`
    : isPaid
      ? `<p><b>Platba:</b> kartou – zaplaceno (Stripe).</p>`
      : `<p><b>Platba:</b> kartou – <b>zatím nepotvrzeno</b>.</p>`

  const prettyJson = `<pre style="background:#f4f4f4;padding:12px;border-radius:6px;font-size:13px;line-height:1.4;">${esc(
    JSON.stringify(order, null, 2)
  )}</pre>`

  const attachments = invoicePdfBuffer
    ? [{
        filename: `faktura-${invoiceNumber || order.orderId}.pdf`,
        content: invoicePdfBuffer,
        contentType: "application/pdf",
      }]
    : undefined

  const transporter = ordersTransport()
  const from = process.env.NUXT_CONTACT_ORDERS

  const ownerMail = {
    from,
    to: process.env.NUXT_CONTACT_ORDERS,
    subject: `${invoiceError ? "⚠️ FAKTURA SELHALA – " : "🧼 "}Nová objednávka č. ${order.orderId}`,
    html: `
      ${invoiceStatusHtml}
      ${paymentStatusHtml}
      ${htmlContent}
      <hr/>
      <h3>📦 Kompletní data objednávky (JSON):</h3>
      ${prettyJson}
    `,
    attachments,
  }

  const customerMail = {
    from,
    to: order.customerInfo.email,
    subject: `Potvrzení objednávky č. ${order.orderId} – Bubblena.cz`,
    html: htmlContent,
  }

  const invoiceMail = invoicePdfBuffer
    ? {
        from,
        to: order.customerInfo.email,
        subject: `Faktura k objednávce č. ${order.orderId} – Bubblena.cz`,
        html: `
          <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
            <p>Dobrý den, <b>${customerName(order)}</b>,</p>
            ${isBankTransfer
              ? `<p>fakturu k objednávce <b>${orderId}</b> najdete v příloze. Objednávku prosím uhraďte dle platebních údajů uvedených v potvrzení objednávky.</p>`
              : `<p>děkujeme za zaplacení objednávky. Fakturu k objednávce <b>${orderId}</b> najdete v příloze.</p>`}
            <p>Jakmile bude vaše objednávka na cestě, dáme vám vědět.</p>
            <hr style="margin:24px 0;"/>
            <p>S pozdravem,<br/>Tým Bubblena.cz</p>
          </div>
        `,
        attachments,
      }
    : null

  try {
    await transporter.sendMail(ownerMail)
    await transporter.sendMail(customerMail)
    if (invoiceMail) {
      await transporter.sendMail(invoiceMail)
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
