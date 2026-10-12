export type ProductStatus = 'active' | 'ended' | 'unsold' | 'sold';
export type ProductCondition = 'Neuf' | 'Très bon état' | 'Bon état' | 'À restaurer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  city: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: Category;
  condition: ProductCondition;
  startPrice: number;
  currentPrice: number;
  images: string[];
  seller: User;
  city: string;
  publishedAt: string;
  endsAt: string;
  status: ProductStatus;
}

export interface Bid {
  id: string;
  productId: string;
  bidderName: string;
  bidderId: string;
  amount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  recipientId?: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  type: 'bid' | 'sale' | 'system';
}

export interface PaymentWindow {
  productId: string;
  sellerId: string;
  winnerId: string;
  amount: number;
  expiresAt: string;
  status: 'pending' | 'paid' | 'expired';
}

export interface SearchFilters {
  query?: string;
  category?: string;
  condition?: string;
  maxPrice?: number;
  deadline?: string;
  city?: string;
  sort?: 'recent' | 'ending' | 'price-low' | 'price-high';
}