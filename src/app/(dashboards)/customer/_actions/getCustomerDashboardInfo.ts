'use server';

import { cookies } from 'next/headers';

export interface CustomerRentalOrder {
  id: string;
  customerId: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDashboardInfo {
  stats: {
    totalOrders: number;
    activeRentals: number;
    paymentsMade: number;
    reviewsGiven: number;
  };
  recentOrders: CustomerRentalOrder[];
}

export interface CustomerDashboardResult {
  success: boolean;
  data: CustomerDashboardInfo | null;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to view this dashboard.',
  404: 'Dashboard data not found. Please try again later.',
};

export const getCustomerDashboardInfo =
  async (): Promise<CustomerDashboardResult> => {
    try {
      const cookie = await cookies();
      const accessToken = cookie.get('accessToken')?.value;

      if (!accessToken) {
        return {
          success: false,
          data: null,
          error: 'You are not logged in. Please log in to view your dashboard.',
        };
      }

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/api/user/dashboard`,
        {
          method: 'GET',
          headers: {
            Cookie: `accessToken=${accessToken}`,
          },
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
          data: result.data as CustomerDashboardInfo,
          error: null,
        };
      }

      return {
        success: false,
        data: null,
        error: result.message ?? 'Failed to load dashboard data.',
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
