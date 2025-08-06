// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  inStock: boolean;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const useProducts = () => {
  const config = useRuntimeConfig();
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all products
  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
  
    try {
      const response = await fetch(`${config.public.apiBase}/products`, {
        method: 'GET',
        headers: {
          'x-api-key': 'sprscrtpswrd666%@'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
        
      const data: Product[] = await response.json();
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
