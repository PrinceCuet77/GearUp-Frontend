'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import { AlertCircle, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import type { GearItem } from '@/lib/types';
import { formatBDT, parseGearImages } from '@/lib/gear-utils';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';

interface RentalCreateFormProps {
  gear: GearItem;
  onSuccess: () => void;
}

function toLocalDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function RentalCreateForm({ gear, onSuccess }: RentalCreateFormProps) {
  const today = toLocalDateStr(new Date());
  const defaultEnd = toLocalDateStr(addDays(new Date(), 3));

  const startId = useId();
  const endId = useId();
  const qtyId = useId();

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);

  const days = Math.max(
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000,
    ),
    1,
  );
  const total = Number(gear.price) * qty * days;
  const datesInvalid = new Date(endDate) <= new Date(startDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (datesInvalid) {
      setError('End date must be after the start date.');
      return;
    }
    if (qty < 1 || qty > gear.stock) {
      setError(`Choose a quantity between 1 and ${gear.stock}.`);
      return;
    }

    setError(null);
    addItem(gear, qty, startDate, endDate);
    toast.success(`${gear.name} added to cart!`);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-5' noValidate>
      {/* Item summary */}
      <div className='flex items-center gap-3 rounded-control border border-border bg-muted p-3'>
        <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-control'>
          <Image
            src={parseGearImages(gear.images)[0]}
            alt={gear.name}
            fill
            className='object-cover'
            sizes='56px'
          />
        </div>
        <div className='min-w-0'>
          <p className='truncate text-sm font-semibold text-foreground'>
            {gear.name}
          </p>
          <p className='text-sm font-bold text-primary'>
            {formatBDT(gear.price)}
            <span className='text-xs font-normal text-muted-foreground'>
              /day
            </span>
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <label htmlFor={startId} className='field-label'>
            Start date
          </label>
          <input
            id={startId}
            type='date'
            value={startDate}
            min={today}
            onChange={(e) => {
              setStartDate(e.target.value);
              setError(null);
            }}
            className='field-input'
            required
          />
        </div>
        <div>
          <label htmlFor={endId} className='field-label'>
            End date
          </label>
          <input
            id={endId}
            type='date'
            value={endDate}
            min={startDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setError(null);
            }}
            className='field-input'
            aria-invalid={datesInvalid}
            required
          />
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label htmlFor={qtyId} className='field-label'>
          Quantity
        </label>
        <div className='flex items-center gap-3'>
          <Button
            type='button'
            variant='outline'
            size='md'
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label='Decrease quantity'
            className='w-11 px-0'
          >
            <Minus className='h-4 w-4' aria-hidden='true' />
          </Button>

          <output
            id={qtyId}
            aria-live='polite'
            className='w-8 text-center text-base font-bold text-foreground'
          >
            {qty}
          </output>

          <Button
            type='button'
            variant='outline'
            size='md'
            onClick={() => setQty((q) => Math.min(gear.stock, q + 1))}
            disabled={qty >= gear.stock}
            aria-label='Increase quantity'
            className='w-11 px-0'
          >
            <Plus className='h-4 w-4' aria-hidden='true' />
          </Button>

          <span className='text-xs text-muted-foreground'>
            (max {gear.stock})
          </span>
        </div>
      </div>

      {/* Total */}
      <div className='rounded-control border border-primary/25 bg-primary-soft p-4'>
        <div className='flex items-center justify-between gap-3 text-sm'>
          <span className='text-primary-soft-foreground'>
            {days} day{days !== 1 ? 's' : ''} × {qty} unit{qty !== 1 ? 's' : ''}
          </span>
          <span className='text-lg font-extrabold text-primary-soft-foreground'>
            {formatBDT(total)}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p role='alert' className='field-error'>
          <AlertCircle className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
          {error}
        </p>
      )}

      <Button
        type='submit'
        fullWidth
        size='lg'
        disabled={datesInvalid}
        leadingIcon={<ShoppingBag className='h-5 w-5' />}
      >
        Add to Cart
      </Button>
    </form>
  );
}
