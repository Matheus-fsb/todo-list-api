import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must have at least 3 characters')
    .max(100, 'Title must have a maximum of 100 characters'),

  description: z.string().max(500, 'Description must have a maximum of 500 characters').optional(),

  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),

  completedAt: z.date().optional(),

  projectId: z.string(),
});

export const updateTaskSchema = createTaskSchema.partial();
