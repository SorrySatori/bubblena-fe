const FAKTUROID_API_BASE = 'https://app.fakturoid.cz/api/v3'

interface FakturoidTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface FakturoidSubject {
  id: number
  name: string
  email: string
  [key: string]: any
}

interface FakturoidInvoice {
  id: number
  number: string
  pdf_url: string
  [key: string]: any
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const clientId = process.env.NUXT_FAKTUROID_CLIENT_ID
  const clientSecret = process.env.NUXT_FAKTUROID_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Fakturoid credentials not configured')
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await $fetch<FakturoidTokenResponse>(`${FAKTUROID_API_BASE}/oauth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': process.env.NUXT_FAKTUROID_USER_AGENT || 'Bubblena (info@bubblena.cz)',
    },
    body: {
      grant_type: 'client_credentials',
    },
  })

  cachedToken = {
    token: response.access_token,
    expiresAt: Date.now() + (response.expires_in - 60) * 1000,
  }

  return cachedToken.token
}

function getHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': process.env.NUXT_FAKTUROID_USER_AGENT || 'Bubblena (info@bubblena.cz)',
  }
}

function getSlug() {
  return process.env.NUXT_FAKTUROID_SLUG || 'hedvikaantosova'
}

async function searchSubjectByEmail(email: string): Promise<FakturoidSubject | null> {
  const token = await getAccessToken()
  const slug = getSlug()

  const subjects = await $fetch<FakturoidSubject[]>(
    `${FAKTUROID_API_BASE}/accounts/${slug}/subjects/search.json`,
    {
      method: 'GET',
      headers: getHeaders(token),
      params: { query: email },
    }
  )

  if (subjects && subjects.length > 0) {
    return subjects.find(s => s.email === email) || subjects[0]
  }
  return null
}

export async function createSubject(customerInfo: {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: { street: string; city: string; postalCode: string; country?: string }
}): Promise<FakturoidSubject> {
  // Try to find an existing subject with this email first
  const existing = await searchSubjectByEmail(customerInfo.email)
  if (existing) {
    return existing
  }

  const token = await getAccessToken()
  const slug = getSlug()

  const subject = await $fetch<FakturoidSubject>(
    `${FAKTUROID_API_BASE}/accounts/${slug}/subjects.json`,
    {
      method: 'POST',
      headers: getHeaders(token),
      body: {
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        email: customerInfo.email,
        phone: customerInfo.phone,
        street: customerInfo.address.street,
        city: customerInfo.address.city,
        zip: customerInfo.address.postalCode,
        country: customerInfo.address.country || 'CZ',
      },
    }
  )

  return subject
}

export async function createInvoice(
  subjectId: number,
  orderId: string,
  items: Array<{ name: string; price: number; quantity: number; variant?: { weight?: number }; weight?: number }>,
  totals: { shipping: number; paymentSurcharge?: number },
  discount?: { totalDiscount?: number }
): Promise<FakturoidInvoice> {
  const token = await getAccessToken()
  const slug = getSlug()

  const lines = items.map((item) => ({
    name: `${item.name}`,
    quantity: item.quantity,
    unit_name: 'ks',
    unit_price: item.price,
    vat_rate: 0,
  }))

  if (totals.shipping > 0) {
    lines.push({
      name: 'Doprava',
      quantity: 1,
      unit_name: '',
      unit_price: totals.shipping,
      vat_rate: 0,
    })
  }

  if (totals.paymentSurcharge && totals.paymentSurcharge > 0) {
    lines.push({
      name: 'Příplatek za platbu',
      quantity: 1,
      unit_name: '',
      unit_price: totals.paymentSurcharge,
      vat_rate: 0,
    })
  }

  if (discount?.totalDiscount && discount.totalDiscount > 0) {
    lines.push({
      name: 'Sleva',
      quantity: 1,
      unit_name: '',
      unit_price: -discount.totalDiscount,
      vat_rate: 0,
    })
  }

  const invoice = await $fetch<FakturoidInvoice>(
    `${FAKTUROID_API_BASE}/accounts/${slug}/invoices.json`,
    {
      method: 'POST',
      headers: getHeaders(token),
      body: {
        subject_id: subjectId,
        order_number: orderId,
        payment_method: 'bank',
        currency: 'CZK',
        language: 'cz',
        lines,
      },
    }
  )

  return invoice
}

export async function markInvoiceAsPaid(invoiceId: number): Promise<void> {
  const token = await getAccessToken()
  const slug = getSlug()

  await $fetch(
    `${FAKTUROID_API_BASE}/accounts/${slug}/invoices/${invoiceId}/payments.json`,
    {
      method: 'POST',
      headers: getHeaders(token),
      body: {
        paid_on: new Date().toISOString().split('T')[0],
        send_thank_you_email: false,
      },
    }
  )
}

export async function downloadInvoicePdf(invoiceId: number, maxRetries = 5): Promise<Buffer> {
  const token = await getAccessToken()
  const slug = getSlug()

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(
      `${FAKTUROID_API_BASE}/accounts/${slug}/invoices/${invoiceId}/download.pdf`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': process.env.NUXT_FAKTUROID_USER_AGENT || 'Bubblena (info@bubblena.cz)',
        },
      }
    )

    if (response.status === 200) {
      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    }

    if (response.status === 204) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      continue
    }

    throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`)
  }

  throw new Error('PDF not ready after maximum retries')
}
