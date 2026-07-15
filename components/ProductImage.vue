<template>
  <div class="pi">
    <div v-if="!loaded" class="pi-skeleton" aria-hidden="true">
      <div class="pi-skeleton-ball"></div>
    </div>
    <img
      ref="imgEl"
      :src="src"
      :alt="alt"
      loading="lazy"
      decoding="async"
      class="pi-img"
      :class="{ 'pi-loaded': loaded }"
      @load="loaded = true"
      @error="loaded = true"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Product thumbnail with a shimmer skeleton shown until the (often high-res)
// image has fully loaded, then a smooth fade-in. Fills its (relative) parent.
defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
})

const imgEl = ref(null)
const loaded = ref(false)

onMounted(() => {
  // If the image was already cached and finished before hydration attached the
  // @load listener, that event never fires — reveal it immediately instead.
  if (imgEl.value?.complete && imgEl.value.naturalWidth > 0) loaded.value = true
})
</script>

<style scoped>
.pi {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.pi-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.5s ease;
}

.pi-img.pi-loaded {
  opacity: 1;
}

.pi:hover .pi-img.pi-loaded {
  transform: scale(1.05);
}

/* Just a centered "ball" placeholder on the card's own background. */
.pi-skeleton {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pi-skeleton-ball {
  height: 62%;
  aspect-ratio: 1 / 1;
  border-radius: 9999px;
  background: #e1e5ea;
  border: 1px solid #cfd5dc;
  animation: pi-pulse 1.6s ease-in-out infinite;
}

/* Dark-mode ball so it doesn't flash bright in the dark theme. */
html.dark .pi-skeleton-ball {
  background: #364150;
  border-color: #47546680;
}

@keyframes pi-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
