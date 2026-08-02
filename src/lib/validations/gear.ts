import { z } from 'zod';

export const createGearSchema = z.object({
  name: z
    .string()
    .min(1, 'Gear name is required')
    .max(100, 'Gear name must be at most 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(255, 'Description must be at most 255 characters'),
  price: z.number().positive('Price must be a positive number'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  images: z
    .string()
    .min(1, 'Images URL is required')
    .max(255, 'Images URL must be at most 255 characters'),
  categoryId: z.string().min(1, 'Category ID is required'),
  isActive: z.boolean().optional(),
});

export const updateGearSchema = z.object({
  name: z
    .string()
    .min(1, 'Gear name is required')
    .max(100, 'Gear name must be at most 100 characters')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(255, 'Description must be at most 255 characters')
    .optional(),
  price: z.number().positive('Price must be a positive number').optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
  images: z
    .string()
    .min(1, 'Images URL is required')
    .max(255, 'Images URL must be at most 255 characters')
    .optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
  isActive: z.boolean().optional(),
});

export type CreateGearValues = z.infer<typeof createGearSchema>;
export type UpdateGearValues = z.infer<typeof updateGearSchema>;
