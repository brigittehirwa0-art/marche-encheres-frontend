import { useQuery } from '@tanstack/react-query';
import type { Category } from '@/core/types';
import { categoriesApi } from '../api/categories.api';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
    staleTime: Infinity,
  });
}