'use server';

import { cookies } from 'next/headers';
import type { UserProfile, ProfileResult } from '@/lib/types';

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to view this profile.',
  404: 'Profile not found. Please try again later.',
};

export const getProfileAction = async (): Promise<ProfileResult> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return {
        success: false,
        data: null,
        error: 'You are not logged in. Please log in to view your profile.',
      };
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/api/user/me`, {
      method: 'GET',
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
        data: result.data as UserProfile,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      error: result.message ?? 'Failed to load profile data.',
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
