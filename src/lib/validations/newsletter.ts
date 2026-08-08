import { z } from 'zod';

export const gearAlertSchema = z.object({
  email: z
    .string()
    .min(1, 'Enter your email address')
    .email('That does not look like a valid email address'),
  /** Category name to follow, or an empty string for "everything". */
  interest: z.string().optional(),
});

export type GearAlertValues = z.infer<typeof gearAlertSchema>;
