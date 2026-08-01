'use client';

import { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import type { GearItem } from '@/lib/types';
import { formatBDT } from '@/lib/gear-utils';
import { useCartStore } from '@/store/useCartStore';

interface Props {
  gear: GearItem;
  onClose: () => void;
}

const inputCls =
  'h-9 w-full rounded-lg border px-2 text-sm outline-none focus:ring-1 transition-colors';

export default function AddToCartModal({ gear, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 3 * 86_400_000)
    .toISOString()
    .split('T')[0];

  const [qty, setQty] = useState(1);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(defaultEnd);

  const addItem = useCartStore((s) => s.addItem);

  const days = Math.max(
    Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
    1,
  );
  const total = Number(gear.price) * qty * days;

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    color: 'var(--foreground)',
  };

  const handleSubmit = () => {
    if (new Date(end) <= new Date(start)) {
      toast.error('End date must be after start date.');
      return;
    }
    addItem(gear, qty, start, end);
    toast.success(`${gear.name} added to cart!`);
    onClose();
  };

  return (
    <div
      className='fixed inset-0 z-[60] flex items-end justify-center sm:items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className='w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6'
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Header */}
        <div className='mb-5 flex items-start justify-between gap-3'>
          <div>
            <h3
              className='text-base font-bold leading-tight'
              style={{ color: 'var(--foreground)' }}
            >
              {gear.name}
            </h3>
            <p
              className='mt-0.5 text-sm font-semibold'
              style={{ color: 'var(--primary)' }}
            >
              {formatBDT(gear.price)}/day
            </p>
          </div>
          <button
            onClick={onClose}
            className='cursor-pointer shrink-0 rounded-lg p-1.5 transition-colors'
            style={{ color: 'var(--muted-foreground)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--muted)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
            aria-label='Close'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* Date range */}
        <div className='mb-4 grid grid-cols-2 gap-3'>
          {(
            [
              {
                label: 'Start date',
                value: start,
                min: today,
                onChange: setStart,
              },
              { label: 'End date', value: end, min: start, onChange: setEnd },
            ] as const
          ).map(({ label, value, min, onChange }) => (
            <div key={label}>
              <label
                className='mb-1 block text-xs font-medium'
                style={{ color: 'var(--foreground)' }}
              >
                {label}
              </label>
              <input
                type='date'
                value={value}
                min={min}
                onChange={(e) => onChange(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        {/* Quantity */}
        <div className='mb-5'>
          <label
            className='mb-1 block text-xs font-medium'
            style={{ color: 'var(--foreground)' }}
          >
            Quantity{' '}
            <span style={{ color: 'var(--muted-foreground)' }}>
              (stock: {gear.stock})
            </span>
          </label>
          <div className='flex items-center gap-3'>
            <div
              className='flex items-center rounded-lg border'
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className='cursor-pointer flex h-9 w-9 items-center justify-center transition-colors disabled:opacity-40'
                style={{ color: 'var(--foreground)' }}
              >
                −
              </button>
              <span
                className='w-8 text-center text-sm font-semibold'
                style={{ color: 'var(--foreground)' }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(gear.stock, q + 1))}
                disabled={qty >= gear.stock}
                className='cursor-pointer flex h-9 w-9 items-center justify-center transition-colors disabled:opacity-40'
                style={{ color: 'var(--foreground)' }}
              >
                +
              </button>
            </div>
            <span
              className='text-sm'
              style={{ color: 'var(--muted-foreground)' }}
            >
              {days} day{days !== 1 ? 's' : ''} ·{' '}
              <span
                className='font-semibold'
                style={{ color: 'var(--foreground)' }}
              >
                {formatBDT(total)}
              </span>{' '}
              total
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-3'>
          <button
            onClick={onClose}
            className='cursor-pointer flex-1 h-10 rounded-xl border text-sm font-semibold transition-colors'
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'transparent',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className='cursor-pointer flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold text-white transition-colors'
            style={{ backgroundColor: 'var(--primary)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--primary)')
            }
          >
            <ShoppingCart className='h-4 w-4' />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
