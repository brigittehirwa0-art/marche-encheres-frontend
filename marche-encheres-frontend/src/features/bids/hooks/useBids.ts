import { useQuery } from '@tanstack/react-query';
import type { Bid } from '@/core/types';
import { bidsApi } from '../api/bids.api';

export function useBids(productId: string) {
  return useQuery<Bid[]>({
    queryKey: ['bids', productId],
    queryFn: () => bidsApi.listByProduct(productId),
    enabled: Boolean(productId),
  });
}