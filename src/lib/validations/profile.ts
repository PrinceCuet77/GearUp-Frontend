import { z } from 'zod';

/**
 * Profile edit form. Mirrors the constraints the `updateProfile` server action
 * re-checks, so the client blocks the same input the backend would reject.
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or fewer'),
  avatarUrl: z
    .string()
    .trim()
    .max(255, 'Avatar URL must be 255 characters or fewer')
    .refine(
      (value) => value === '' || /^https:\/\/\S+$/i.test(value),
      'Enter a valid https:// image URL',
    ),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
