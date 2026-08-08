'use server';

import { isAccessTokenExist } from '@/app/(auth)/_actions/refreshTokenAction';

export interface CategoryData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  gearItems?: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    images: string;
    isActive: boolean;
    providerId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface UpdateCategoryResult {
  success: boolean;
  data: CategoryData | null;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to update categories.',
  404: 'Category not found.',
  409: 'A category with this name already exists.',
};

export const updateCategory = async (
  categoryId: string,
  name: string,
  description: string,
): Promise<UpdateCategoryResult> => {
  try {
    const accessToken = await isAccessTokenExist();

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/admin/categories/${categoryId}`,
      {
        method: 'PATCH',
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
      error: result.message ?? 'Failed to update category.',
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
