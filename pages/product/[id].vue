<template>
  <div class="product-detail-page">
    <div class="container">
      <!-- Back button -->
      <NuxtLink to="/products" class="back-button">
        <span class="back-icon">←</span> Zpět na produkty
      </NuxtLink>

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Načítání produktu...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadProduct" class="retry-button">Zkusit znovu</button>
      </div>
      
      <!-- No product state -->
      <div v-else-if="!product" class="no-product">
        <p>Produkt nebyl nalezen.</p>
        <NuxtLink to="/products" class="back-to-products">Zpět na seznam produktů</NuxtLink>
      </div>
      
      <!-- Product detail -->
      <div v-else class="product-detail">
        <div class="product-image-container">
          <img :src="product.imageUrl || '/images/product-placeholder.jpg'" :alt="product.name" class="product-image">
          <span v-if="!product.inStock" class="out-of-stock-badge">Vyprodáno</span>
        </div>
        
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <div class="product-price">${{ product.price.toFixed(2) }}</div>
          
          <div class="product-availability">
            <span :class="['availability-indicator', product.inStock ? 'in-stock' : 'out-of-stock']"></span>
            <span>{{ product.inStock ? 'Skladem' : 'Vyprodáno' }}</span>
            <span v-if="product.stockCount && product.inStock" class="stock-count">({{ product.stockCount }} ks)</span>
          </div>
          
          <div v-if="product.shortDescription" class="product-short-description">
            <p>{{ product.shortDescription }}</p>
          </div>
          
          <div class="product-description">
            <h2>Popis produktu</h2>
            <p>{{ product.description }}</p>
          </div>
          
          <div class="product-meta">
            <div v-if="product.storageMethod" class="meta-item">
              <span class="meta-label">Způsob skladování:</span>
              <span class="meta-value">{{ product.storageMethod }}</span>
            </div>
            <div v-if="product.weight" class="meta-item">
              <span class="meta-label">Hmotnost:</span>
              <span class="meta-value">{{ product.weight }} g</span>
            </div>
            <div v-if="product.createdAt" class="meta-item">
              <span class="meta-label">Přidáno:</span>
              <span class="meta-value">{{ formatDate(product.createdAt) }}</span>
            </div>
          </div>
          
          <div class="product-actions">
            <button class="add-to-cart-btn" :disabled="!product.inStock">
              {{ product.inStock ? 'Přidat do košíku' : 'Vyprodáno' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProduct } from '~/composables/useProduct';
import { useRoute } from 'vue-router';

const route = useRoute();
const productId = route.params.id;
const { product, loading, error, fetchProduct } = useProduct();

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Load product data
const loadProduct = async () => {
  await fetchProduct(productId);
};

// Load product when component is mounted
onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
.product-detail-page {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  color: var(--secondary-color);
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: var(--primary-color);
}

.back-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
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

/* No product state */
.no-product {
  text-align: center;
  padding: 3rem 0;
  color: var(--dark-color);
}

.back-to-products {
  display: inline-block;
  margin-top: 1rem;
  color: var(--primary-color);
  text-decoration: none;
}

.back-to-products:hover {
  text-decoration: underline;
}

/* Product detail */
.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 1rem;
}

.product-image-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: auto;
  display: block;
}

.out-of-stock-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-name {
  font-size: 2.5rem;
  color: var(--secondary-color);
  margin: 0;
}

.product-price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--secondary-color);
}

.product-availability {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.availability-indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.in-stock {
  background-color: #4caf50;
}

.out-of-stock {
  background-color: #f44336;
}

.stock-count {
  color: #6c757d;
}

.product-short-description {
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-left: 3px solid var(--primary-color);
  border-radius: 4px;
}

.product-short-description p {
  margin: 0;
  font-style: italic;
  color: #495057;
  line-height: 1.5;
}

.product-description {
  margin-top: 1rem;
}

.product-description h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.product-description p {
  line-height: 1.6;
  color: #333;
}

.product-meta {
  margin-top: 1rem;
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}

.meta-item {
  margin-bottom: 0.5rem;
}

.meta-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.meta-value {
  color: #6c757d;
}

.product-actions {
  margin-top: 1rem;
}

.add-to-cart-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  width: 100%;
  max-width: 300px;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: var(--accent-color);
}

.add-to-cart-btn:disabled {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

/* Media Gallery */
.media-gallery {
  margin-top: 2rem;
}

.media-gallery h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.gallery-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.gallery-image, .gallery-video {
  width: 100%;
  height: auto;
  display: block;
}

.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem;
  font-size: 0.8rem;
  text-align: center;
}

.video-item {
  aspect-ratio: 16/9;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .product-name {
    font-size: 2rem;
  }
  
  .product-price {
    font-size: 1.5rem;
  }
  
  .gallery-items {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
