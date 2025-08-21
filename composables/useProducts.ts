// Product interface
export interface Product {
  _id?: string;
  id?: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  weight?: number;
  imageUrl?: string;
  bathImageUrl?: string;
  videoUrl?: string;
  category?: string;
  inStock: boolean;
  stockCount?: number;
  storageMethod?: string;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export const useProducts = () => {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all products
  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
  
    try {
      const data = await $fetch<Product[]>('/api/products', {
        method: 'GET',
      });
      products.value = data;
    } catch (err: any) {
      console.error('Nepodařilo se načíst produkty:', err);
      error.value = err.message || 'Chyba při načítání produktů';
    } finally {
      loading.value = false;
    }
  };
  

  // Get a single product by ID
  const getProduct = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const product = await $fetch(`/api/product/${id}`);      
      return product;
    } catch (err: any) {
      console.error(`Failed to fetch product ${id}:`, err);
      error.value = err.message || 'Failed to fetch product';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProduct
  };
};
