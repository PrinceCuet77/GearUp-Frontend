import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address.' }).trim(),
  password: z.string().min(1, { error: 'Password is required.' }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { error: 'Name must be at least 2 characters.' })
      .max(60, { error: 'Name must be under 60 characters.' })
      .trim(),
    email: z.email({ error: 'Please enter a valid email address.' }).trim(),
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters.' })
      .regex(/[a-zA-Z]/, {
        error: 'Password must contain at least one letter.',
      })
      .regex(/[0-9]/, { error: 'Password must contain at least one number.' }),
    confirmPassword: z
      .string()
      .min(1, { error: 'Please confirm your password.' }),
    role: z.enum(['CUSTOMER', 'PROVIDER'], {
      error: 'Please select a role.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type RegisterFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        role?: string[];
      };
      message?: string;
    }
  | undefined;
