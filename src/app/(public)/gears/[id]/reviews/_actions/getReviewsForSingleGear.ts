'use server';

import { cookies } from 'next/headers';
import type { Review } from '@/lib/types';

export interface ReviewsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Review[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getReviewsForGearAction = async (
  gearId: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
): Promise<ReviewsApiResponse | null> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/gears/${gearId}/reviews?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result as ReviewsApiResponse;
    }

    return null;
  } catch {
    return null;
  }
};
