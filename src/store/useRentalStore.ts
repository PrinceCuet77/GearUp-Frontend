'use client';

import { create } from 'zustand';
import { createRentalOrder } from '@/app/(public)/gears/[id]/_actions/createRentalOrder';
import type {
  CreateRentalOrderPayload,
  RentalOrderResponse,
} from '@/app/(public)/gears/[id]/_actions/createRentalOrder';

interface RentalState {
  isCreating: boolean;
  lastCreatedOrder: RentalOrderResponse | null;
  error: string | null;

  /** Send the rental order to the backend via the server action. */
  createOrder: (payload: CreateRentalOrderPayload) => Promise<boolean>;

  /** Clear any previous error message. */
  clearError: () => void;
}

export const useRentalStore = create<RentalState>((set) => ({
  isCreating: false,
  lastCreatedOrder: null,
  error: null,

  createOrder: async (payload) => {
    set({ isCreating: true, error: null });

    const result = await createRentalOrder(payload);

    if (result.success) {
      set({ isCreating: false, lastCreatedOrder: result.data });
      return true;
    }

    set({ isCreating: false, error: result.error });
    return false;
  },

  clearError: () => set({ error: null }),
}));
