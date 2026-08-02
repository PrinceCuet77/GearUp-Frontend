'use server';

import { cookies } from 'next/headers';

export interface ToggleStatusResult {
  success: boolean;
  message: string;
}

export const changeUserStatus = async (
  userId: string,
  status: 'SUSPENDED' | 'ACTIVE',
): Promise<ToggleStatusResult> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'You are not logged in.',
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/admin/user/${userId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `accessToken=${accessToken}`,
        },
        body: JSON.stringify({ status }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          result.message ??
          `Failed to toggle user status (error ${response.status}).`,
      };
    }

    return {
      success: true,
      message: result.message ?? 'User status updated successfully.',
    };
  } catch {
    return {
      success: false,
      message: 'Unable to connect to the server. Please try again.',
    };
  }
};
