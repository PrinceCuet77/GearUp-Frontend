'use server';

import { cookies } from 'next/headers';

export interface DeleteGearResult {
  success: boolean;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to delete this gear.',
  404: 'Gear not found.',
};

export const deleteGear = async (gearId: string): Promise<DeleteGearResult> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return {
        success: false,
        error: 'You are not logged in. Please log in again.',
      };
    }

    const url = `${process.env.BACKEND_API_URL}/api/provider/gears/${gearId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error:
          statusMessages[response.status] ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    const result = await response.json();

    if (result.success) {
      return { success: true, error: null };
    }

    return {
      success: false,
      error: result.message ?? 'Failed to delete gear.',
    };
  } catch {
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
};
