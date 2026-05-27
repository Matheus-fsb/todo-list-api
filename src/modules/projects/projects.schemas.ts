import { z } from 'zod';

const projectFields = {
  name: z
    .string()
    .min(3, 'Name must have at least 3 characters')
    .max(100, 'Name must have a maximum of 100 characters'),

  description: z.string().max(500, 'Description must have a maximum of 500 characters'),
};

export const createProjectSchema = z.object({
  ...projectFields,
  description: projectFields.description.optional(),
  userId: z.uuid('Invalid user ID'),
});

export const updateProjectSchema = z.object({
  name: projectFields.name.optional(),
  description: projectFields.description.optional(),
});
