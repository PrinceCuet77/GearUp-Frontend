'use server';

import { cookies } from 'next/headers';
import type { GearItem } from '@/lib/api';

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

export interface GearsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GearItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getAllGearsAction = async (
  params: GetGearsParams = {},
): Promise<GearsApiResponse | null> => {
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
      return result as GearsApiResponse;
    }

    return null;
  } catch {
    return null;
  }
};
