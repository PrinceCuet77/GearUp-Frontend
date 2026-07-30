'use server';

import { cookies } from 'next/headers';
import type { Category } from '@/lib/api';

export interface CategoriesApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category[];
}

export const getAllCategoriesAction =
  async (): Promise<CategoriesApiResponse | null> => {
    try {
      const cookie = await cookies();
      const accessToken = cookie.get('accessToken')?.value;

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/api/categories`,
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
        return result as CategoriesApiResponse;
      }

      return null;
    } catch {
      return null;
    }
  };
