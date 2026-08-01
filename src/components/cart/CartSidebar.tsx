'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useRentalStore } from '@/store/useRentalStore';
import { formatBDT, parseGearImages } from '@/lib/gear-utils';

function daysBetween(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(Math.ceil(ms / (1000 * 60 * 60 * 24)), 1);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Dhaka',
  });
}

export function CartSidebar() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.subtotal());
  const itemCount = useCartStore((s) => s.itemCount());
  const { createOrder, isCreating } = useRentalStore();
  const router = useRouter();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeCart]);

  const handleCreateOrder = async () => {
    if (items.length === 0) return;

    // Find the earliest start date and latest end date across all items
    const startDate = items.reduce(
      (earliest, item) =>
        item.startDate < earliest ? item.startDate : earliest,
      items[0].startDate,
    );
    const endDate = items.reduce(
      (latest, item) => (item.endDate > latest ? item.endDate : latest),
      items[0].endDate,
    );

    const payload = {
      startDate,
      endDate,
      items: items.map((item) => ({
        gearItemId: item.gear.id,
        quantity: item.quantity,
      })),
    };

    const success = await createOrder(payload);

    if (success) {
      // Read directly from store since React hasn't re-rendered yet
      const orderId = useRentalStore.getState().lastCreatedOrder?.id;
      toast.success('Rental order created successfully!');
      clearCart();
      closeCart();
      if (orderId) {
        router.push(`/customer/rental-orders/${orderId}`);
      }
    } else {
      toast.error('Failed to create rental order. Please try again.');
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeCart}
          aria-hidden='true'
        />
      )}

      {/* Sidebar panel */}
      <div
        role='dialog'
        aria-modal='true'
        aria-label='Shopping cart'
        className='fixed right-0 top-0 z-50 flex h-full w-full flex-col sm:w-[420px]'
        style={{
          backgroundColor: 'var(--card)',
          borderLeft: '1px solid var(--border)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? '-8px 0 32px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        {/* Header */}
        <div
          className='flex shrink-0 items-center justify-between border-b px-5 py-4'
          style={{ borderColor: 'var(--border)' }}
        >
          <div className='flex items-center gap-2.5'>
            <ShoppingCart
              className='h-5 w-5'
              style={{ color: 'var(--primary)' }}
            />
            <h2
              className='text-base font-bold'
              style={{ color: 'var(--foreground)' }}
            >
              Your Cart
            </h2>
            {itemCount > 0 && (
              <span
                className='flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white'
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label='Close cart'
            className='flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer'
            style={{ color: 'var(--muted-foreground)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--muted)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* Body */}
        <div className='flex-1 overflow-y-auto'>
          {items.length === 0 ? (
            /* Empty state */
            <div className='flex flex-col items-center justify-center py-20 px-6 text-center'>
              <div
                className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl'
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <ShoppingBag
                  className='h-8 w-8'
                  style={{ color: 'var(--muted-foreground)' }}
                />
              </div>
              <p
                className='mb-1 text-base font-semibold'
                style={{ color: 'var(--foreground)' }}
              >
                Your cart is empty
              </p>
              <p
                className='mb-6 text-sm'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Browse available gear and add items to get started.
              </p>
              <Link
                href='/gears'
                onClick={closeCart}
                className='inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-colors'
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Browse Gear
                <ArrowRight className='h-4 w-4' />
              </Link>
            </div>
          ) : (
            <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
              {items.map((item) => {
                const days = daysBetween(item.startDate, item.endDate);
                const itemTotal =
                  Number(item.gear.price) * item.quantity * days;

                return (
                  <li key={item.gear.id} className='p-5'>
                    <div className='flex gap-4'>
                      {/* Thumbnail */}
                      <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-xl'>
                        <Image
                          src={parseGearImages(item.gear.images)[0]}
                          alt={item.gear.name}
                          fill
                          sizes='80px'
                          className='object-cover'
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            img.src =
                              'https://placehold.co/80x80/e2e8f0/94a3b8?text=Gear';
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-start justify-between gap-2'>
                          <p
                            className='line-clamp-2 text-sm font-semibold leading-tight'
                            style={{ color: 'var(--foreground)' }}
                          >
                            {item.gear.name}
                          </p>
                          <button
                            onClick={() => removeItem(item.gear.id)}
                            aria-label='Remove item'
                            className='shrink-0 rounded p-1 transition-colors cursor-pointer'
                            style={{ color: 'var(--muted-foreground)' }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = '#ef4444')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color =
                                'var(--muted-foreground)')
                            }
                          >
                            <Trash2 className='h-3.5 w-3.5' />
                          </button>
                        </div>

                        {/* Dates */}
                        <p
                          className='mt-1 text-xs'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {formatDate(item.startDate)} →{' '}
                          {formatDate(item.endDate)} · {days} day
                          {days !== 1 ? 's' : ''}
                        </p>

                        {/* Price */}
                        <p
                          className='mt-0.5 text-xs'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {formatBDT(Number(item.gear.price))}/day
                        </p>

                        {/* Quantity + total */}
                        <div className='mt-3 flex items-center justify-between'>
                          <div
                            className='flex items-center gap-1 rounded-lg border'
                            style={{ borderColor: 'var(--border)' }}
                          >
                            <button
                              onClick={() =>
                                updateQuantity(item.gear.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className='flex h-7 w-7 items-center justify-center rounded-l-lg transition-colors disabled:opacity-40 cursor-pointer'
                              style={{ color: 'var(--foreground)' }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  'var(--muted)')
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  'transparent')
                              }
                            >
                              <Minus className='h-3 w-3' />
                            </button>
                            <span
                              className='w-7 text-center text-sm font-semibold'
                              style={{ color: 'var(--foreground)' }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.gear.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.gear.stock}
                              className='flex h-7 w-7 items-center justify-center rounded-r-lg transition-colors disabled:opacity-40 cursor-pointer'
                              style={{ color: 'var(--foreground)' }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  'var(--muted)')
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  'transparent')
                              }
                            >
                              <Plus className='h-3 w-3' />
                            </button>
                          </div>

                          <span
                            className='text-sm font-bold'
                            style={{ color: 'var(--foreground)' }}
                          >
                            {formatBDT(itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className='shrink-0 border-t p-5'
            style={{ borderColor: 'var(--border)' }}
          >
            {/* Subtotal */}
            <div className='mb-4 space-y-2'>
              <div className='flex items-center justify-between'>
                <span
                  className='text-sm'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {itemCount} item{itemCount !== 1 ? 's' : ''}
                </span>
                <span
                  className='text-lg font-bold'
                  style={{ color: 'var(--foreground)' }}
                >
                  {formatBDT(subtotal)}
                </span>
              </div>
              <p
                className='text-xs'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Prices include all rental days. Payment processed after provider
                confirms.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={handleCreateOrder}
              disabled={isCreating}
              className='flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-60 cursor-pointer'
              style={{ backgroundColor: 'var(--primary)' }}
              onMouseEnter={(e) => {
                if (!isCreating)
                  e.currentTarget.style.backgroundColor =
                    'var(--primary-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
              }}
            >
              {isCreating ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Creating Order…
                </>
              ) : (
                <>
                  Create Rental Order
                  <ArrowRight className='h-4 w-4' />
                </>
              )}
            </button>

            <button
              onClick={clearCart}
              className='mt-2 w-full py-2 text-xs font-medium transition-colors cursor-pointer'
              style={{ color: 'var(--muted-foreground)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--muted-foreground)')
              }
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
