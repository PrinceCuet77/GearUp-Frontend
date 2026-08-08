'use server';

import { z } from 'zod';
import type { Review } from '@/lib/types';
import { isAccessTokenExist } from '@/app/(auth)/_actions/refreshTokenAction';

export interface UpdateReviewResult {
  success: boolean;
  data: Review | null;
  error: string | null;
}

const updateReviewSchema = z.object({
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .optional(),
  comment: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(100, 'Comment cannot exceed 100 characters')
    .optional(),
});

const statusMessages: Record<number, string> = {
  400: 'Invalid review data. Please check your input.',
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to update this review.',
  404: 'Review not found.',
};

export const updateReview = async (
  reviewId: string,
  payload: { rating?: number; comment?: string },
): Promise<UpdateReviewResult> => {
  const parsed = updateReviewSchema.safeParse(payload);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join('; ');
    return { success: false, data: null, error: message };
  }

  try {
    const accessToken = await isAccessTokenExist();

    const url = `${process.env.BACKEND_API_URL}/api/reviews/${reviewId}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        error:
          statusMessages[response.status] ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    const data: Review = await response.json();

    return { success: true, data, error: null };
  } catch {
    return {
      success: false,
      data: null,
      error:
        'A network error occurred. Please check your connection and try again.',
    };
  }
};
