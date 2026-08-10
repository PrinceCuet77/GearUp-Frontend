'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  X,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useRentalStore } from '@/store/useRentalStore';
import {
  formatBDT,
  parseGearImages,
  GEAR_IMAGE_FALLBACK,
} from '@/lib/gear-utils';
import { Button, ButtonLink } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

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

/** Cart line thumbnail with a local fallback (no remote placeholder host). */
function CartItemImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-control bg-muted'>
      <Image
        src={failed ? GEAR_IMAGE_FALLBACK : src}
        alt={alt}
        fill
        sizes='80px'
        className='object-cover'
        onError={() => setFailed(true)}
      />
    </div>
  );
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
          style={{ backgroundColor: 'var(--overlay)' }}
          onClick={closeCart}
          aria-hidden='true'
        />
      )}

      {/* Sidebar panel */}
      <div
        role='dialog'
        aria-modal='true'
        aria-label='Shopping cart'
        aria-hidden={!isOpen}
        // Keeps the offscreen panel out of the tab order while closed.
        inert={!isOpen}
        className={cn(
          'fixed top-0 right-0 z-50 flex h-full w-full flex-col border-l border-border bg-card transition-transform duration-300 ease-out sm:w-[420px]',
          isOpen ? 'translate-x-0 shadow-xl' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className='flex shrink-0 items-center justify-between border-b border-border px-5 py-4'>
          <div className='flex items-center gap-2.5'>
            <ShoppingCart className='h-5 w-5 text-primary' aria-hidden='true' />
            <h2 className='text-base font-bold text-foreground'>Your Cart</h2>
            {itemCount > 0 && (
              <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground'>
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label='Close cart'
            className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* Body */}
        <div className='flex-1 overflow-y-auto'>
          {items.length === 0 ? (
            /* Empty state */
            <div className='flex flex-col items-center justify-center px-6 py-20 text-center'>
              <span className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted'>
                <ShoppingBag
                  className='h-8 w-8 text-muted-foreground'
                  aria-hidden='true'
                />
              </span>
              <p className='mb-1 text-base font-bold text-foreground'>
                Your cart is empty
              </p>
              <p className='mb-6 text-sm text-muted-foreground'>
                Browse available gear and add items to get started.
              </p>
              <ButtonLink
                href='/gears'
                onClick={closeCart}
                trailingIcon={<ArrowRight className='h-4 w-4' />}
              >
                Browse Gear
              </ButtonLink>
            </div>
          ) : (
            <ul className='divide-y divide-border'>
              {items.map((item) => {
                const days = daysBetween(item.startDate, item.endDate);
                const itemTotal =
                  Number(item.gear.price) * item.quantity * days;

                return (
                  <li key={item.gear.id} className='p-5'>
                    <div className='flex gap-4'>
                      <CartItemImage
                        src={parseGearImages(item.gear.images)[0]}
                        alt={item.gear.name}
                      />

                      {/* Info */}
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-start justify-between gap-2'>
                          <p className='line-clamp-2 text-sm leading-tight font-semibold text-foreground'>
                            {item.gear.name}
                          </p>
                          <button
                            onClick={() => removeItem(item.gear.id)}
                            aria-label={`Remove ${item.gear.name} from cart`}
                            className='shrink-0 cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-danger'
                          >
                            <Trash2 className='h-3.5 w-3.5' />
                          </button>
                        </div>

                        {/* Dates */}
                        <p className='mt-1 text-xs text-muted-foreground'>
                          {formatDate(item.startDate)} →{' '}
                          {formatDate(item.endDate)} · {days} day
                          {days !== 1 ? 's' : ''}
                        </p>

                        {/* Price */}
                        <p className='mt-0.5 text-xs text-muted-foreground'>
                          {formatBDT(Number(item.gear.price))}/day
                        </p>

                        {/* Quantity + total */}
                        <div className='mt-3 flex items-center justify-between gap-3'>
                          <div className='flex items-center gap-1 rounded-control border border-border'>
                            <button
                              onClick={() =>
                                updateQuantity(item.gear.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              aria-label='Decrease quantity'
                              className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-l-control text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40'
                            >
                              <Minus className='h-3 w-3' />
                            </button>
                            <span className='w-7 text-center text-sm font-semibold text-foreground'>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.gear.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.gear.stock}
                              aria-label='Increase quantity'
                              className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-r-control text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40'
                            >
                              <Plus className='h-3 w-3' />
                            </button>
                          </div>

                          <span className='text-sm font-bold text-foreground'>
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
          <div className='shrink-0 border-t border-border p-5'>
            {/* Subtotal */}
            <div className='mb-4 space-y-2'>
              <div className='flex items-center justify-between gap-3'>
                <span className='text-sm text-muted-foreground'>
                  {itemCount} item{itemCount !== 1 ? 's' : ''}
                </span>
                <span className='text-lg font-bold text-foreground'>
                  {formatBDT(subtotal)}
                </span>
              </div>
              <p className='text-xs text-muted-foreground'>
                Prices include all rental days. Payment processed after provider
                confirms.
              </p>
            </div>

            {/* CTA */}
            <Button
              onClick={handleCreateOrder}
              fullWidth
              loading={isCreating}
              loadingText='Creating Order…'
              trailingIcon={<ArrowRight className='h-4 w-4' />}
            >
              Create Rental Order
            </Button>

            <Button
              variant='ghost'
              size='sm'
              fullWidth
              onClick={clearCart}
              className='mt-2 hover:text-danger'
            >
              Clear cart
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
