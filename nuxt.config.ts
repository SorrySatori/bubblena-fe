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
      title: 'Bubblena',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { key: 'description', name: 'description', content: 'Bubblena Frontend Application' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
      apiKey: process.env.NUXT_PUBLIC_API_KEY || ''
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
