import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Entrez une adresse e-mail valide.'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Entrez votre nom complet.'),
});