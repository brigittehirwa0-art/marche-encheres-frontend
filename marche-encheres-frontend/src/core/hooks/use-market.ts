import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../mock-api';
import type { Product, SearchFilters } from '../types';

export function useProducts(filters: SearchFilters = {}) {
  return useQuery<Product[]>({ queryKey: ['products', filters], queryFn: () => mockApi.listProducts(filters), staleTime: 20_000 });
}

export function useProduct(id: string) {
  return useQuery<Product | undefined>({ queryKey: ['product', id], queryFn: () => mockApi.getProduct(id), enabled: Boolean(id) });
}

export function useProductBids(id: string) {
  return useQuery({ queryKey: ['bids', id], queryFn: () => mockApi.getBids(id), enabled: Boolean(id) });
}