'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import type { GearItem } from '@/lib/api';
import { formatBDT, parseGearImages, calcAvgRating } from '@/lib/gear-utils';
import AddToCartModal from './AddToCartModal';

function RatingBadge({ reviews }: { reviews?: Array<{ rating: number }> }) {
  if (!reviews?.length) return null;
  const avg = calcAvgRating(reviews);
  return (
    <div
      className='flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold'
      style={{
        backgroundColor: 'rgba(0,0,0,0.55)',
        color: '#fff',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Star className='h-3 w-3' fill='#f59e0b' style={{ color: '#f59e0b' }} />
      {avg.toFixed(1)}
      <span style={{ opacity: 0.7 }}>({reviews.length})</span>
    </div>
  );
}

function StockLabel({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className='shrink-0 text-red-500 dark:text-red-400'>
        Out of stock
      </span>
    );
  }
  if (stock <= 3) {
    return (
      <span className='shrink-0 text-amber-600 dark:text-amber-400'>
        Only {stock} left
      </span>
    );
  }
  return (
    <span className='shrink-0 text-green-600 dark:text-green-400'>
      {stock} in stock
    </span>
  );
}

export default function GearCard({ gear }: { gear: GearItem }) {
  const { addItem, openCart } = useCart();
  const [showModal, setShowModal] = useState(false);

  const images = parseGearImages(gear.images);
  const isUnavailable = !gear.isActive || gear.stock === 0;

  const handleAdd = (qty: number, start: string, end: string) => {
    addItem(gear, qty, start, end);
    setShowModal(false);
    toast.success(`${gear.name} added to cart!`);
    openCart();
  };

  return (
    <>
      <article
        className='group flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Image  */}
        <Link
          href={`/gears/${gear.id}`}
          className='relative block aspect-[4/3] overflow-hidden'
        >
          <Image
            src={images[0]}
            alt={gear.name}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            className='object-cover transition-transform duration-300 group-hover:scale-105'
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://placehold.co/400x300/e2e8f0/94a3b8?text=Gear';
            }}
          />

          {/* Unavailable overlay */}
          {isUnavailable && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
              <span className='rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-800'>
                {gear.stock === 0 ? 'Out of Stock' : 'Unavailable'}
              </span>
            </div>
          )}

          {/* Top row overlays: category badge (left) + rating (right) */}
          <div className='absolute left-3 right-3 top-3 flex items-start justify-between gap-2'>
            <span
              className='rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm'
              style={{
                backgroundColor:
                  'color-mix(in srgb, var(--primary) 85%, transparent)',
                color: '#fff',
              }}
            >
              {gear.category?.name ?? 'Gear'}
            </span>
            <RatingBadge reviews={gear.reviews} />
          </div>
        </Link>

        {/* Body */}
        <div className='flex flex-1 flex-col p-4'>
          {/* Name */}
          <Link href={`/gears/${gear.id}`}>
            <h3
              className='line-clamp-1 text-sm font-bold leading-snug transition-opacity hover:opacity-75'
              style={{ color: 'var(--foreground)' }}
            >
              {gear.name}
            </h3>
          </Link>

          {/* Description */}
          <p
            className='mt-1 line-clamp-2 text-xs leading-relaxed'
            style={{ color: 'var(--muted-foreground)' }}
          >
            {gear.description}
          </p>

          {/* Provider + stock */}
          <div
            className='mt-2.5 flex items-center justify-between gap-2 text-xs'
            style={{ color: 'var(--muted-foreground)' }}
          >
            <span className='truncate'>
              {gear.provider?.name ?? 'Provider'}
            </span>
            <StockLabel stock={gear.stock} />
          </div>

          {/* Price + CTA */}
          <div className='mt-4 flex items-center justify-between gap-2'>
            <div className='min-w-0'>
              <span
                className='text-lg font-extrabold'
                style={{ color: 'var(--primary)' }}
              >
                {formatBDT(gear.price)}
              </span>
              <span
                className='ml-0.5 text-xs'
                style={{ color: 'var(--muted-foreground)' }}
              >
                /day
              </span>
            </div>

            <button
              onClick={() => {
                if (!isUnavailable) setShowModal(true);
              }}
              disabled={isUnavailable}
              className='inline-flex shrink-0 h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50'
              style={{ backgroundColor: 'var(--primary)' }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled)
                  e.currentTarget.style.backgroundColor =
                    'var(--primary-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
              }}
            >
              <ShoppingCart className='h-3.5 w-3.5' />
              Rent
            </button>
          </div>
        </div>
      </article>

      {showModal && (
        <AddToCartModal
          gear={gear}
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </>
  );
}
