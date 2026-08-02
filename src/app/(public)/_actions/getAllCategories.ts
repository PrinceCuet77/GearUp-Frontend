'use server';

import { cookies } from 'next/headers';
import type {
  Category,
  CategoriesResult,
} from '@/lib/types';

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to view categories.',
  404: 'Categories not found. Please try again later.',
};

export const getAllCategoriesAction = async (): Promise<CategoriesResult> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/categoriess`,
      {
        method: 'GET',
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return {
        success: false,
        data: null,
        error:
          statusMessages[response.status] ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    const result = await response.json();

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data as Category[],
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: result.message ?? 'Failed to load categories.',
    };
  } catch {
    return {
      success: false,
      data: null,
      error:
        'Unable to connect to the server. Please check your connection and try again.',
    };
  }
};
