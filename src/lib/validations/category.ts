import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must not exceed 100 characters'),
  description: z
    .string()
    .max(100, 'Description must not exceed 100 characters')
    .optional(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must not exceed 100 characters')
    .optional(),
  description: z
    .string()
    .max(100, 'Description must not exceed 100 characters')
    .optional(),
});
