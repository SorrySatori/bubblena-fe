<template>
  <span>
    <button
      type="button"
      @click.stop.prevent="open = true"
      class="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent hover:underline transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
      Průvodce velikostmi
    </button>

    <AppModal v-model="open" title="Průvodce velikostmi">
      <p class="mb-5 rounded-lg border-l-4 border-primary bg-primary/5 px-4 py-3 text-sm leading-relaxed text-gray-700">
        Naše bomby vyrábíme <strong>ručně</strong>, nikoliv strojově — uvedené hmotnosti jsou proto
        orientační a mohou se o pár gramů lišit. Fotky ukazují jednotlivé velikosti v dlani pro
        lepší představu.
      </p>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <figure v-for="w in shownWeights" :key="w" class="text-center">
          <div class="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <NuxtImg
              :src="`/size-guide/${w}.jpg`"
              :alt="`Bomba do koupele ${w} g v dlani`"
              width="320"
              height="320"
              sizes="220px"
              format="webp"
              loading="lazy"
              class="h-full w-full object-cover"
            />
          </div>
          <figcaption class="mt-2 text-sm font-medium text-secondary">{{ w }} g</figcaption>
        </figure>
      </div>
    </AppModal>
  </span>
</template>

<script setup>
import { computed, ref } from 'vue'

// Weights come from the current product's variants; falls back to the standard
// set. Photos are shared across all bombs (same physical sizes) and live in
// /public/size-guide/<weight>g.jpg.
const props = defineProps({
  weights: { type: Array, default: () => [] },
})

const STANDARD_WEIGHTS = [40, 70, 110, 115, 140, 180]
const shownWeights = computed(() => (props.weights.length ? props.weights : STANDARD_WEIGHTS))

const open = ref(false)
</script>
