// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
  
  modules: ['@nuxtjs/sitemap', '@nuxt/image', 'nuxt-security'],

  site: {
    url: 'https://bubblena.cz',
  },

  // Security headers (nuxt-security). Third parties in use: Packeta widget,
  // GLS pickup-point map (iframe), Smartform address autocomplete, Google
  // Sign-In. Product media comes from Cloudinary / backend-provided URLs.
  // Our own rate limiting and HTML escaping live in server/utils, so the
  // module's generic rateLimiter / xssValidator are off to avoid double-handling.
  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'object-src': ["'none'"],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"],
        'script-src': [
          "'self'",
          "'nonce-{{nonce}}'",
          "'strict-dynamic'",
          'https://widget.packeta.com',
          'https://client.smartform.cz',
          'https://accounts.google.com',
        ],
        'style-src': ["'self'", "'unsafe-inline'", 'https://accounts.google.com', 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        'media-src': ["'self'", 'blob:', 'https:'],
        'connect-src': [
          "'self'",
          // Dev only: Nuxt DevTools + Vite HMR talk over local websockets.
          ...(process.env.NODE_ENV !== 'production'
            ? ['ws://localhost:*', 'http://localhost:*', 'https://api.iconify.design']
            : []),
          'https://accounts.google.com',
          'https://*.smartform.cz',
          'https://widget.packeta.com',
          'https://*.packeta.com',
        ],
        'frame-src': [
          'https://widget.packeta.com',
          'https://ps-maps.gls-czech.cz',
          'https://accounts.google.com',
        ],
        'worker-src': ["'self'", 'blob:'],
        'upgrade-insecure-requests': true,
      },
      // COEP would block cross-origin iframes/images without CORP headers.
      crossOriginEmbedderPolicy: false,
      // Google Sign-In opens a popup that must be able to talk back.
      crossOriginOpenerPolicy: 'same-origin-allow-popups',
      // Third-party widgets may need to know the embedding origin.
      referrerPolicy: 'strict-origin-when-cross-origin',
      strictTransportSecurity: { maxAge: 63072000, includeSubdomains: true, preload: false },
      xFrameOptions: 'DENY',
    },
    rateLimiter: false,
    xssValidator: false,
    // Vite 7 uses oxc; the esbuild-based console stripping only produces a warning.
    removeLoggers: false,
    corsHandler: false,
    requestSizeLimiter: { maxRequestSizeInBytes: 1_000_000, maxUploadFileRequestInBytes: 2_000_000 },
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
        // PNG favicon variants (apple-touch-icon, 32x32, 16x16) are not in /public yet;
        // add the files and the <link>s together, otherwise every page 404s twice.
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
    // Shared secret for server-to-server calls from bubblena-be (INTERNAL_TOKEN there).
    internalToken: process.env.NUXT_INTERNAL_TOKEN || '',
    basicUser: process.env.NUXT_BASIC_USER || '',
    basicPass: process.env.NUXT_BASIC_PASS || '',
    // Optional dedicated key for signing the gate cookie (falls back to a hash of the credentials).
    basicGateSecret: process.env.NUXT_BASIC_GATE_SECRET || '',
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
