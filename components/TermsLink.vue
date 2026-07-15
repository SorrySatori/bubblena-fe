<template>
  <span>
    <button
      type="button"
      @click="open = true"
      class="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent hover:underline transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Obchodní podmínky
    </button>

    <AppModal v-model="open" title="Obchodní podmínky">
      <TermsContent />
    </AppModal>
  </span>
</template>

<script setup>
import { ref } from 'vue'

// Opens the shared terms content in a modal (no navigation away from the page).
const open = ref(false)
</script>
