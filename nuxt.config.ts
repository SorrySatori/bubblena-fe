// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
  
  modules: ['@nuxtjs/sitemap'],
  
  site: {
    url: 'https://bubblena.cz',
  },
  
  sitemap: {
    exclude: [
      '/checkout',
      '/order-confirmation'
    ],
    urls: async () => {
      const urls: any[] = []
      
      return urls
    }
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
        { name: 'description', content: 'Bubblena je tajemný svět ukrytý za pěnou – neviditelný lidskému oku, ale pokaždé, když si napustíš vanu a vhodíš bombu, můžeš do něj na chvíli nahlédnout. ' },
        { name: 'keywords', content: 'šumivé bomby do vany, koupelnová kosmetika, šumivé koule do koupele, bomby do koupele, shower steamery' },
        { name: 'author', content: 'Bubblena' },
        { name: 'robots', content: 'index, follow' },
        { name: 'language', content: 'Czech' },
        { name: 'revisit-after', content: '7 days' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://bubblena.cz' },
        { property: 'og:title', content: 'Bubblena - Váš oblíbený e-shop s bombami do koupele' },
        { property: 'og:description', content: 'Bubblena je tajemný svět ukrytý za pěnou – neviditelný lidskému oku, ale pokaždé, když si napustíš vanu a vhodíš bombu, můžeš do něj na chvíli nahlédnout. ' },
        { property: 'og:image', content: 'https://www.bubblena.cz/_nuxt/bubblena_logo_header.CiffOvXT.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:site_name', content: 'Bubblena' },
        { property: 'og:locale', content: 'cs_CZ' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://bubblena.cz' },
        { name: 'twitter:title', content: 'Bubblena - Váš oblíbený e-shop s bombami do koupele' },
        { name: 'twitter:description', content: 'Bubblena je tajemný svět ukrytý za pěnou – neviditelný lidskému oku, ale pokaždé, když si napustíš vanu a vhodíš bombu, můžeš do něj na chvíli nahlédnout. ' },
        { name: 'twitter:image', content: 'https://www.bubblena.cz/_nuxt/bubblena_logo_header.CiffOvXT.png' },
        
        // Additional SEO
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://bubblena.cz' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      script: [
        {
          type: 'text/javascript',
          innerHTML: `var smartform = smartform || {}; smartform.beforeInit = function() { smartform.setClientId('${process.env.NUXT_PUBLIC_SMARTFORM_CLIENT_ID || ''}'); };`
        },
        { src: 'https://client.smartform.cz/v2/smartform.js', type: 'text/javascript', async: true }
      ]
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
      bankRecipient: process.env.NUXT_PUBLIC_BANK_RECIPIENT || 'Bubblena.cz',
      bankAccountNumber: process.env.NUXT_PUBLIC_BANK_ACCOUNT_NUMBER || '',
      bankCode: process.env.NUXT_PUBLIC_BANK_CODE || '',
      bankIban: process.env.NUXT_PUBLIC_BANK_IBAN || '',
      bankBic: process.env.NUXT_PUBLIC_BANK_BIC || ''
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
