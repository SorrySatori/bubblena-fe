<script setup>
// import { ref } from 'vue';
// import BubbleGenerator from '~/components/BubbleGenerator.vue';

</script>

<template>
  <div>
    <main>
      <div class="min-h-[80vh] pt-24 flex items-center justify-between px-[5%] bg-gradient-to-br from-[#f5f7fa] to-[#e4e8eb] relative overflow-hidden">
        <!-- <BubbleGenerator :max-bubbles="50" :mouse-move-throttle="150" /> -->
        <div class="max-w-xl z-10">
          <h1 class="text-5xl mb-4 text-secondary font-extrabold"><span class="text-primary font-bold">Bubblena</span></h1>
          <p class="text-2xl mb-8 text-dark opacity-80">Váš oblíbený e-shop s bombami do koupele</p>
          <div class="flex gap-4 mt-8">
            <NuxtLink to="/products" class="bg-primary text-white border-none py-3 px-6 rounded text-base font-semibold cursor-pointer transition-all hover:bg-accent hover:-translate-y-0.5 hover:shadow-lg">Prohlédnout produkty</NuxtLink>
            <a href="#" class="bg-transparent text-secondary border-2 border-secondary py-3 px-6 rounded text-base font-semibold cursor-pointer transition-all hover:bg-secondary hover:text-white hover:-translate-y-0.5 hover:shadow-lg inline-block">Dozvědět se více</a>
          </div>
        </div>
        <div class="relative w-2/5 h-full">
          <div class="absolute rounded-full bg-gradient-to-br from-primary to-accent opacity-70 w-[150px] h-[150px] top-[20%] right-[10%] animate-float"></div>
          <div class="absolute rounded-full bg-gradient-to-br from-primary to-accent opacity-70 w-[100px] h-[100px] top-[50%] right-[30%] animate-float animation-delay-2000"></div>
          <div class="absolute rounded-full bg-gradient-to-br from-primary to-accent opacity-70 w-[80px] h-[80px] top-[70%] right-[15%] animate-float animation-delay-4000"></div>
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
    </main>
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
