'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import type { Review } from '@/lib/types';
import { isAccessTokenExist } from '@/app/(auth)/_actions/refreshTokenAction';

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
  gearItemId: z.string().min(1, 'Gear item ID is required'),
  rentalOrderId: z.string().min(1, 'Rental order ID is required'),
});

const statusMessages: Record<number, string> = {
  400: 'Invalid review data. Please check your input.',
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to create a review for this order.',
  409: 'You have already reviewed this gear item for this order.',
};

export const createReview = async (payload: {
  rating: number;
  comment: string;
  gearItemId: string;
  rentalOrderId: string;
}): Promise<CreateReviewResult> => {
  const parsed = createReviewSchema.safeParse(payload);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join('; ');
    return { success: false, data: null, error: message };
  }

  try {
    const accessToken = await isAccessTokenExist();

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
