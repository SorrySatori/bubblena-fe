// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
  
  modules: ['@nuxtjs/sitemap', '@nuxt/image'],

  site: {
    url: 'https://bubblena.cz',
  },

  // Local images (e.g. the homepage hero) are optimized via IPX. Remote
  // product images come from arbitrary backend URLs, so they stay as plain
  // <img>; add their host(s) to `domains` here to optimize them too.
  image: {
    format: ['avif', 'webp'],
  },

  sitemap: {
    exclude: [
      '/checkout',
      '/order-confirmation',
      '/ucet',
      '/ucet/objednavky',
      '/prihlaseni',
      '/registrace',
      '/overeni'
    ],
    // Dynamic product/steamer/damaged-product URLs are supplied by a Nitro
    // route that runs with full server context (see server/api/__sitemap__).
    sources: ['/api/__sitemap__/urls'],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'cs'
      },
      title: 'Šumivé bomby do vany a další koupelnová kosmetika',
      titleTemplate: '%s | Bubblena',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        
        // Primary Meta Tags
        { name: 'title', content: 'Bubblena - Váš oblíbený e-shop s bombami do koupele' },
        { name: 'description', content: 'Bubblena je tajemný svět ukrytý za pěnou – neviditelný lidskému oku, ale pokaždé, když si napustíš vanu a vhodíš bombu, můžeš do něj na chvíli nahlédnout.' },
        { name: 'author', content: 'Bubblena' },
        { name: 'robots', content: 'index, follow' },

        // Open Graph / Facebook — defaults; per-page og:url/title/description/image
        // are set per route (see app.vue + individual pages).
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Bubblena - Váš oblíbený e-shop s bombami do koupele' },
        { property: 'og:description', content: 'Bubblena je tajemný svět ukrytý za pěnou – neviditelný lidskému oku, ale pokaždé, když si napustíš vanu a vhodíš bombu, můžeš do něj na chvíli nahlédnout.' },
        // TODO: replace /og-image.png with a real 1200×630 social card (currently the logo as a placeholder).
        { property: 'og:image', content: 'https://bubblena.cz/og-image.png' },
        { property: 'og:image:alt', content: 'Bubblena – bomby do koupele' },
        { property: 'og:site_name', content: 'Bubblena' },
        { property: 'og:locale', content: 'cs_CZ' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Bubblena - Váš oblíbený e-shop s bombami do koupele' },
        { name: 'twitter:description', content: 'Bubblena je tajemný svět ukrytý za pěnou – neviditelný lidskému oku, ale pokaždé, když si napustíš vanu a vhodíš bombu, můžeš do něj na chvíli nahlédnout.' },
        { name: 'twitter:image', content: 'https://bubblena.cz/og-image.png' },

        // Additional SEO
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // No global canonical here — it would make every page a duplicate of the
        // homepage. A per-route self-canonical is set in app.vue.
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
      // Smartform (našeptávač adres) se načítá jen na stránkách, kde je
      // potřeba (checkout, účet) – viz composables/useSmartform.ts.
    }
  },
  // API configuration
  nitro: {
    compressPublicAssets: true,
  },
  // Runtime config for API base URL
  runtimeConfig: {
    apiKey: process.env.NUXT_API_KEY || '',
    basicUser: process.env.NUXT_BASIC_USER || '',
    basicPass: process.env.NUXT_BASIC_PASS || '',
    fakturoidSlug: process.env.NUXT_FAKTUROID_SLUG || '',
    fakturoidClientId: process.env.NUXT_FAKTUROID_CLIENT_ID || '',
    fakturoidClientSecret: process.env.NUXT_FAKTUROID_CLIENT_SECRET || '',
    fakturoidUserAgent: process.env.NUXT_FAKTUROID_USER_AGENT || '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
      apiKey: process.env.NUXT_PUBLIC_API_KEY || '',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      bankRecipient: process.env.NUXT_PUBLIC_BANK_RECIPIENT || 'Bubblena.cz',
      bankAccountNumber: process.env.NUXT_PUBLIC_BANK_ACCOUNT_NUMBER || '',
      bankCode: process.env.NUXT_PUBLIC_BANK_CODE || '',
      bankIban: process.env.NUXT_PUBLIC_BANK_IBAN || '',
      bankBic: process.env.NUXT_PUBLIC_BANK_BIC || '',
      smartformClientId: process.env.NUXT_PUBLIC_SMARTFORM_CLIENT_ID || ''
    }
  },
  // CSS configuration
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
})
