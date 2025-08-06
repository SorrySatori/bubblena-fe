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
          'x-api-key': config.public.apiKey
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
  
      const data = await response.json();
      products.value = data;
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      error.value = err.message || 'Failed to fetch products';
    } finally {
      loading.value = false;
    }
  };
  

  // Get a single product by ID
  const getProduct = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${config.public.apiBase}/products/${id}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': config.public.apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching product: ${response.statusText}`);
      }
      
      return await response.json();
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
