'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { GearItem } from '@/lib/api';
import { formatBDT, parseGearImages } from '@/lib/gear-utils';

interface RentalCreateFormProps {
  gear: GearItem;
  onSuccess: () => void;
}

export function RentalCreateForm({ gear, onSuccess }: RentalCreateFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 3 * 86400000)
    .toISOString()
    .split('T')[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const days = Math.max(
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000,
    ),
    1,
  );
  const total = Number(gear.price) * qty * days;

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    color: 'var(--foreground)',
  };

  const handleSubmit = async () => {
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error('End date must be after start date.');
      return;
    }
    setLoading(true);
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success('Rental order placed! Check your rentals for details.');
    onSuccess();
  };

  return (
    <div className='space-y-5'>
      <div
        className='flex items-center gap-3 rounded-xl border p-3'
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--muted)',
        }}
      >
        <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-xl'>
          <Image
            src={parseGearImages(gear.images)[0]}
            alt={gear.name}
            fill
            className='object-cover'
            sizes='56px'
          />
        </div>
        <div className='min-w-0'>
          <p
            className='truncate text-sm font-semibold'
            style={{ color: 'var(--foreground)' }}
          >
            {gear.name}
          </p>
          <p className='text-sm font-bold' style={{ color: 'var(--primary)' }}>
            {formatBDT(gear.price)}
            <span
              className='text-xs font-normal'
              style={{ color: 'var(--muted-foreground)' }}
            >
              /day
            </span>
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label
            className='mb-1.5 block text-xs font-semibold uppercase tracking-wide'
            style={{ color: 'var(--muted-foreground)' }}
          >
            Start Date
          </label>
          <input
            type='date'
            value={startDate}
            min={today}
            onChange={(e) => setStartDate(e.target.value)}
            className='h-10 w-full rounded-lg border px-3 text-sm outline-none'
            style={inputStyle}
          />
        </div>
        <div>
          <label
            className='mb-1.5 block text-xs font-semibold uppercase tracking-wide'
            style={{ color: 'var(--muted-foreground)' }}
          >
            End Date
          </label>
          <input
            type='date'
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className='h-10 w-full rounded-lg border px-3 text-sm outline-none'
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label
          className='mb-1.5 block text-xs font-semibold uppercase tracking-wide'
          style={{ color: 'var(--muted-foreground)' }}
        >
          Quantity
        </label>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className='flex h-10 w-10 items-center justify-center rounded-lg border text-lg font-bold transition-colors'
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'var(--input-bg)',
            }}
          >
            −
          </button>
          <span
            className='w-8 text-center text-base font-bold'
            style={{ color: 'var(--foreground)' }}
          >
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(gear.stock, q + 1))}
            className='flex h-10 w-10 items-center justify-center rounded-lg border text-lg font-bold transition-colors'
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'var(--input-bg)',
            }}
          >
            +
          </button>
          <span
            className='text-xs'
            style={{ color: 'var(--muted-foreground)' }}
          >
            (max {gear.stock})
          </span>
        </div>
      </div>

      {/* Total */}
      <div
        className='rounded-xl border p-4'
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'color-mix(in srgb, var(--primary) 6%, transparent)',
        }}
      >
        <div className='flex items-center justify-between text-sm'>
          <span style={{ color: 'var(--muted-foreground)' }}>
            {days} day{days !== 1 ? 's' : ''} × {qty} unit{qty !== 1 ? 's' : ''}
          </span>
          <span
            className='text-lg font-extrabold'
            style={{ color: 'var(--primary)' }}
          >
            {formatBDT(total)}
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className='flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60'
        style={{ backgroundColor: 'var(--primary)' }}
      >
        {loading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <ShoppingBag className='h-4 w-4' />
        )}
        {loading ? 'Placing Order…' : 'Confirm Rental'}
      </button>
    </div>
  );
}
