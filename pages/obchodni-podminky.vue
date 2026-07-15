<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-4xl font-bold text-secondary mb-8">Obchodní podmínky</h1>

      <div class="bg-white rounded-lg shadow-md p-8">
        <TermsContent />
      </div>

      <div class="mt-8 text-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zpět na hlavní stránku
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Content lives in the shared <TermsContent /> component (also used by the
// terms modal on product detail pages).
useHead({
  title: 'Obchodní podmínky - Bubblena',
  meta: [
    {
      name: 'description',
      content: 'Obchodní podmínky a zásady ochrany osobních údajů (GDPR) e-shopu Bubblena.'
    }
  ]
});
</script>
