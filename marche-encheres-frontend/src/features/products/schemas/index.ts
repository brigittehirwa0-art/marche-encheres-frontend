import { z } from 'zod';

export const listingSchema = z.object({ title: z.string().min(3), description: z.string().min(20), categoryId: z.string(), condition: z.string(), startPrice: z.coerce.number().positive(), city: z.string().min(2), endsAt: z.coerce.date() });