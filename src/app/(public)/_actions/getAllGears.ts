'use server';

import { cookies } from 'next/headers';
import type { GearItem, GearsApiResponse, GearsResult } from '@/lib/types';

export interface GetGearsParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to view gears.',
  404: 'Gears not found. Please try again later.',
};

export const getAllGearsAction = async (
  params: GetGearsParams = {},
): Promise<GearsResult> => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 9,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    // Build query params
    const queryParams = new URLSearchParams();
    if (category) queryParams.set('category', category);
    if (minPrice !== undefined) queryParams.set('minPrice', String(minPrice));
    if (maxPrice !== undefined) queryParams.set('maxPrice', String(maxPrice));
    if (search) queryParams.set('search', search);
    queryParams.set('page', String(page));
    queryParams.set('limit', String(limit));
    queryParams.set('sortBy', sortBy);
    queryParams.set('sortOrder', sortOrder);

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/gears?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      return {
        success: false,
        data: null,
        meta: null,
        error:
          statusMessages[response.status] ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    const result = await response.json();

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data as GearItem[],
        meta: result.meta,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      meta: null,
      error: result.message ?? 'Failed to load gears.',
    };
  } catch {
    return {
      success: false,
      data: null,
      meta: null,
      error:
        'Unable to connect to the server. Please check your connection and try again.',
    };
  }
};
