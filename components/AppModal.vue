<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="modelValue"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div class="absolute inset-0 bg-black/50" @click="close"></div>
          <div class="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 class="text-xl font-bold text-secondary">
                <slot name="title">{{ title }}</slot>
              </h2>
              <button
                type="button"
                @click="close"
                aria-label="Zavřít"
                class="text-gray-400 hover:text-gray-700 text-3xl leading-none focus:outline-none"
              >×</button>
            </div>
            <div class="overflow-y-auto px-6 py-5">
              <slot />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const close = () => emit('update:modelValue', false)

const onKey = (e) => {
  if (e.key === 'Escape') close()
}

// Lock body scroll + wire ESC while the modal is open.
watch(
  () => props.modelValue,
  (open) => {
    if (!import.meta.client) return
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) document.addEventListener('keydown', onKey)
    else document.removeEventListener('keydown', onKey)
  }
)

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
