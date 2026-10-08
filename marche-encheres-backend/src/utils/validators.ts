import { z } from 'zod';

// Auth validators
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
  }),
});

// Product validators
export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    categoryId: z.string().uuid('Invalid category ID'),
    condition: z.enum(['Neuf', 'Tres_bon_etat', 'Bon_etat', 'A_restaurer']),
    startPrice: z.number().positive('Start price must be positive'),
    city: z.string().min(2, 'City is required'),
    endsAt: z.string().refine((val) => new Date(val) > new Date(), 'End date must be in the future'),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(10).optional(),
    categoryId: z.string().uuid().optional(),
    condition: z.enum(['Neuf', 'Très_bon_état', 'Bon_état', 'À_restaurer']).optional(),
    currentPrice: z.number().positive().optional(),
    images: z.array(z.string().url()).optional(),
  }).partial(),
});

// Bid validators
export const placeBidSchema = z.object({
  params: z.object({
    productId: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
  }),
});

// Search filters validator
export const searchFiltersSchema = z.object({
  query: z.object({
    query: z.string().optional(),
    category: z.string().optional(),
    condition: z.string().optional(),
    maxPrice: z.string().transform((val) => (val ? Number(val) : undefined)).optional(),
    deadline: z.string().optional(),
    city: z.string().optional(),
    sort: z.enum(['recent', 'ending', 'price-low', 'price-high']).optional(),
  }),
});
