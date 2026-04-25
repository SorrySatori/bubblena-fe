import {
  createSubject,
  createInvoice,
  markInvoiceAsPaid,
  downloadInvoicePdf,
} from "../utils/fakturoid"

export default defineEventHandler(async () => {
  const results: Record<string, { success: boolean; data?: any; error?: string }> = {}

  // Step 0: Check env vars
  const envVars = {
    NUXT_FAKTUROID_CLIENT_ID: !!process.env.NUXT_FAKTUROID_CLIENT_ID,
    NUXT_FAKTUROID_CLIENT_SECRET: !!process.env.NUXT_FAKTUROID_CLIENT_SECRET,
    NUXT_FAKTUROID_SLUG: process.env.NUXT_FAKTUROID_SLUG || '(not set, will use default)',
    NUXT_FAKTUROID_USER_AGENT: process.env.NUXT_FAKTUROID_USER_AGENT || '(not set, will use default)',
  }
  results['0_env_check'] = { success: true, data: envVars }

  if (!process.env.NUXT_FAKTUROID_CLIENT_ID || !process.env.NUXT_FAKTUROID_CLIENT_SECRET) {
    results['0_env_check'] = { success: false, error: 'Missing NUXT_FAKTUROID_CLIENT_ID or NUXT_FAKTUROID_CLIENT_SECRET' }
    return { results }
  }

  // Step 1: Find or create subject (now searches first, creates only if needed)
  let subjectId: number | null = null
  try {
    const subject = await createSubject({
      firstName: 'Test',
      lastName: 'Bubblena',
      email: 'test@bubblena.cz',
      phone: '+420000000000',
      address: {
        street: 'Testovací 123',
        city: 'Praha',
        postalCode: '10000',
        country: 'CZ',
      },
    })
    subjectId = subject.id
    results['1_find_or_create_subject'] = { success: true, data: { id: subject.id, name: subject.name, email: subject.email } }
  } catch (err: any) {
    results['1_find_or_create_subject'] = {
      success: false,
      error: err?.message || String(err),
      data: {
        statusCode: err?.statusCode || err?.response?.status,
        responseBody: err?.data || err?.response?._data,
      },
    }
    return { results }
  }

  // Step 2: Create Invoice
  let invoiceId: number | null = null
  let invoiceNumber: string | null = null
  try {
    const invoice = await createInvoice(
      subjectId!,
      'TEST-' + Date.now(),
      [
        { name: 'Test Bath Bomb', price: 99, quantity: 1, variant: { weight: 150 } },
      ],
      { shipping: 79, paymentSurcharge: 0 }
    )
    invoiceId = invoice.id
    invoiceNumber = invoice.number
    results['2_create_invoice'] = {
      success: true,
      data: { id: invoice.id, number: invoice.number, pdf_url: invoice.pdf_url },
    }
  } catch (err: any) {
    results['2_create_invoice'] = {
      success: false,
      error: err?.message || String(err),
      data: {
        statusCode: err?.statusCode || err?.response?.status,
        responseBody: err?.data || err?.response?._data,
      },
    }
    return { results }
  }

  // Step 3: Mark invoice as paid
  try {
    await markInvoiceAsPaid(invoiceId!)
    results['3_mark_paid'] = { success: true }
  } catch (err: any) {
    results['3_mark_paid'] = {
      success: false,
      error: err?.message || String(err),
      data: {
        statusCode: err?.statusCode || err?.response?.status,
        responseBody: err?.data || err?.response?._data,
      },
    }
    return { results }
  }

  // Step 4: Download PDF
  try {
    const pdf = await downloadInvoicePdf(invoiceId!)
    results['4_download_pdf'] = {
      success: true,
      data: { pdfSizeBytes: pdf.length },
    }
  } catch (err: any) {
    results['4_download_pdf'] = {
      success: false,
      error: err?.message || String(err),
      data: {
        statusCode: err?.statusCode || err?.response?.status,
        responseBody: err?.data || err?.response?._data,
      },
    }
  }

  return { results }
})
