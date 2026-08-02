'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import type { User } from '@/lib/types';

const updateMyProfile = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or fewer')
    .optional(),
  avatarUrl: z
    .string()
    .url('Avatar URL must be a valid URL')
    .max(255, 'Avatar URL must be 255 characters or fewer')
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
});

export interface UpdateProfileResult {
  success: boolean;
  data: User | null;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to update this profile.',
  404: 'User not found.',
};

export const updateProfile = async (
  payload: z.infer<typeof updateMyProfile>,
): Promise<UpdateProfileResult> => {
  try {
    const parsed = updateMyProfile.safeParse(payload);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Invalid input.';
      return { success: false, data: null, error: message };
    }

    const { name, avatarUrl } = parsed.data;

    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return {
        success: false,
        data: null,
        error: 'You are not logged in. Please log in to update your profile.',
      };
    }

    const url = `${process.env.BACKEND_API_URL}/api/user/me`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name, avatarUrl }),
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: null,
        error:
          result.message ??
          statusMessages[response.status] ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    if (result.success) {
      // Revalidate the profile cache
      revalidateTag('user-profile', 'max');

      return { success: true, data: result.data as User, error: null };
    }

    return {
      success: false,
      data: null,
      error: result.message ?? 'Unexpected response from server.',
    };
  } catch {
    return {
      success: false,
      data: null,
      error:
        'A network error occurred. Please check your connection and try again.',
    };
  }
};
