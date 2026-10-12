import { api } from '@/core/api-client';
import type { Category } from '@/core/types';

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const response = await api.get<CategoriesResponse>('/categories');
    return response.data;
  },
};