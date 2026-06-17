<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-semibold text-secondary">Moje objednávky</h1>
      <NuxtLink to="/ucet" class="text-primary hover:underline text-sm">← Zpět na účet</NuxtLink>
    </div>
    <OrderHistory />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({ title: 'Moje objednávky', robots: 'noindex, follow' })
</script>
