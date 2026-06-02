<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-semibold text-secondary">Moje objednávky</h1>
      <NuxtLink to="/ucet" class="text-primary hover:underline text-sm">← Zpět na účet</NuxtLink>
    </div>

    <div v-if="pending" class="text-gray-500">Načítám objednávky…</div>
    <div v-else-if="error" class="text-red-600">Nepodařilo se načíst objednávky.</div>
    <div v-else-if="!orders.length" class="text-gray-600">
      Zatím nemáte žádné objednávky.
      <NuxtLink to="/bath-bombs" class="text-primary hover:underline">Začněte nakupovat →</NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.orderId"
        class="border border-gray-200 rounded-lg p-4">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <p class="font-medium text-secondary">Objednávka č. {{ order.orderId }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="text-right">
            <span class="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {{ statusLabel(order.status) }}
            </span>
            <p class="font-semibold text-secondary mt-1">{{ order.totals?.total }} Kč</p>
          </div>
        </div>

        <ul class="text-sm text-gray-700 mb-3 divide-y divide-gray-100">
          <li v-for="(item, i) in order.items" :key="i" class="py-1.5 flex justify-between">
            <span>{{ item.name }} <span class="text-gray-400">×{{ item.quantity }}</span></span>
            <span>{{ item.price }} Kč</span>
          </li>
        </ul>

        <button @click="onReorder(order)" :disabled="reorderingId === order.orderId"
          class="bg-primary text-white text-sm px-4 py-2 rounded hover:bg-accent transition-all disabled:opacity-60">
          {{ reorderingId === order.orderId ? 'Přidávám do košíku…' : 'Objednat znovu' }}
        </button>
      </div>
    </div>

    <ToastNotification :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { reorder } = useReorder()

const { data, pending, error } = await useAsyncData('my-orders', () =>
  $fetch<{ success: boolean; orders: any[] }>('/api/auth/orders')
)
const orders = computed(() => data.value?.orders || [])

const reorderingId = ref<string | null>(null)
const toast = reactive({ show: false, message: '', type: 'cart' as 'success' | 'error' | 'info' | 'cart' })

function showToast(message: string, type: 'success' | 'error' | 'info' | 'cart' = 'info') {
  toast.message = message
  toast.type = type
  toast.show = true
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

const STATUS: Record<string, string> = {
  pending: 'Čeká na zpracování',
  processing: 'Zpracovává se',
  shipped: 'Odesláno',
  delivered: 'Doručeno',
  cancelled: 'Zrušeno',
}
function statusLabel(s: string) {
  return STATUS[s] || s
}

async function onReorder(order: any) {
  reorderingId.value = order.orderId
  try {
    const { added, unavailable, adjusted } = await reorder(order)
    if (added === 0) {
      showToast('Žádnou z položek se nepodařilo přidat – nejspíš už nejsou skladem.', 'error')
      return
    }
    let msg = 'Položky byly přidány do košíku.'
    if (unavailable.length) msg += ` Nedostupné: ${unavailable.join(', ')}.`
    if (adjusted.length) msg += ` Sníženo množství: ${adjusted.join(', ')}.`
    showToast(msg, unavailable.length || adjusted.length ? 'info' : 'success')
    setTimeout(() => navigateTo('/checkout'), 900)
  } catch (e) {
    showToast('Opakování objednávky se nezdařilo.', 'error')
  } finally {
    reorderingId.value = null
  }
}
</script>
