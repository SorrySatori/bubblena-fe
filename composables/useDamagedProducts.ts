import { ref } from 'vue';

export interface DamagedProduct {
  _id?: string;
  id?: string;
  bathBombType: string;
  weight: number;
  price: number;
  damageLevel: 'lehce' | 'stredne' | 'prach';
  stockCount: number;
  inStock: boolean;
  imageUrl?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export const useDamagedProducts = () => {
  const damagedProducts = ref<DamagedProduct[]>([]);
  const damagedProduct = ref<DamagedProduct | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchDamagedProducts = async () => {
    loading.value = true;
    error.value = null;

    try {
      const data = await $fetch<DamagedProduct[]>('/api/damaged-products', {
        method: 'GET',
      });
      damagedProducts.value = data;
    } catch (err: any) {
      console.error('Nepodařilo se načíst poškozené produkty:', err);
      error.value = err.message || 'Chyba při načítání poškozených produktů';
    } finally {
      loading.value = false;
    }
  };

  const fetchDamagedProduct = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await $fetch<DamagedProduct>(`/api/damaged-product/${id}`, {
        method: 'GET',
      });
      damagedProduct.value = data;
      return data;
    } catch (err: any) {
      console.error(`Nepodařilo se načíst poškozený produkt ${id}:`, err);
      error.value = err.message || 'Chyba při načítání poškozeného produktu';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    damagedProducts,
    damagedProduct,
    loading,
    error,
    fetchDamagedProducts,
    fetchDamagedProduct
  };
};
