<template>
  <section
    v-if="ready && items.length"
    class="py-16 px-[5%] bg-light"
  >
    <h2 class="text-3xl md:text-4xl mb-10 text-secondary text-center">
      Naposledy prohlížené
    </h2>

    <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        :to="item.to"
        class="group bg-white rounded-lg shadow-md overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="aspect-square overflow-hidden bg-light">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.name"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div class="p-4">
          <h3 class="text-base font-semibold text-secondary line-clamp-2">{{ item.name }}</h3>
          <p v-if="item.price != null" class="mt-2 text-primary font-bold">
            {{ item.price.toFixed(2) }} Kč
          </p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRecentlyViewed } from '~/composables/useRecentlyViewed'

const { items } = useRecentlyViewed()

// localStorage is client-only; render after mount to match SSR (empty) markup.
const ready = ref(false)
onMounted(() => {
  ready.value = true
})
</script>
