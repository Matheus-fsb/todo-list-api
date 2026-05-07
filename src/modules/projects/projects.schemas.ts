import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must have at least 3 characters')
    .max(100, 'Name must have a maximum of 100 characters'),

  description: z
    .string()
    .max(500, 'Description must have a maximum of 500 characters')
    .optional(),

  userId: z.string().uuid('Invalid user ID'),
});

export const updateProjectSchema = createProjectSchema.partial();
