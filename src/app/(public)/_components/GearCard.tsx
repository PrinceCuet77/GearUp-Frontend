'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Store, ShoppingCart } from 'lucide-react';

import type { GearItem } from '@/lib/types';
import {
  calcAvgRating,
  formatBDT,
  formatShortDate,
  GEAR_IMAGE_FALLBACK,
  getGearAvailability,
  parseGearImages,
} from '@/lib/gear-utils';
import { cn } from '@/lib/cn';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { buttonClasses } from '@/components/ui/Button';
import AddToCartModal from './AddToCartModal';

const AVAILABILITY: Record<
  ReturnType<typeof getGearAvailability>,
  { tone: BadgeTone; label: (stock: number) => string }
> = {
  available: { tone: 'secondary', label: (stock) => `${stock} available` },
  'low-stock': { tone: 'warning', label: (stock) => `Only ${stock} left` },
  'out-of-stock': { tone: 'danger', label: () => 'Out of stock' },
  inactive: { tone: 'neutral', label: () => 'Unavailable' },
};

export interface GearCardProps {
  gear: GearItem;
  /** Feeds `next/image` sizes; override when the grid is not 3-up. */
  imageSizes?: string;
  /** Skips lazy loading for cards above the fold. */
  priority?: boolean;
}

/**
 * The single gear card used across the landing page and the browse grid.
 *
 * Fixed geometry by design — `h-full`, a 4:3 image and clamped text — so every
 * card in a row is exactly the same size regardless of content length.
 */
export default function GearCard({
  gear,
  imageSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
}: GearCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => parseGearImages(gear.images)[0]);

  const availability = getGearAvailability(gear);
  const isRentable = availability === 'available' || availability === 'low-stock';
  const reviewCount = gear.reviews?.length ?? 0;
  const avgRating = calcAvgRating(gear.reviews);
  const status = AVAILABILITY[availability];

  return (
    <>
      <article className='surface-card-interactive group flex h-full flex-col overflow-hidden'>
        {/* Media */}
        <Link
          href={`/gears/${gear.id}`}
          className='relative block aspect-4/3 shrink-0 overflow-hidden bg-muted'
          aria-label={`View details for ${gear.name}`}
        >
          <Image
            src={imageSrc}
            alt={gear.name}
            fill
            sizes={imageSizes}
            priority={priority}
            className='object-cover transition-transform duration-500 group-hover:scale-105'
            onError={() => setImageSrc(GEAR_IMAGE_FALLBACK)}
          />

          {/* Bottom scrim keeps the badges legible on light photos */}
          <div
            className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20'
            aria-hidden='true'
          />

          {!isRentable && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/55'>
              <span className='rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-slate-900'>
                {status.label(gear.stock)}
              </span>
            </div>
          )}

          <span className='absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-sm'>
            {gear.category?.name ?? 'Gear'}
          </span>

          {reviewCount > 0 && (
            <span className='absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-bold text-white backdrop-blur-sm'>
              <Rating value={avgRating} size='sm' starsOnly className='gap-0' />
              {avgRating.toFixed(1)}
            </span>
          )}
        </Link>

        {/* Body */}
        <div className='flex flex-1 flex-col p-5'>
          <h3 className='line-clamp-1 text-base font-bold text-foreground'>
            <Link
              href={`/gears/${gear.id}`}
              className='transition-colors hover:text-primary'
            >
              {gear.name}
            </Link>
          </h3>

          {/* min-h reserves two lines so short descriptions don't shrink the card */}
          <p className='mt-1.5 line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground'>
            {gear.description}
          </p>

          {/* Meta: rating + availability */}
          <div className='mt-4 flex items-center justify-between gap-2'>
            {reviewCount > 0 ? (
              <Rating value={avgRating} count={reviewCount} size='sm' />
            ) : (
              <span className='text-xs font-semibold text-muted-foreground'>
                No reviews yet
              </span>
            )}
            <Badge tone={status.tone} size='sm'>
              {status.label(gear.stock)}
            </Badge>
          </div>

          {/* Meta: provider + listed date */}
          <div className='mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground'>
            <span className='flex min-w-0 items-center gap-1.5'>
              <Store className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
              <span className='truncate'>
                {gear.provider?.name ?? 'GearUp provider'}
              </span>
            </span>
            <span className='flex shrink-0 items-center gap-1.5'>
              <CalendarDays className='h-3.5 w-3.5' aria-hidden='true' />
              {formatShortDate(gear.createdAt)}
            </span>
          </div>

          {/* Footer: price + actions — pinned to the bottom of every card */}
          <div className='mt-auto flex items-end justify-between gap-3 border-t border-border pt-4'>
            <p className='min-w-0'>
              <span className='text-xl font-extrabold text-foreground'>
                {formatBDT(gear.price)}
              </span>
              <span className='ml-1 text-xs font-medium text-muted-foreground'>
                / day
              </span>
            </p>

            <div className='flex shrink-0 items-center gap-2'>
              <Link
                href={`/gears/${gear.id}`}
                className={buttonClasses({
                  variant: 'outline',
                  size: 'sm',
                  className: 'gap-1.5',
                })}
              >
                View Details
                <ArrowRight className='h-3.5 w-3.5' aria-hidden='true' />
              </Link>

              <button
                type='button'
                onClick={() => setShowModal(true)}
                disabled={!isRentable}
                aria-label={`Rent ${gear.name}`}
                title={isRentable ? `Rent ${gear.name}` : status.label(gear.stock)}
                className={cn(
                  buttonClasses({ variant: 'primary', size: 'sm' }),
                  'w-12 px-0',
                )}
              >
                <ShoppingCart className='h-4 w-4' aria-hidden='true' />
              </button>
            </div>
          </div>
        </div>
      </article>

      {showModal && (
        <AddToCartModal gear={gear} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
