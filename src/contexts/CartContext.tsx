'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { GearItem } from '@/lib/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  gear: GearItem;
  quantity: number;
  startDate: string; // ISO date string  e.g. "2024-05-01"
  endDate: string; // ISO date string  e.g. "2024-05-05"
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    gear: GearItem,
    quantity: number,
    startDate: string,
    endDate: string,
  ) => void;
  removeItem: (gearId: string) => void;
  updateQuantity: (gearId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number; // total across all items × days × qty
}

// ── Context ───────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysBetween(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(days, 1);
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const addItem = useCallback(
    (gear: GearItem, quantity: number, startDate: string, endDate: string) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.gear.id === gear.id);
        if (existing) {
          return prev.map((i) =>
            i.gear.id === gear.id
              ? { ...i, quantity: i.quantity + quantity, startDate, endDate }
              : i,
          );
        }
        return [...prev, { gear, quantity, startDate, endDate }];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback((gearId: string) => {
    setItems((prev) => prev.filter((i) => i.gear.id !== gearId));
  }, []);

  const updateQuantity = useCallback((gearId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.gear.id === gearId ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = items.reduce((sum, i) => {
    const days = daysBetween(i.startDate, i.endDate);
    return sum + Number(i.gear.price) * i.quantity * days;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
