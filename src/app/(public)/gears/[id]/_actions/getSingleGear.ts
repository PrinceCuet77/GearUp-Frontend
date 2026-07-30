'use server';

import { cookies } from 'next/headers';
import type { GearItem } from '@/lib/types';

export interface SingleGearApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GearItem;
}

export const getSingleGearAction = async (
  gearId: string,
): Promise<SingleGearApiResponse | null> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/gears/${gearId}`,
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
      return result as SingleGearApiResponse;
    }

    return null;
  } catch {
    return null;
  }
};
