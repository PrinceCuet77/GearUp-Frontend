'use server';

import { isAccessTokenExist } from '@/app/(auth)/_actions/refreshTokenAction';
import { cookies } from 'next/headers';

export interface PaymentResult {
  success: boolean;
  gatewayPageURL: string | null;
  transactionId: string | null;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to create this payment.',
  404: 'Rental order not found.',
};

export const createPayment = async (
  rentalId: string,
): Promise<PaymentResult> => {
  try {
    const accessToken = await isAccessTokenExist();

    const url = `${process.env.BACKEND_API_URL}/api/payments/create`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({ rentalOrderId: rentalId }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        success: false,
        gatewayPageURL: null,
        transactionId: null,
        error:
          statusMessages[response.status] ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    const result = await response.json();

    if (result.success && result.data) {
      return {
        success: true,
        gatewayPageURL: result.data.gatewayPageURL,
        transactionId: result.data.transactionId,
        error: null,
      };
    }

    return {
      success: false,
      gatewayPageURL: null,
      transactionId: null,
      error: result.message ?? 'Failed to initiate payment.',
    };
  } catch {
    return {
      success: false,
      gatewayPageURL: null,
      transactionId: null,
      error:
        'Unable to connect to the server. Please check your connection and try again.',
    };
  }
};
