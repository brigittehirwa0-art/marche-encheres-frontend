export interface SearchFilters {
  query?: string;
  category?: string;
  condition?: string;
  maxPrice?: number;
  deadline?: string;
  city?: string;
  sort?: 'recent' | 'ending' | 'price-low' | 'price-high';
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  city: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateProductDto {
  title: string;
  description: string;
  categoryId: string;
  condition: string;
  startPrice: number;
  city: string;
  endsAt: string;
  images: string[];
}

export interface UpdateProductDto {
  title?: string;
  description?: string;
  categoryId?: string;
  condition?: string;
  currentPrice?: number;
  images?: string[];
}

export interface PlaceBidDto {
  amount: number;
}
