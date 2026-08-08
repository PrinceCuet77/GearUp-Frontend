'use server';

import { isAccessTokenExist } from '@/app/(auth)/_actions/refreshTokenAction';

export interface RentalOrderItemInput {
  gearItemId: string;
  quantity: number;
}

export interface CreateRentalOrderPayload {
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  items: RentalOrderItemInput[];
}

export interface RentalOrderItemResponse {
  id: string;
  quantity: number;
  price: string;
  rentalOrderId: string;
  gearItemId: string;
  gearItem: {
    id: string;
    name: string;
    price: string;
    images: string;
  };
}

export interface RentalOrderResponse {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  items: RentalOrderItemResponse[];
}

export interface CreateRentalOrderResult {
  success: boolean;
  data: RentalOrderResponse | null;
  error: string | null;
}

export const createRentalOrder = async (
  payload: CreateRentalOrderPayload,
): Promise<CreateRentalOrderResult> => {
  try {
    const accessToken = await isAccessTokenExist();

    if (!payload.items.length) {
      return {
        success: false,
        data: null,
        error: 'Your cart is empty. Please add at least one item.',
      };
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        data: null,
        error:
          result.message ??
          `Failed to create rental order (error ${response.status}).`,
      };
    }

    return {
      success: true,
      data: result.data as RentalOrderResponse,
      error: null,
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
