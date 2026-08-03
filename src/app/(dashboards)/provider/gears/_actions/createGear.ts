'use server';

import { cookies } from 'next/headers';
import type { GearItem } from '@/lib/types';
import { isAccessTokenExist } from '@/app/(auth)/_actions/refreshTokenAction';

export interface CreateGearResult {
  success: boolean;
  data: GearItem | null;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to create gear.',
  409: 'A gear with this name already exists.',
};

export const createGear = async (params: {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string;
  categoryId: string;
}): Promise<CreateGearResult> => {
  try {
    const accessToken = await isAccessTokenExist();

    const url = `${process.env.BACKEND_API_URL}/api/provider/gears`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({
        name: params.name,
        description: params.description,
        price: params.price,
        stock: params.stock,
        images: params.images,
        categoryId: params.categoryId,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        data: null,
        error:
          statusMessages[response.status] ??
          result.message ??
          `Failed to create gear (error ${response.status}). Please try again later.`,
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
      data: null,
      error: result.message ?? 'Failed to create gear.',
    };
  } catch {
    return {
      success: false,
      data: null,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
};
