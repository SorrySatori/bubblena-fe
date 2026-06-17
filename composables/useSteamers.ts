// ShowerSteamer interface
export interface ShowerSteamer {
  _id?: string;
  id?: string;
  slug?: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  weight: number;
  stockCount: number;
  inStock: boolean;
  imageUrl?: string;
  videoUrl?: string;
  category?: string;
  storageMethod?: string;
  ingredients: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export const useSteamers = () => {
  const steamers = ref<ShowerSteamer[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all shower steamers
  const fetchSteamers = async () => {
    loading.value = true;
    error.value = null;
  
    try {
      const data = await $fetch<ShowerSteamer[]>('/api/steamers', {
        method: 'GET',
      });
      steamers.value = data;
    } catch (err: any) {
      console.error('Nepodařilo se načíst steamery:', err);
      error.value = err.message || 'Chyba při načítání steamerů';
    } finally {
      loading.value = false;
    }
  };
  
  // Get a single steamer by ID
  const getSteamer = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      const steamer = await $fetch(`/api/steamer/${id}`);      
      return steamer;
    } catch (err: any) {
      console.error(`Failed to fetch steamer ${id}:`, err);
      error.value = err.message || 'Failed to fetch steamer';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    steamers,
    loading,
    error,
    fetchSteamers,
    getSteamer
  };
};
