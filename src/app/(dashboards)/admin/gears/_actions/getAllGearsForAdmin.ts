'use server';

import { cookies } from 'next/headers';
import type { GearsApiResponse, GearsResult } from '@/lib/types';

export interface AdminGearsParams {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to view gear listings.',
  404: 'Gear data not found. Please try again later.',
};

export const getAllGearsForAdmin = async (
  params: AdminGearsParams = {},
): Promise<GearsResult> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return {
        success: false,
        data: null,
        meta: null,
        error: 'You are not logged in. Please log in to view gear listings.',
      };
    }

    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.minPrice) query.set('minPrice', params.minPrice);
    if (params.maxPrice) query.set('maxPrice', params.maxPrice);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const qs = query.toString();
    const url = `${process.env.BACKEND_API_URL}/api/admin/gears${qs ? `?${qs}` : ''}`;

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
        data: null,
        meta: null,
        error:
          statusMessages[response.status] ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    const result: GearsApiResponse = await response.json();

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
        meta: result.meta ?? null,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      meta: null,
      error: result.message ?? 'Failed to load gear listings.',
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
