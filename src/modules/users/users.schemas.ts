import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3),
  login: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'USER']).optional(),
});

export const updateUserSchema = createUserSchema.partial();