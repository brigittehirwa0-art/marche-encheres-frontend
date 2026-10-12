import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/core/types';
import { productsApi } from '../api/products.api';

export function useProduct(id: string) {
  return useQuery<Product | undefined>({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: Boolean(id),
  });
}