import { productsApi } from '../products/api';

export const auctionsApi = {
  refresh: () => productsApi.list(),
};