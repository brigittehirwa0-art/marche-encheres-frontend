import { api } from '@/core/api-client';
import type { Product, SearchFilters } from '@/core/types';

type ApiProduct = Omit<Product, 'images' | 'condition'> & {
  images: Array<string | { url: string }>;
  condition: string;
};

interface ProductResponse {
  success: boolean;
  data: ApiProduct;
}

interface ProductsResponse {
  success: boolean;
  data: ApiProduct[];
}

const conditionLabels: Record<string, Product['condition']> = {
  Neuf: 'Neuf',
  Tres_bon_etat: 'Très bon état',
  Bon_etat: 'Bon état',
  A_restaurer: 'À restaurer',
};

function normalizeProduct(product: ApiProduct): Product {
  return {
    ...product,
    images: product.images.map((image) => typeof image === 'string' ? image : image.url),
    condition: conditionLabels[product.condition] ?? product.condition as Product['condition'],
  };
}

export const productsApi = {
  uploadImages: async (files: File[]): Promise<string[]> => {
    const response = await api.upload<{ success: boolean; data: { urls: string[] } }>('/uploads', files);
    return response.data.urls;
  },
  list: async (filters: SearchFilters = {}): Promise<Product[]> => {
    const queryParams = new URLSearchParams();
    if (filters.query) queryParams.append('query', filters.query);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.condition) queryParams.append('condition', filters.condition);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.deadline) queryParams.append('deadline', filters.deadline);
    if (filters.sort) queryParams.append('sort', filters.sort);

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    const response = await api.get<ProductsResponse>(endpoint);
    return response.data.map(normalizeProduct);
  },
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<ProductResponse>(`/products/${id}`);
    return normalizeProduct(response.data);
  },
  create: async (input: any): Promise<Product> => {
    const response = await api.post<ProductResponse>('/products', input);
    return normalizeProduct(response.data);
  },
};
