import { useQuery } from '@tanstack/react-query';
import type { Product, SearchFilters } from '@/core/types';
import { productsApi } from '../api/products.api';

export function useProducts(filters: SearchFilters = {}) {
  return useQuery<Product[]>({
    queryKey: ['products', filters],
    queryFn: () => productsApi.list(filters),
    staleTime: 20_000,
  });
}