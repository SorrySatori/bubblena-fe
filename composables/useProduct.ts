import { ref } from 'vue';
import type { Product } from './useProducts';

export const useProduct = () => {
  const product = ref<Product | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch a single product by ID
  const fetchProduct = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await $fetch<Product>(`/api/product/${id}`, {
        method: 'GET',
      });
      product.value = data;
      return data;
    } catch (err: any) {
      console.error(`Nepodařilo se načíst produkt ${id}:`, err);
      error.value = err.message || 'Chyba při načítání produktu';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    product,
    loading,
    error,
    fetchProduct
  };
};
