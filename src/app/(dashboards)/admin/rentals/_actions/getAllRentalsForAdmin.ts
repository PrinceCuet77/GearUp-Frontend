'use server';

import { cookies } from 'next/headers';
import type { AdminRentalsResult } from '@/lib/types';

export interface AdminRentalsParams {
  status?: string;
  customerId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: string;
  maxAmount?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to view rental orders.',
  400: 'Invalid filters. Please adjust your search and try again.',
};

export const getAllRentalsForAdmin = async (
  params: AdminRentalsParams = {},
): Promise<AdminRentalsResult> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return {
        success: false,
        data: null,
        meta: null,
        error: 'You are not logged in. Please log in to view rental orders.',
      };
    }

    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.customerId) query.set('customerId', params.customerId);
    if (params.search) query.set('search', params.search);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.minAmount) query.set('minAmount', params.minAmount);
    if (params.maxAmount) query.set('maxAmount', params.maxAmount);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const qs = query.toString();
    const url = `${process.env.BACKEND_API_URL}/api/admin/rentals${qs ? `?${qs}` : ''}`;

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
      data: null,
      meta: null,
      error: result.message ?? 'Failed to load rental orders.',
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
