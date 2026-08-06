import axios from 'axios';
import { ref } from 'vue';

export const useApi = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase as string;
  
  const apiClient = axios.create({
    baseURL: apiBase,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const createResource = <T>(resourcePath: string) => {
    return () => {
      const data = ref<T | null>(null);
      const pending = ref(false);
      const error = ref<any>(null);

      const fetchAll = async () => {
        pending.value = true;
        error.value = null;
        try {
          const response = await apiClient.get(resourcePath);
          data.value = response.data?.data || response.data;
          return data.value;
        } catch (err) {
          error.value = err;
          throw err;
        } finally {
          pending.value = false;
        }
      };

      const create = async (payload: any) => {
        const response = await apiClient.post(resourcePath, payload);
        return response.data?.data || response.data;
      };

      const update = async (id: string, payload: any) => {
        const response = await apiClient.patch(`${resourcePath}/${id}`, payload);
        return response.data?.data || response.data;
      };

      const remove = async (id: string) => {
        const response = await apiClient.delete(`${resourcePath}/${id}`);
        return response.data?.data || response.data;
      };

      return {
        data,
        pending,
        error,
        fetchAll,
        create,
        update,
        remove
      };
    };
  };

  return {
    apiClient,
    useEventsApi: createResource<any[]>('/events'),
    useNewsApi: createResource<any[]>('/news'),
    useSermonsApi: createResource<any[]>('/sermons'),
    useAlumniApi: createResource<any[]>('/alumni'),
    useGalleryApi: createResource<any[]>('/gallery'),
    useDepartmentsApi: createResource<any[]>('/departments'),
    useLeadershipApi: createResource<any[]>('/leadership'),
    useStatsApi: async () => {
      const response = await apiClient.get('/stats/dashboard');
      return response.data?.data || response.data;
    },
    useSettingsApi: async () => {
      const response = await apiClient.get('/settings');
      // Convert array of settings to key-value object
      const settingsArray = response.data?.data || response.data || [];
      const settingsObj: Record<string, any> = {};
      settingsArray.forEach((s: any) => {
        settingsObj[s.key] = s.value;
      });
      return settingsObj;
    },
    updateSetting: async (key: string, value: any) => {
      const response = await apiClient.put(`/settings/${key}`, { value });
      return response.data?.data || response.data;
    }
  };
};
