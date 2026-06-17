<script setup>
useSeoMeta({
  title: 'Šumivé bomby do koupele a koupelnová kosmetika',
  description: 'Ručně vyráběné šumivé bomby do koupele a shower steamery z přírodních ingrediencí, bez testů na zvířatech. Objevte svět Bubblena.',
})
</script>

<template>
  <div>
      <div class="relative w-full h-[85vh] overflow-hidden">
        <div class="absolute inset-0">
          <NuxtImg src="/bombs.png" alt="Barevné bomby do koupele Bubblena" width="1600" height="900" sizes="100vw" format="avif,webp" preload fetchpriority="high" class="w-full h-full object-cover" :style="{ objectPosition: 'center 30%' }" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
        </div>

        <div class="relative h-full flex items-center px-[5%] pt-20">
          <div class="max-w-2xl">
            <h1 class="text-6xl md:text-7xl mb-6 text-white font-extrabold drop-shadow-2xl">
              <span class="text-primary font-bold">Bubblena</span> — bomby do koupele
            </h1>
            <p class="text-3xl md:text-4xl mb-8 text-white font-medium drop-shadow-lg">Váš oblíbený e-shop s šumivými bombami a koupelnovou kosmetikou</p>
            <div class="flex flex-wrap gap-4 mt-10">
              <NuxtLink to="/bath-bombs" class="bg-primary text-white border-none py-4 px-8 rounded-full text-lg font-bold cursor-pointer transition-all hover:bg-accent hover:scale-105 hover:shadow-2xl">Prohlédnout produkty</NuxtLink>
              <NuxtLink to="/steamers" class="bg-white/90 text-secondary border-none py-4 px-8 rounded-full text-lg font-bold cursor-pointer transition-all hover:bg-white hover:scale-105 hover:shadow-2xl">Shower steamery</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="py-20 px-[5%] text-center bg-white">
        <h2 class="text-4xl mb-12 text-secondary relative after:content-[''] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-primary after:rounded-md">Naše přednosti</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div class="bg-light rounded-lg p-8 transition-all hover:-translate-y-2.5 hover:shadow-xl shadow-md">
            <div class="text-5xl mb-4">🛁</div>
            <h3 class="text-2xl mb-4 text-secondary">Přírodní ingredience</h3>
            <p class="text-dark opacity-80">Všechny naše produkty jsou vyrobeny z přírodních surovin</p>
          </div>
          <div class="bg-light rounded-lg p-8 transition-all hover:-translate-y-2.5 hover:shadow-xl shadow-md">
            <div class="text-5xl mb-4">🌿</div>
            <h3 class="text-2xl mb-4 text-secondary">Bez testů na zvířatech</h3>
            <p class="text-dark opacity-80">Jsme hrdí na etický přístup k výrobě kosmetiky</p>
          </div>
          <div class="bg-light rounded-lg p-8 transition-all hover:-translate-y-2.5 hover:shadow-xl shadow-md">
            <div class="text-5xl mb-4">🎁</div>
            <h3 class="text-2xl mb-4 text-secondary">Ideální dárek</h3>
            <p class="text-dark opacity-80">Naše bomby do koupele potěší každého milovníka relaxace</p>
          </div>
        </div>
      </div>
  </div>
</template>

<style>
/* Custom animation delays that aren't in Tailwind by default */
.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Add a subtle pulse animation to the interaction tip */
/* @keyframes subtle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.interaction-tip {
  animation: subtle-pulse 2s infinite ease-in-out;
} */
</style>
