'use server';

import { isAccessTokenExist } from '@/app/(auth)/_actions/refreshTokenAction';

export interface CategoryData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryResult {
  success: boolean;
  data: CategoryData | null;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to create categories.',
  409: 'A category with this name already exists.',
};

export const createCategory = async (
  name: string,
  description: string,
): Promise<CreateCategoryResult> => {
  try {
    const accessToken = await isAccessTokenExist();

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/admin/categories`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `accessToken=${accessToken}`,
        },
        body: JSON.stringify({ name, description }),
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
        data: result.data as CategoryData,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: result.message ?? 'Failed to create category.',
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
