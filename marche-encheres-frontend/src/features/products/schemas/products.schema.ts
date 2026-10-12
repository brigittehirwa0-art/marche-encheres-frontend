import { z } from 'zod';

export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  condition: z.string().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  deadline: z.enum(['24h']).optional(),
  city: z.string().optional(),
  sort: z.enum(['recent', 'ending', 'price-low', 'price-high']).optional(),
});