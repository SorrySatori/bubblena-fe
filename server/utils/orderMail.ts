import nodemailer from 'nodemailer'
import { backendBase, backendHeaders } from './authProxy'
import { esc, czk } from './html'

/** Order shape as returned by bubblena-be GET /api/order/:orderId. */
export interface BackendOrder {
  orderId: string
  status: string
  paymentMethod: string
  shippingMethod: string
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: { street: string; city: string; postalCode: string; country?: string }
  }
  items: Array<{ name: string; price: number; quantity: number; variant?: { weight?: number }; imageUrl?: string }>
  totals: { subtotal: number; shipping: number; paymentSurcharge: number; total: number }
  discount?: { code?: string; totalDiscount?: number } | null
  selectedPickupPoint?: { name?: string; city?: string } | null
  orderNotes?: string
}

/** Loads the order from the backend (source of truth) instead of trusting a request body. */
export async function fetchOrder(orderId: string): Promise<BackendOrder> {
  if (typeof orderId !== 'string' || !/^[0-9a-f-]{36}$/i.test(orderId)) {
    throw createError({ statusCode: 400, message: 'Neplatné číslo objednávky.' })
  }
  const res = await $fetch<{ success: boolean; order: BackendOrder }>(
    `${backendBase()}/order/${encodeURIComponent(orderId)}`,
    { headers: backendHeaders() }
  )
  if (!res?.order) throw createError({ statusCode: 404, message: 'Objednávka nenalezena.' })
  return res.order
}

/** SMTP transport for order-related mail (objednavky@). */
export function ordersTransport() {
  return nodemailer.createTransport({
    host: process.env.NUXT_SMTP_HOST,
    port: Number(process.env.NUXT_SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.NUXT_ORDERS_SMTP_USER,
      pass: process.env.NUXT_ORDERS_SMTP_PASS,
    },
  })
}

export const SHIPPING_LABELS: Record<string, string> = {
  zasilkovna: 'Zásilkovna',
  gls: 'GLS',
}

export const PAYMENT_LABELS: Record<string, string> = {
  card: 'Platební karta',
  'bank-transfer': 'Bankovní převod',
}

export function customerName(order: BackendOrder): string {
  return esc(`${order.customerInfo.firstName} ${order.customerInfo.lastName}`)
}

export function renderItemsTable(order: BackendOrder): string {
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td>${esc(item.name)}</td>
        <td style="text-align:center;">${Number(item.quantity) || 0}×</td>
        <td style="text-align:right;">${item.variant?.weight ? `${Number(item.variant.weight)} g` : '—'}</td>
        <td style="text-align:right;">${czk(item.price)}</td>
      </tr>`
    )
    .join('')

  return `
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;">Produkt</th>
            <th style="text-align:center;">Množství</th>
            <th style="text-align:right;">Hmotnost</th>
            <th style="text-align:right;">Cena</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`
}

export function renderShipping(order: BackendOrder): string {
  const method = esc(SHIPPING_LABELS[order.shippingMethod] || order.shippingMethod || '—')
  const point = order.selectedPickupPoint
  return point?.name
    ? `<p><b>Doručení:</b> ${method} – ${esc(point.name)}${point.city ? `, ${esc(point.city)}` : ''}</p>`
    : `<p><b>Doručení:</b> ${method}</p>`
}

export function renderTotals(order: BackendOrder): string {
  const discount = order.discount?.totalDiscount || 0
  return `
      <p><b>Mezisoučet:</b> ${czk(order.totals.subtotal)}</p>
      <p><b>Doprava:</b> ${czk(order.totals.shipping)}</p>
      ${discount > 0 ? `<p><b>Sleva${order.discount?.code ? ` (${esc(order.discount.code)})` : ''}:</b> -${czk(discount)}</p>` : ''}
      <p><b>Platba:</b> ${esc(PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod)}</p>
      <p><b>Celkem:</b> ${czk(order.totals.total)}</p>`
}

export function renderContact(order: BackendOrder): string {
  const c = order.customerInfo
  return `
      <p>
        ${customerName(order)}<br/>
        ${esc(c.email)}<br/>
        Tel: ${esc(c.phone)}<br/>
        ${esc(c.address.street)}, ${esc(c.address.city)}, ${esc(c.address.postalCode)}
      </p>`
}
