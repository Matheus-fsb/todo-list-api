import { z } from 'zod';

const nullableDateSchema = z.union([z.coerce.date(), z.null()]);

const taskFields = {
  title: z
    .string()
    .min(3, 'Title must have at least 3 characters')
    .max(100, 'Title must have a maximum of 100 characters'),

  description: z.string().max(500, 'Description must have a maximum of 500 characters'),

  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),

  dueDate: nullableDateSchema,
};

export const createTaskSchema = z.object({
  title: taskFields.title,
  description: taskFields.description.optional(),
  status: taskFields.status.default('PENDING'),
  priority: taskFields.priority.optional(),
  projectId: z.string(),
  dueDate: taskFields.dueDate.optional(),
});

export const updateTaskSchema = z.object({
  title: taskFields.title.optional(),
  description: taskFields.description.optional(),
  status: taskFields.status.optional(),
  priority: taskFields.priority.optional(),
  dueDate: taskFields.dueDate.optional(),
});
