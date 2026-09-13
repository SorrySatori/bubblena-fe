import { backendBase, backendHeaders, getSessionToken, rethrowBackendError } from '../../utils/authProxy'
import { verifyOrderAccess } from '../../utils/orderToken'

/**
 * GET /api/order/:orderId?t=<accessToken>
 *
 * Read access to ONE order for the confirmation page. Allowed when the caller
 * presents the order's access token (issued at creation / in the Stripe
 * success URL) or is logged in as the customer who placed it. Returns only
 * what the page needs – never the address, phone or e-mail.
 */
export default defineEventHandler(async (event) => {
  const orderId = getRouterParam(event, 'orderId') || ''
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) {
    throw createError({ statusCode: 400, message: 'Neplatné číslo objednávky.' })
  }

  const config = useRuntimeConfig()
  const token = getQuery(event).t
  let allowed = verifyOrderAccess(orderId, token, config.internalToken as string)
  const session = allowed ? null : getSessionToken(event)

  if (!allowed && !session) {
    throw createError({ statusCode: 403, message: 'K této objednávce nemáte přístup.' })
  }

  let order: any
  try {
    const res = await $fetch<{ order: any }>(`${backendBase()}/order/${encodeURIComponent(orderId)}`, {
      headers: backendHeaders(),
    })
    order = res?.order
  } catch (error: any) {
    rethrowBackendError(error)
  }
  if (!order) throw createError({ statusCode: 404, message: 'Objednávka nenalezena.' })

  if (!allowed && session) {
    try {
      const me = await $fetch<{ user: { email?: string } }>(`${backendBase()}/auth/me`, {
        headers: backendHeaders(session),
      })
      allowed = !!me?.user?.email && me.user.email.toLowerCase() === String(order.customerInfo?.email || '').toLowerCase()
    } catch {
      allowed = false
    }
  }
  if (!allowed) throw createError({ statusCode: 403, message: 'K této objednávce nemáte přístup.' })

  return {
    success: true,
    order: {
      orderId: order.orderId,
      status: order.status,
      paymentMethod: order.paymentMethod,
      shippingMethod: order.shippingMethod,
      totals: order.totals,
      createdAt: order.createdAt,
      paidAt: order.paidAt ?? null,
    },
  }
})
