import { z } from 'zod';

export const categorySchema = z.object({ id: z.string(), name: z.string().min(2), icon: z.string() });