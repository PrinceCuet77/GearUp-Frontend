'use server';

import { cookies } from 'next/headers';
import type { Category } from '@/lib/types';

export interface GetCategoriesResult {
  success: boolean;
  data: Category[];
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to view categories.',
};

export const getCategories = async (): Promise<GetCategoriesResult> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return {
        success: false,
        data: [],
        error: 'You are not logged in. Please log in again.',
      };
    }

    const url = `${process.env.BACKEND_API_URL}/api/categories`;

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
        error:
          statusMessages[response.status] ??
          `Failed to load categories (error ${response.status}).`,
      };
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data,
        error: null,
      };
    }

    return {
      success: false,
      data: [],
      error: result.message ?? 'Failed to load categories.',
    };
  } catch {
    return {
      success: false,
      data: [],
      error:
        'Unable to connect to the server. Please check your connection and try again.',
    };
  }
};
