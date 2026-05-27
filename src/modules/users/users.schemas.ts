import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(10),
  role: z.enum(['ADMIN', 'USER']).optional(),
});

export const updateUserSchema = z.object({ name: z.string().min(3).optional() }).strict();

export const updatePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(10) });
