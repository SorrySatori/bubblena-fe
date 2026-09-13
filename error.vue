<template>
  <NuxtLayout name="default">
    <section class="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-primary/10 min-h-[70vh] flex items-center">
      <!-- Ambient bubbles (decorative only) -->
      <div class="bubbles pointer-events-none absolute inset-0" aria-hidden="true">
        <span v-for="n in 9" :key="n" class="bubble" :style="bubbleStyle(n)"></span>
      </div>

      <div class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p class="text-sm uppercase tracking-[0.25em] text-primary font-semibold mb-4">
          {{ isNotFound ? 'Chyba 404' : `Chyba ${error?.statusCode || 500}` }}
        </p>

        <h1 class="text-4xl md:text-6xl font-extrabold text-secondary leading-tight mb-6">
          {{ copy.title }}
        </h1>

        <p class="text-lg md:text-xl text-gray-600 max-w-xl mx-auto mb-10">
          {{ copy.text }}
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button
            type="button"
            @click="goHome"
            class="bg-primary text-white py-3 px-6 rounded-lg hover:bg-accent transition-colors font-medium"
          >
            Zpět na hladinu
          </button>
          <button
            type="button"
            @click="goShop"
            class="border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-white transition-colors font-medium"
          >
            Prohlédnout bomby do koupele
          </button>
        </div>

        <p v-if="!isNotFound" class="mt-10 text-xs text-gray-400">
          Pokud to nepřejde, napište nám přes <NuxtLink to="/contact" class="underline hover:text-primary">kontakt</NuxtLink>.
        </p>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  error: { type: Object, default: null },
})

const isNotFound = computed(() => Number(props.error?.statusCode) === 404)

// Bath-bomb humour, rotated on the client so SSR markup stays deterministic.
const NOT_FOUND = [
  {
    title: 'Tady nám nic nebublá.',
    text: 'Prohledali jsme celou vanu, i pod pěnou. Stránka, kterou hledáte, tu prostě není.',
  },
  {
    title: 'Tahle stránka zřejmě někam odplavala.',
    text: 'Zkontrolujte adresu, nebo se nechte odnést zpátky na hladinu. Tam je toho k prozkoumání víc.',
  },
]

const SERVER_ERROR = {
  title: 'Něco nám prasklo. Ne bomba, jen server.',
  text: 'Už na tom pracujeme. Zkuste to prosím za chvilku znovu, mezitím si klidně napusťte vanu.',
}

const variant = ref(0)
onMounted(() => {
  if (isNotFound.value) variant.value = Math.floor(Math.random() * NOT_FOUND.length)
})

const copy = computed(() => (isNotFound.value ? NOT_FOUND[variant.value] : SERVER_ERROR))

const goHome = () => clearError({ redirect: '/' })
const goShop = () => clearError({ redirect: '/bath-bombs' })

useSeoMeta({
  title: () => (isNotFound.value ? 'Stránka nenalezena' : 'Něco se pokazilo'),
  robots: 'noindex, nofollow',
})

// Deterministic pseudo-random placement (same on server and client).
const bubbleStyle = (n) => {
  const left = (n * 37) % 100
  const size = 28 + ((n * 53) % 70)
  const delay = ((n * 7) % 10) * -1
  const duration = 14 + ((n * 11) % 10)
  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  }
}
</script>

<style scoped>
.bubble {
  position: absolute;
  bottom: -120px;
  border-radius: 9999px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(65, 184, 131, 0.25) 60%, rgba(65, 184, 131, 0.05));
  box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(65, 184, 131, 0.15);
  animation-name: rise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0;
}

@keyframes rise {
  0% {
    transform: translateY(0) translateX(0) scale(0.8);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  50% {
    transform: translateY(-45vh) translateX(18px) scale(1);
  }
  100% {
    transform: translateY(-95vh) translateX(-12px) scale(1.1);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bubble {
    animation: none;
    opacity: 0.35;
    bottom: auto;
    top: 20%;
  }
}
</style>
