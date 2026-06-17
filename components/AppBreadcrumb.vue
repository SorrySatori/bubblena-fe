<template>
  <nav aria-label="Drobečková navigace" class="text-sm text-gray-500 mb-6">
    <ol class="flex flex-wrap items-center gap-2">
      <li v-for="(item, i) in items" :key="i" class="flex items-center gap-2">
        <NuxtLink
          v-if="i < items.length - 1"
          :to="item.to"
          class="hover:text-primary hover:underline transition-colors"
        >{{ item.name }}</NuxtLink>
        <span v-else aria-current="page" class="text-secondary font-medium">{{ item.name }}</span>
        <span v-if="i < items.length - 1" aria-hidden="true" class="text-gray-300">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

// items: [{ name: string, to: string }] — ordered from Home to current page.
const props = defineProps({
  items: { type: Array, required: true },
})

const SITE_URL = 'https://bubblena.cz'

// Emit BreadcrumbList structured data for rich-result breadcrumbs in SERPs.
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: props.items.map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: it.name,
            item: `${SITE_URL}${it.to}`,
          })),
        })
      ),
    },
  ],
})
</script>
