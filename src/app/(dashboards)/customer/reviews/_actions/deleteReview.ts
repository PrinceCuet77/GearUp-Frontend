'use server';

import { isAccessTokenExist } from '@/app/(auth)/_actions/refreshTokenAction';
import { cookies } from 'next/headers';

export interface DeleteReviewResult {
  success: boolean;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to delete this review.',
  404: 'Review not found.',
};

export const deleteReview = async (
  reviewId: string,
): Promise<DeleteReviewResult> => {
  try {
    const accessToken = await isAccessTokenExist();

    const url = `${process.env.BACKEND_API_URL}/api/reviews/${reviewId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        success: false,
        error:
          statusMessages[response.status] ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    return { success: true, error: null };
  } catch {
    return {
      success: false,
      error:
        'A network error occurred. Please check your connection and try again.',
    };
  }
};
