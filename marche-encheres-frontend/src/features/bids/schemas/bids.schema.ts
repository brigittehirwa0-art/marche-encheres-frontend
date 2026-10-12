import { z } from 'zod';

export const bidSchema = z.object({
  amount: z.coerce.number().positive('Entrez un montant valide.'),
});