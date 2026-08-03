'use server';

import { isAccessTokenExist } from '@/app/(auth)/_actions/refreshTokenAction';
import { cookies } from 'next/headers';

export interface ChangePasswordResult {
  success: boolean;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to change this password.',
  404: 'User not found.',
};

export const changePassword = async (payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<ChangePasswordResult> => {
  try {
    const accessToken = await isAccessTokenExist();

    const url = `${process.env.BACKEND_API_URL}/api/user/me/password`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          result.message ??
          statusMessages[response.status] ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    if (result.success) {
      return { success: true, error: null };
    }

    return {
      success: false,
      error: result.message ?? 'Unexpected response from server.',
    };
  } catch {
    return {
      success: false,
      error:
        'A network error occurred. Please check your connection and try again.',
    };
  }
};
