'use server';

import { cookies } from 'next/headers';
import type { RentalOrder } from '@/lib/types';

export interface UpdateRentalOrderResult {
  success: boolean;
  data: RentalOrder | null;
  error: string | null;
}

export const updateRentalOrderForProvider = async (
  rentalId: string,
  status: string,
): Promise<UpdateRentalOrderResult> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return {
        success: false,
        data: null,
        error: 'You are not logged in. Please log in again.',
      };
    }

    const url = `${process.env.BACKEND_API_URL}/api/provider/orders/${rentalId}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({ status }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        data: null,
        error:
          errorData?.message ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data as RentalOrder,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: result.message ?? 'Failed to update rental order.',
    };
  } catch {
    return {
      success: false,
      data: null,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
};
