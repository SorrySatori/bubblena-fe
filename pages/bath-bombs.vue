<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useCart } from '~/composables/useCart';
import ToastNotification from '~/components/ToastNotification.vue';
import { useCartStore } from "~/stores/cart";

useSeoMeta({
  title: 'Šumivé bomby do koupele',
  description: 'Ručně vyráběné šumivé bomby do vany z přírodních ingrediencí, bez testů na zvířatech. Vyberte si z naší kolekce vonných koulí pro relaxační koupel.',
});

// SSR fetch so the product grid is in server-rendered HTML
const { data: products, pending: loading, error, refresh } = await useAsyncData('products', () => $fetch('/api/products'));

const { addToCart: addItemToCart } = useCart();

// Toast notification state
const showToast = ref(false);
const toastMessage = ref('');
const cart = useCartStore();

// Per-product selected variant index and quantity
const selectedVariantIndexes = reactive({});
const quantities = reactive({});

// Initialize selection state when products load
watch(products, (newProducts) => {
  if (newProducts) {
    newProducts.forEach((product) => {
      if (!(product._id in selectedVariantIndexes)) {
        // Default to first in-stock variant
        const inStockIndex = product.variants?.findIndex(v => v.inStock) ?? 0;
        selectedVariantIndexes[product._id] = inStockIndex >= 0 ? inStockIndex : 0;
        quantities[product._id] = 1;
      }
    });
  }
}, { immediate: true });

// Get selected variant for a product
const getSelectedVariant = (product) => {
  if (!product.variants || product.variants.length === 0) return null;
  const index = selectedVariantIndexes[product._id] ?? 0;
  return product.variants[index];
};

// Check if product has any variant in stock
const hasInStockVariant = (product) => {
  return product.variants && product.variants.some(variant => variant.inStock);
};

const incrementQuantity = (product, event) => {
  if (event) event.stopPropagation();
  const variant = getSelectedVariant(product);
  const maxQuantity = variant?.stockCount || 10;
  if ((quantities[product._id] || 1) < maxQuantity) {
    quantities[product._id] = (quantities[product._id] || 1) + 1;
  }
};

const decrementQuantity = (product, event) => {
  if (event) event.stopPropagation();
  if ((quantities[product._id] || 1) > 1) {
    quantities[product._id] = (quantities[product._id] || 1) - 1;
  }
};

const onVariantChange = (product, event) => {
  if (event) event.stopPropagation();
  // Reset quantity when variant changes
  quantities[product._id] = 1;
};

// Add to cart function
const addToCart = (product, event) => {
  if (event) event.stopPropagation();
  const variant = getSelectedVariant(product);
  const qty = quantities[product._id] || 1;
  
  if (product && variant && variant.inStock) {
    addItemToCart({
      id: `${product._id}-${variant.weight}`,
      name: `${product.name} (${variant.weight}g)`,
      price: variant.price,
      quantity: qty,
      variant,
      imageUrl: product.imageUrl
    });
    cart.addItem(product._id, variant.weight, qty)
    
    // Show toast notification
    toastMessage.value = `${qty}× ${product.name} (${variant.weight}g) přidáno do košíku`;
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
      <AppBreadcrumb :items="[{ name: 'Domů', to: '/' }, { name: 'Bomby do koupele', to: '/bath-bombs' }]" />
      <h1 class="page-title">Naše bomby do koupele</h1>
      <div class="category-description">
        <p>
          Bomby do koupele jsou šumivé koule, které se po vložení do vody začnou rozpouštět, jemně perlit a uvolňovat vůni, barvy či pečující složky. Každá bomba má svůj unikátní charakter a účinky. S některými zažijete zábavný koktejl barev, jiné vám pomohou uvolnit se, zklidnit mysl nebo si jen dopřát chvilku pro sebe.
        </p>
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Načítání produktů...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="error-message">
        <p>Chyba při načítání produktů</p>
        <button @click="refresh" class="retry-button">Zkusit znovu</button>
      </div>

      <!-- No products state -->
      <div v-else-if="(products ?? []).length === 0" class="no-products">
        <p>Žádné produkty nebyly nalezeny.</p>
      </div>

      <!-- Products grid -->
      <div v-else class="products-grid">
        <NuxtLink v-for="product in (products ?? [])" :key="product._id" :to="`/product/${product.slug || product._id}`" class="product-card">
          <div class="product-image">
            <img :src="product.imageUrl" :alt="product.name" loading="lazy" decoding="async">
            <span v-if="!hasInStockVariant(product)" class="out-of-stock-badge">Vyprodáno</span>
            <span v-if="product.variants && product.variants.length > 1" class="variants-badge">{{ product.variants.length }} variant{{ product.variants.length > 1 ? 'y' : 'a' }}</span>
          </div>
          <div class="product-info">
            <h2 class="product-name">{{ product.name }}</h2>
            <p class="product-description">{{ product.shortDescription }}</p>

            <!-- Variant selector -->
            <div v-if="product.variants && product.variants.length > 1" class="variant-selector" @click.stop>
              <select 
                :value="selectedVariantIndexes[product._id]" 
                @change="selectedVariantIndexes[product._id] = Number($event.target.value); onVariantChange(product, $event)"
                class="variant-select"
              >
                <option v-for="(variant, index) in product.variants" :key="index" :value="index" :disabled="!variant.inStock">
                  {{ variant.weight }}g - {{ variant.price.toFixed(2) }} Kč {{ !variant.inStock ? '(Vyprodáno)' : '' }}
                </option>
              </select>
            </div>

            <div class="product-footer">
              <div class="product-price-container">
                <span class="product-price">
                  {{ getSelectedVariant(product) ? (getSelectedVariant(product).price * (quantities[product._id] || 1)).toFixed(2) : '0.00' }} Kč
                </span>
              </div>

              <div v-if="getSelectedVariant(product)?.inStock" class="cart-controls" @click.stop>
                <!-- Quantity picker -->
                <div class="quantity-picker">
                  <button @click="decrementQuantity(product, $event)" class="qty-btn" :disabled="(quantities[product._id] || 1) <= 1">−</button>
                  <span class="qty-value">{{ quantities[product._id] || 1 }}</span>
                  <button @click="incrementQuantity(product, $event)" class="qty-btn" :disabled="(quantities[product._id] || 1) >= (getSelectedVariant(product)?.stockCount || 10)">+</button>
                </div>

                <button 
                  class="add-to-cart-btn" 
                  @click.stop="addToCart(product, $event)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Do košíku
                </button>
              </div>

              <button v-else
                class="add-to-cart-btn" 
                disabled
              >
                Vyprodáno
              </button>
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
  margin-bottom: 1rem;
  text-align: center;
  color: var(--secondary-color);
}

.category-description {
  max-width: 820px;
  margin: 0 auto 2rem;
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.7;
  text-align: center;
}

.category-description p + p {
  margin-top: 0.75rem;
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
  object-position: center 35%;
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
  margin-top: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
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

/* Variant selector */
.variant-selector {
  margin-top: 0.75rem;
}

.variant-select {
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.85rem;
  background-color: white;
  color: #374151;
  cursor: pointer;
  appearance: auto;
}

.variant-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(65, 184, 131, 0.2);
}

/* Cart controls (quantity + button) */
.cart-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Quantity picker */
.quantity-picker {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  background-color: white;
}

.qty-btn {
  background: none;
  border: none;
  padding: 0.3rem 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  color: #374151;
  line-height: 1;
  transition: color 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  color: var(--primary-color);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  padding: 0.3rem 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 28px;
  text-align: center;
  color: #374151;
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

  .product-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .cart-controls {
    justify-content: space-between;
  }
}
</style>
