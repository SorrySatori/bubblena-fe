import { requireInternalToken } from "../utils/internalAuth"
import {
  fetchOrder,
  ordersTransport,
  customerName,
  renderItemsTable,
  renderShipping,
  renderTotals,
} from "../utils/orderMail"
import { esc } from "../utils/html"

// Sends the customer a "your order has been shipped" e-mail.
// Called server-to-server by bubblena-be when an order status becomes "shipped".
// Body: { orderId } – everything else is loaded from the backend.
export default defineEventHandler(async (event) => {
  requireInternalToken(event)

  const body = await readBody(event)
  const order = await fetchOrder(body?.orderId)

  if (!order.customerInfo?.email) {
    throw createError({ statusCode: 400, message: "Objednávka nemá e-mail zákazníka." })
  }

  const orderId = esc(order.orderId)
  const htmlContent = `
    <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6;">
      <h2>Vaše objednávka č. ${orderId} je na cestě 📦</h2>
      <p>Dobrý den, <b>${customerName(order)}</b>,</p>
      <p>máme skvělou zprávu – vaši objednávku jsme právě předali dopravci a je na cestě k vám! 💫</p>

      <h3>Přehled objednávky:</h3>
      ${renderItemsTable(order)}

      <h3>Souhrn:</h3>
      ${renderTotals(order)}

      ${renderShipping(order)}

      <hr style="margin:24px 0;"/>
      <p><b>Děkujeme, že nakupujete u Bubbleny 💫</b></p>
      <p>S pozdravem,<br/>Tým Bubblena.cz</p>
    </div>
  `

  try {
    await ordersTransport().sendMail({
      from: process.env.NUXT_CONTACT_ORDERS,
      to: order.customerInfo.email,
      subject: `Objednávka č. ${order.orderId} je na cestě 📦 – Bubblena.cz`,
      html: htmlContent,
    })
    return { success: true, message: "Shipping notification sent successfully." }
  } catch (err: any) {
    console.error("Order shipped email error:", err)
    throw createError({
      statusCode: 500,
      message: "Nepodařilo se odeslat oznámení o odeslání objednávky.",
    })
  }
})
