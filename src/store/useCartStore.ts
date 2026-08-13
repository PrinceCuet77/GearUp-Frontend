'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GearItem } from '@/lib/types';

/* ── Types ──────────────────────────────────────────────────────────────────── */

export interface CartItem {
  gear: GearItem;
  quantity: number;
  startDate: string;
  endDate: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  _hasHydrated: boolean;

  setHasHydrated: (v: boolean) => void;

  addItem: (
    gear: GearItem,
    quantity: number,
    startDate: string,
    endDate: string,
  ) => void;
  removeItem: (gearId: string) => void;
  updateQuantity: (gearId: string, quantity: number) => void;
  clearCart: () => void;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  /* Derived - computed on the fly so they stay in sync */
  itemCount: () => number;
  subtotal: () => number;
}

/* ── Helpers ─────────────────────────────────────────────────────────────────── */

function daysBetween(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(Math.ceil(ms / (1000 * 60 * 60 * 24)), 1);
}

/* ── Store ───────────────────────────────────────────────────────────────────── */

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      _hasHydrated: false,

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      addItem: (gear, quantity, startDate, endDate) => {
        set((state) => {
          const existing = state.items.find((i) => i.gear.id === gear.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.gear.id === gear.id
                  ? {
                      ...i,
                      quantity: i.quantity + quantity,
                      startDate,
                      endDate,
                    }
                  : i,
              ),
            };
          }
          return {
            items: [...state.items, { gear, quantity, startDate, endDate }],
          };
        });
      },

      removeItem: (gearId) =>
        set((state) => ({
          items: state.items.filter((i) => i.gear.id !== gearId),
        })),

      updateQuantity: (gearId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.gear.id === gearId ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => {
          const days = daysBetween(i.startDate, i.endDate);
          return sum + Number(i.gear.price) * i.quantity * days;
        }, 0),
    }),
    {
      name: 'gearup-cart',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
