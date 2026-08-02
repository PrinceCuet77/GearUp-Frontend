'use server';

import { cookies } from 'next/headers';
import type { GearItem, ApiMeta } from '@/lib/types';

export interface ProviderGearsResult {
  success: boolean;
  data: GearItem[];
  meta: ApiMeta | null;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to view your listed gears.',
  404: 'Gears not found.',
};

export const getSelfListedAllGearsByProvider = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<ProviderGearsResult> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return {
        success: false,
        data: [],
        meta: null,
        error:
          'You are not logged in. Please log in to view your listed gears.',
      };
    }

    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.category) query.set('category', params.category);
    if (params?.minPrice !== undefined && params.minPrice !== null)
      query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined && params.maxPrice !== null)
      query.set('maxPrice', String(params.maxPrice));
    if (params?.search) query.set('search', params.search);
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    if (params?.sortOrder) query.set('sortOrder', params.sortOrder);

    const queryString = query.toString();
    const url = `${process.env.BACKEND_API_URL}/api/provider/gears${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        success: false,
        data: [],
        meta: null,
        error:
          statusMessages[response.status] ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data,
        meta: result.meta ?? null,
        error: null,
      };
    }

    return {
      success: false,
      data: [],
      meta: null,
      error: result.message ?? 'Failed to load your listed gears.',
    };
  } catch {
    return {
      success: false,
      data: [],
      meta: null,
      error:
        'Unable to connect to the server. Please check your connection and try again.',
    };
  }
};
