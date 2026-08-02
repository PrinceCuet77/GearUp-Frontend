'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import type { Review } from '@/lib/types';

export interface CreateReviewResult {
  success: boolean;
  data: Review | null;
  error: string | null;
}

const createReviewSchema = z.object({
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(100, 'Comment cannot exceed 100 characters'),
  rentalOrderId: z.string().min(1, 'Rental order ID is required'),
});

const statusMessages: Record<number, string> = {
  400: 'Invalid review data. Please check your input.',
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to create a review for this order.',
  409: 'You have already reviewed this order.',
};

export const createReview = async (payload: {
  rating: number;
  comment: string;
  rentalOrderId: string;
}): Promise<CreateReviewResult> => {
  const parsed = createReviewSchema.safeParse(payload);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join('; ');
    return { success: false, data: null, error: message };
  }

  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return {
        success: false,
        data: null,
        error: 'You are not logged in. Please log in to create a review.',
      };
    }

    const url = `${process.env.BACKEND_API_URL}/api/reviews`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: null,
        error:
          statusMessages[response.status] ??
          result.message ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data as Review,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: result.message ?? 'Failed to create review.',
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
