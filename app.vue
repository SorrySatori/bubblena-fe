<template>
  <NuxtLayout name="default">
    <NuxtPage />
    <CookieBanner />
  </NuxtLayout>
</template>

<script setup>
import { computed } from 'vue'

const SITE_URL = 'https://bubblena.cz'
const route = useRoute()

// Self-referencing canonical + og:url for every route, recomputed on
// navigation. Replaces the old hardcoded homepage canonical. Uses route.path
// (no query string) so paginated/filtered variants don't fragment indexing.
const canonical = computed(() => `${SITE_URL}${route.path === '/' ? '' : route.path}`)

useHead({
  link: [{ rel: 'canonical', href: () => canonical.value }],
})

useSeoMeta({
  ogUrl: () => canonical.value,
})

// Site-wide Organization + WebSite knowledge-graph signal (brand, logo,
// social profiles, contact). Rendered server-side on every page.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'OnlineStore',
            '@id': `${SITE_URL}/#organization`,
            name: 'Bubblena',
            url: SITE_URL,
            logo: `${SITE_URL}/og-image.png`,
            email: 'info@bubblena.cz',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Fráni Šrámka 5',
              postalCode: '70900',
              addressLocality: 'Ostrava',
              addressCountry: 'CZ',
            },
            sameAs: [
              'https://www.facebook.com/profile.php?id=61580744706557',
              'https://www.instagram.com/bubblena.cz/',
            ],
          },
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: SITE_URL,
            name: 'Bubblena',
            publisher: { '@id': `${SITE_URL}/#organization` },
            inLanguage: 'cs-CZ',
          },
        ],
      }),
    },
  ],
})
</script>
