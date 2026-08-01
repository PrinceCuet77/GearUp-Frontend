'use server';

import { cookies } from 'next/headers';
import type { RentalOrder, ApiMeta } from '@/lib/types';

export interface RentalOrdersResult {
  success: boolean;
  data: RentalOrder[];
  meta: ApiMeta | null;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to view rental orders.',
  404: 'Rental orders not found.',
};

export const getAllRentalOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<RentalOrdersResult> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return {
        success: false,
        data: [],
        meta: null,
        error: 'You are not logged in. Please log in to view your rental orders.',
      };
    }

    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);

    const queryString = query.toString();
    const url = `${process.env.BACKEND_API_URL}/api/rentals${queryString ? `?${queryString}` : ''}`;

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
        data: result.data as RentalOrder[],
        meta: result.meta ?? null,
        error: null,
      };
    }

    return {
      success: false,
      data: [],
      meta: null,
      error: result.message ?? 'Failed to load rental orders.',
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
