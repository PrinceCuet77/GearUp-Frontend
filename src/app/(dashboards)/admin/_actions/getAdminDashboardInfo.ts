'use server';

import { cookies } from 'next/headers';

export interface AdminDashboardInfo {
  stats: {
    totalUsers: number;
    activeGears: number;
    totalRentals: number;
    totalCategories: number;
  };
}

export const getAdminDashboardInfo = async (): Promise<any | null> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return null;
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/admin/dashboard`,
      {
        method: 'GET',
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data as AdminDashboardInfo;
    }

    return null;
  } catch {
    return null;
  }
};
