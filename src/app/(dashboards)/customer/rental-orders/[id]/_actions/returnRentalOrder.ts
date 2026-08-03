'use server';

import { cookies } from 'next/headers';
import type { RentalOrder } from '@/lib/types';
import { isAccessTokenExist } from '@/app/(auth)/_actions/refreshTokenAction';

export interface RentalOrderResult {
  success: boolean;
  data: RentalOrder | null;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to return this rental order.',
  404: 'Rental order not found.',
};

export const returnRentalOrder = async (
  rentalId: string,
): Promise<RentalOrderResult> => {
  try {
    const accessToken = await isAccessTokenExist();

    const url = `${process.env.BACKEND_API_URL}/api/rentals/${rentalId}/return`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });

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
        data: result.data as RentalOrder,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: result.message ?? 'Failed to return rental order.',
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
