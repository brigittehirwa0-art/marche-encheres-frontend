import { api } from '@/core/api-client';
import type { Bid } from '@/core/types';

interface BidsResponse {
  success: boolean;
  data: Bid[];
}

interface BidResponse {
  success: boolean;
  data: Bid;
}

export const bidsApi = {
  listByProduct: async (productId: string): Promise<Bid[]> => {
    const response = await api.get<BidsResponse>(`/bids/product/${productId}`);
    return response.data;
  },
  place: async (productId: string, amount: number): Promise<Bid> => {
    const response = await api.post<BidResponse>(`/bids/product/${productId}`, { amount });
    return response.data;
  },
};