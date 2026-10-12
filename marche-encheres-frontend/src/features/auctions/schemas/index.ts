import { z } from 'zod';

export const paymentSchema = z.object({ productId: z.string(), amount: z.coerce.number().positive() });