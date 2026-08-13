'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AlertCircle,
  CheckCircle2,
  LogIn,
  Minus,
  Plus,
  ShoppingCart,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { toast } from 'sonner';

import type { GearItem } from '@/lib/types';
import { formatBDT, parseGearImages } from '@/lib/gear-utils';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button, ButtonLink } from '@/components/ui/Button';

interface Props {
  gear: GearItem;
  onClose: () => void;
}

/** `YYYY-MM-DD` in the user's local timezone (not UTC - avoids off-by-one). */
function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function diffInDays(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.round(ms / 86_400_000);
}

interface FormErrors {
  startDate?: string;
  endDate?: string;
  quantity?: string;
}

export default function AddToCartModal({ gear, onClose }: Props) {
  const today = useMemo(() => toDateInputValue(new Date()), []);
  const defaultEnd = useMemo(() => {
    const end = new Date();
    end.setDate(end.getDate() + 3);
    return toDateInputValue(end);
  }, []);

  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.toggleCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const days = Math.max(diffInDays(startDate, endDate), 1);
  const total = Number(gear.price) * quantity * days;
  const image = parseGearImages(gear.images)[0];

  useEffect(() => {
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (!startDate) {
      next.startDate = 'Pick a start date.';
    } else if (startDate < today) {
      next.startDate = 'Start date cannot be in the past.';
    }

    if (!endDate) {
      next.endDate = 'Pick an end date.';
    } else if (diffInDays(startDate, endDate) < 1) {
      next.endDate = 'End date must be at least one day after the start date.';
    }

    if (quantity < 1) {
      next.quantity = 'Rent at least one unit.';
    } else if (quantity > gear.stock) {
      next.quantity = `Only ${gear.stock} unit${gear.stock === 1 ? '' : 's'} in stock.`;
    }

    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    // The cart is client-side state; the short delay keeps the loading state
    // legible instead of flashing for a single frame.
    window.setTimeout(() => {
      addItem(gear, quantity, startDate, endDate);
      setSubmitting(false);
      setSucceeded(true);
      toast.success(`${gear.name} added to your cart`);
    }, 350);
  };

  return (
    <div
      className='fixed inset-0 z-60 flex items-end justify-center p-0 sm:items-center sm:p-4'
      style={{ backgroundColor: 'var(--overlay)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby='add-to-cart-title'
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className='max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-card border border-border bg-card shadow-xl sm:rounded-card'
      >
        {/* Header */}
        <div className='flex items-start gap-3 border-b border-border p-5'>
          {/* Decorative thumbnail - the name beside it carries the meaning */}
          <Image
            src={image}
            alt=''
            width={56}
            height={56}
            unoptimized
            className='h-14 w-14 shrink-0 rounded-xl object-cover'
          />
          <div className='min-w-0 flex-1'>
            <h2
              id='add-to-cart-title'
              className='truncate text-base font-bold text-foreground'
            >
              {gear.name}
            </h2>
            <p className='mt-0.5 text-sm font-semibold text-primary'>
              {formatBDT(gear.price)}
              <span className='font-medium text-muted-foreground'> / day</span>
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type='button'
            onClick={onClose}
            aria-label='Close'
            className='-mt-1 -mr-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <AnimatePresence mode='wait' initial={false}>
          {succeeded ? (
            <motion.div
              key='success'
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className='flex flex-col items-center gap-4 p-8 text-center'
            >
              <span className='flex h-14 w-14 items-center justify-center rounded-full bg-secondary-soft'>
                <CheckCircle2 className='h-7 w-7 text-secondary' />
              </span>
              <div className='space-y-1'>
                <p className='text-base font-bold text-foreground'>
                  Added to your cart
                </p>
                <p className='text-sm text-muted-foreground'>
                  {quantity} × {gear.name} for {days} day{days === 1 ? '' : 's'}{' '}
                  - {formatBDT(total)} total.
                </p>
              </div>

              {isAuthenticated ? (
                <div className='grid w-full grid-cols-1 gap-2 sm:grid-cols-2'>
                  <Button variant='outline' fullWidth onClick={onClose}>
                    Keep browsing
                  </Button>
                  <Button
                    fullWidth
                    leadingIcon={<ShoppingCart className='h-4 w-4' />}
                    onClick={() => {
                      onClose();
                      openCart();
                    }}
                  >
                    Review cart
                  </Button>
                </div>
              ) : (
                <div className='w-full space-y-3'>
                  <p className='rounded-control bg-primary-soft px-3 py-2 text-xs font-medium text-primary-soft-foreground'>
                    Your cart is saved on this device. Sign in to turn it into a
                    rental order.
                  </p>
                  <div className='grid w-full grid-cols-1 gap-2 sm:grid-cols-2'>
                    <Button variant='outline' fullWidth onClick={onClose}>
                      Keep browsing
                    </Button>
                    <ButtonLink
                      href='/login'
                      fullWidth
                      leadingIcon={<LogIn className='h-4 w-4' />}
                    >
                      Sign in to checkout
                    </ButtonLink>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.form
              key='form'
              onSubmit={handleSubmit}
              noValidate
              initial={false}
              className='space-y-5 p-5'
            >
              {/* Dates */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div>
                  <label htmlFor='rental-start' className='field-label'>
                    Start date
                  </label>
                  <input
                    id='rental-start'
                    type='date'
                    value={startDate}
                    min={today}
                    aria-invalid={Boolean(errors.startDate)}
                    aria-describedby={
                      errors.startDate ? 'rental-start-error' : undefined
                    }
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setErrors((prev) => ({ ...prev, startDate: undefined }));
                    }}
                    className='field-input'
                  />
                  {errors.startDate && (
                    <p id='rental-start-error' className='field-error'>
                      <AlertCircle className='h-3.5 w-3.5 shrink-0' />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor='rental-end' className='field-label'>
                    End date
                  </label>
                  <input
                    id='rental-end'
                    type='date'
                    value={endDate}
                    min={startDate || today}
                    aria-invalid={Boolean(errors.endDate)}
                    aria-describedby={
                      errors.endDate ? 'rental-end-error' : undefined
                    }
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setErrors((prev) => ({ ...prev, endDate: undefined }));
                    }}
                    className='field-input'
                  />
                  {errors.endDate && (
                    <p id='rental-end-error' className='field-error'>
                      <AlertCircle className='h-3.5 w-3.5 shrink-0' />
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor='rental-qty' className='field-label'>
                  Quantity
                  <span className='ml-1.5 font-medium text-muted-foreground'>
                    ({gear.stock} in stock)
                  </span>
                </label>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center rounded-control border border-input-border'>
                    <button
                      type='button'
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label='Decrease quantity'
                      className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-control text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40'
                    >
                      <Minus className='h-4 w-4' />
                    </button>
                    <span
                      id='rental-qty'
                      className='w-10 text-center text-sm font-bold text-foreground'
                      aria-live='polite'
                    >
                      {quantity}
                    </span>
                    <button
                      type='button'
                      onClick={() =>
                        setQuantity((q) => Math.min(gear.stock, q + 1))
                      }
                      disabled={quantity >= gear.stock}
                      aria-label='Increase quantity'
                      className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-control text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40'
                    >
                      <Plus className='h-4 w-4' />
                    </button>
                  </div>

                  <p className='text-sm text-muted-foreground'>
                    {days} day{days === 1 ? '' : 's'} ·{' '}
                    <span className='font-bold text-foreground'>
                      {formatBDT(total)}
                    </span>{' '}
                    total
                  </p>
                </div>
                {errors.quantity && (
                  <p className='field-error'>
                    <AlertCircle className='h-3.5 w-3.5 shrink-0' />
                    {errors.quantity}
                  </p>
                )}
              </div>

              {/* Summary */}
              <dl className='space-y-1.5 rounded-control bg-muted p-4 text-sm'>
                <div className='flex justify-between'>
                  <dt className='text-muted-foreground'>Daily rate</dt>
                  <dd className='font-semibold text-foreground'>
                    {formatBDT(gear.price)}
                  </dd>
                </div>
                <div className='flex justify-between'>
                  <dt className='text-muted-foreground'>
                    {quantity} unit{quantity === 1 ? '' : 's'} × {days} day
                    {days === 1 ? '' : 's'}
                  </dt>
                  <dd className='font-semibold text-foreground'>
                    {quantity * days}
                  </dd>
                </div>
                <div className='flex justify-between border-t border-border pt-1.5'>
                  <dt className='font-bold text-foreground'>Total</dt>
                  <dd className='font-extrabold text-primary'>
                    {formatBDT(total)}
                  </dd>
                </div>
              </dl>

              <div className='grid grid-cols-2 gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  fullWidth
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  fullWidth
                  loading={submitting}
                  loadingText='Adding…'
                  leadingIcon={<ShoppingCart className='h-4 w-4' />}
                >
                  Add to Cart
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
