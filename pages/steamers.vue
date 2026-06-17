<script setup>
import { ref, onMounted } from 'vue';
import { useCart } from '~/composables/useCart';
import ToastNotification from '~/components/ToastNotification.vue';
import { useCartStore } from "~/stores/cart";

// SSR-friendly steamers data fetch
const { data: steamers } = await useAsyncData('steamers', () => $fetch('/api/steamers'));

const { addToCart: addItemToCart } = useCart();

// Toast notification state
const showToast = ref(false);
const toastMessage = ref('');
const cart = useCartStore();

// Add to cart function
const addToCart = (steamer, event) => {
  if (event) event.stopPropagation();
  
  if (steamer && steamer.inStock) {
    addItemToCart({
      id: steamer._id,
      name: `${steamer.name} (${steamer.weight}g)`,
      price: steamer.price,
      quantity: 1,
      imageUrl: steamer.imageUrl
    });
    
    // Show toast notification
    toastMessage.value = `${steamer.name} přidáno do košíku`;
    showToast.value = true;
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  }
};

onMounted(() => {
  cart.initCart();
});

useSeoMeta({
  title: 'Shower steamery do sprchy',
  description: 'Voňavé shower steamery do sprchy z přírodních ingrediencí. Proměňte sprchování v aromaterapeutický zážitek – objevte naši nabídku.'
});

</script>

<template>
  <div class="products-page">
    <!-- Toast Notification -->
    <ToastNotification 
      :show="showToast" 
      :message="toastMessage" 
      type="cart"
      @close="showToast = false"
    />
    <div class="container">
      <AppBreadcrumb :items="[{ name: 'Domů', to: '/' }, { name: 'Steamery', to: '/steamers' }]" />

      <h1 class="page-title">Steamery do sprchy</h1>

      <!-- No steamers state -->
      <div v-if="(steamers ?? []).length === 0" class="no-products">
        <p>Žádné steamery nebyly nalezeny.</p>
      </div>

      <!-- Steamers grid -->
      <div v-else class="products-grid">
        <NuxtLink
          v-for="steamer in (steamers ?? [])"
          :key="steamer._id"
          :to="`/steamer/${steamer.slug || steamer._id}`"
          class="product-card"
        >
          <div class="product-image">
            <img :src="steamer.imageUrl || '/images/product-placeholder.jpg'" :alt="steamer.name" loading="lazy" decoding="async">
            <span v-if="!steamer.inStock" class="out-of-stock-badge">Vyprodáno</span>
          </div>
          <div class="product-info">
            <h2 class="product-name">{{ steamer.name }}</h2>
            <p class="product-description">{{ steamer.shortDescription }}</p>
            <div class="product-footer">
              <div class="product-price-container">
                <span class="product-price">{{ steamer.price.toFixed(2) }} Kč</span>
                <span class="product-price-note">{{ steamer.weight }}g</span>
              </div>
              <NuxtLink
                :to="`/steamer/${steamer.slug || steamer._id}`"
                class="add-to-cart-btn"
                @click.stop
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Zobrazit detail
              </NuxtLink>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  padding: 2rem 0;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--secondary-color);
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(65, 184, 131, 0.2);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error state */
.error-message {
  text-align: center;
  padding: 2rem;
  background-color: #fff3f3;
  border-radius: 8px;
  border: 1px solid #ffcdd2;
  color: #d32f2f;
  margin: 2rem 0;
}

.retry-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background-color: var(--accent-color);
}

/* No products state */
.no-products {
  text-align: center;
  padding: 3rem 0;
  color: var(--dark-color);
}

/* Products grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.product-card {
  display: block;
  color: inherit;
  text-decoration: none;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.out-of-stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--secondary-color);
}

.product-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.product-price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.product-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--secondary-color);
}

.product-price-note {
  font-size: 0.7rem;
  color: #6c757d;
  margin-top: -3px;
}

.variants-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(65, 184, 131, 0.9);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.add-to-cart-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: var(--accent-color);
}

.add-to-cart-btn:disabled {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }
  
  .product-image {
    height: 160px;
  }
  
  .product-info {
    padding: 1rem;
  }
  
  .product-name {
    font-size: 1.1rem;
  }
  
  .product-price {
    font-size: 1.1rem;
  }
  
  .add-to-cart-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>
