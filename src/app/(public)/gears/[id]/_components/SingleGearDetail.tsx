'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Package,
  Calendar,
  ShoppingBag,
  ZoomIn,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Tag,
  Store,
  Layers,
} from 'lucide-react';
import type { GearItem, GearReview } from '@/lib/types';
import {
  formatBDT,
  parseGearImages,
  calcAvgRating,
  formatDate,
  getGearAvailability,
  GEAR_IMAGE_FALLBACK,
} from '@/lib/gear-utils';
import { cn } from '@/lib/cn';
import ImageModal from '@/components/ImageModal';
import Modal from '@/components/Modal';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Button, ButtonLink } from '@/components/ui/Button';
import GearCard from '@/app/(public)/_components/GearCard';
import { RentalCreateForm } from './RentalCreateForm';

interface SingleGearDetailProps {
  gear: GearItem;
  /** Same-category gear, current item already excluded. */
  related?: GearItem[];
}

/** Avatar fallback - brand tokens only, so it themes with everything else. */
function Avatar({
  src,
  name,
  size = 'md',
}: {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md';
}) {
  const [failed, setFailed] = useState(false);
  const dimension = size === 'md' ? 'h-12 w-12 text-sm' : 'h-10 w-10 text-xs';

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft font-bold text-primary-soft-foreground',
        dimension,
      )}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={name}
          fill
          className='rounded-full object-cover'
          sizes='48px'
          onError={() => setFailed(true)}
        />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  );
}

/** One row of the specifications table. */
function SpecRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className='flex items-center justify-between gap-4 px-5 py-3.5'>
      <span className='flex items-center gap-2.5 text-sm text-muted-foreground'>
        <Icon className='h-4 w-4 shrink-0' aria-hidden='true' />
        {label}
      </span>
      <span className='text-right text-sm font-semibold text-foreground'>
        {value}
      </span>
    </div>
  );
}

export function SingleGearDetail({
  gear,
  related = [],
}: SingleGearDetailProps) {
  const reviews = gear.reviews ?? [];
  const images = parseGearImages(gear.images);
  const avgRating = reviews.length > 0 ? calcAvgRating(reviews) : 0;
  const availability = getGearAvailability(gear);
  const isRentable =
    availability === 'available' || availability === 'low-stock';

  const [activeImage, setActiveImage] = useState(0);
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const [rentModalOpen, setRentModalOpen] = useState(false);
  const [mainSrcFailed, setMainSrcFailed] = useState(false);

  const currentSrc = mainSrcFailed
    ? GEAR_IMAGE_FALLBACK
    : (images[activeImage] ?? GEAR_IMAGE_FALLBACK);

  return (
    <div className='min-h-screen bg-background'>
      <div className='container-page py-8'>
        {/* Back */}
        <Link
          href='/gears'
          className='mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeft className='h-4 w-4' aria-hidden='true' />
          Back to Browse
        </Link>

        {/* Main grid */}
        <div className='grid gap-8 lg:grid-cols-2'>
          {/* ── Media ──────────────────────────────────────────────────── */}
          <div className='space-y-3'>
            <button
              type='button'
              onClick={() => setImgModalOpen(true)}
              aria-label={`Expand image of ${gear.name}`}
              className='group relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden rounded-card border border-border bg-muted'
            >
              <Image
                src={currentSrc}
                alt={gear.name}
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                className='object-cover transition-transform duration-300 group-hover:scale-105'
                priority
                onError={() => setMainSrcFailed(true)}
              />

              {!isRentable && (
                <span className='absolute inset-0 flex items-center justify-center bg-black/60'>
                  <span className='rounded-full bg-white px-4 py-1.5 text-sm font-bold text-slate-900'>
                    {availability === 'inactive'
                      ? 'Currently Unavailable'
                      : 'Out of stock'}
                  </span>
                </span>
              )}

              <span className='absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm'>
                {gear.category?.name ?? 'Gear'}
              </span>

              <span className='absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm'>
                <ZoomIn className='h-3 w-3' aria-hidden='true' />
                Click to expand
              </span>
            </button>

            {/* Thumbnail strip - selects the main image */}
            {images.length > 1 && (
              <div className='flex gap-2 overflow-x-auto pb-1'>
                {images.map((src, i) => (
                  <button
                    key={src}
                    type='button'
                    onClick={() => {
                      setActiveImage(i);
                      setMainSrcFailed(false);
                    }}
                    aria-label={`Show image ${i + 1} of ${images.length}`}
                    aria-current={i === activeImage}
                    className={cn(
                      'relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-control border-2 transition-colors',
                      i === activeImage
                        ? 'border-primary'
                        : 'border-border hover:border-border-strong',
                    )}
                  >
                    <Image
                      src={src}
                      alt=''
                      fill
                      className='object-cover'
                      sizes='64px'
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Rating summary */}
            {reviews.length > 0 && (
              <div className='surface-card flex items-center gap-4 p-4'>
                <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-control bg-primary-soft text-2xl font-black text-primary-soft-foreground'>
                  {avgRating.toFixed(1)}
                </div>
                <div>
                  <Rating value={avgRating} size='md' starsOnly />
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Link
                  href={`/gears/${gear.id}/reviews`}
                  className='ml-auto flex items-center gap-1 text-sm font-semibold text-primary transition-opacity hover:opacity-80'
                >
                  See all <ChevronRight className='h-3.5 w-3.5' />
                </Link>
              </div>
            )}
          </div>

          {/* ── Info ───────────────────────────────────────────────────── */}
          <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-2'>
              {isRentable ? (
                <Badge
                  tone='secondary'
                  icon={<CheckCircle2 className='h-3.5 w-3.5' />}
                >
                  Available
                </Badge>
              ) : (
                <Badge tone='danger' icon={<XCircle className='h-3.5 w-3.5' />}>
                  Unavailable
                </Badge>
              )}
              {availability === 'low-stock' && (
                <Badge tone='warning'>Only {gear.stock} left</Badge>
              )}
            </div>

            {/* Title & price */}
            <div>
              <h1 className='text-2xl leading-tight font-extrabold text-foreground sm:text-3xl'>
                {gear.name}
              </h1>
              <div className='mt-2 flex items-baseline gap-1'>
                <span className='text-3xl font-extrabold text-primary'>
                  {formatBDT(gear.price)}
                </span>
                <span className='text-sm text-muted-foreground'>/day</span>
              </div>
            </div>

            {/* Provider */}
            <div className='surface-card flex items-center gap-4 p-4'>
              <Avatar
                src={gear.provider?.avatarUrl}
                name={gear.provider?.name ?? 'Provider'}
              />
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <p className='truncate text-sm font-semibold text-foreground'>
                    {gear.provider?.name ?? 'Unknown Provider'}
                  </p>
                  <Badge tone='accent' size='sm'>
                    Provider
                  </Badge>
                </div>
                <p className='mt-0.5 text-xs text-muted-foreground'>
                  Member since{' '}
                  {formatDate(gear.provider?.createdAt ?? gear.createdAt)}
                </p>
              </div>
            </div>

            {/* Quick meta */}
            <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
              <span className='flex items-center gap-1.5'>
                <Package className='h-4 w-4' aria-hidden='true' />
                {gear.stock > 0
                  ? `${gear.stock} unit${gear.stock !== 1 ? 's' : ''} available`
                  : 'Out of stock'}
              </span>
              <span className='flex items-center gap-1.5'>
                <Calendar className='h-4 w-4' aria-hidden='true' />
                Added {formatDate(gear.createdAt)}
              </span>
            </div>

            {/* Overview */}
            <section className='surface-card p-5'>
              <h2 className='mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase'>
                Overview
              </h2>
              <p className='text-sm leading-relaxed text-foreground'>
                {gear.description}
              </p>
            </section>

            {/* CTA */}
            <Button
              size='lg'
              fullWidth
              onClick={() => setRentModalOpen(true)}
              disabled={!isRentable}
              leadingIcon={<ShoppingBag className='h-5 w-5' />}
            >
              {isRentable ? 'Rent Now' : 'Currently Unavailable'}
            </Button>
          </div>
        </div>

        {/* ── Specifications ───────────────────────────────────────────── */}
        <section className='mt-12'>
          <h2 className='mb-4 text-xl font-bold text-foreground'>
            Key Information
          </h2>
          <div className='surface-card divide-y divide-border overflow-hidden'>
            <SpecRow
              icon={Tag}
              label='Category'
              value={gear.category?.name ?? 'Uncategorised'}
            />
            <SpecRow
              icon={ShoppingBag}
              label='Rental price'
              value={`${formatBDT(gear.price)} / day`}
            />
            <SpecRow
              icon={Layers}
              label='Units in stock'
              value={String(gear.stock)}
            />
            <SpecRow
              icon={Store}
              label='Provider'
              value={gear.provider?.name ?? 'Unknown Provider'}
            />
            <SpecRow
              icon={Star}
              label='Average rating'
              value={
                reviews.length > 0
                  ? `${avgRating.toFixed(1)} / 5 (${reviews.length} review${reviews.length !== 1 ? 's' : ''})`
                  : 'Not rated yet'
              }
            />
            <SpecRow
              icon={Calendar}
              label='Listed on'
              value={formatDate(gear.createdAt)}
            />
            <SpecRow
              icon={CheckCircle2}
              label='Availability'
              value={isRentable ? 'Available to rent' : 'Unavailable'}
            />
          </div>
        </section>

        {/* ── Reviews ──────────────────────────────────────────────────── */}
        <section className='mt-12'>
          <div className='mb-6 flex items-center justify-between gap-4'>
            <h2 className='flex items-center gap-2 text-xl font-bold text-foreground'>
              Reviews
              {reviews.length > 0 && (
                <Badge tone='neutral' size='sm'>
                  {reviews.length}
                </Badge>
              )}
            </h2>
            {reviews.length > 3 && (
              <Link
                href={`/gears/${gear.id}/reviews`}
                className='flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-opacity hover:opacity-80'
              >
                View all <ChevronRight className='h-3.5 w-3.5' />
              </Link>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className='surface-card flex flex-col items-center justify-center px-6 py-14 text-center'>
              <span className='mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted'>
                <Star
                  className='h-7 w-7 text-muted-foreground'
                  aria-hidden='true'
                />
              </span>
              <p className='text-base font-bold text-foreground'>
                No reviews yet
              </p>
              <p className='mt-1 text-sm text-muted-foreground'>
                Be the first to rent and review this gear.
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {reviews.slice(0, 3).map((review: GearReview) => (
                <article key={review.id} className='surface-card p-5'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex items-center gap-3'>
                      <Avatar
                        src={review.customer?.avatarUrl}
                        name={review.customer?.name ?? 'Customer'}
                        size='sm'
                      />
                      <div>
                        <p className='text-sm font-semibold text-foreground'>
                          {review.customer?.name ?? 'Customer'}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Rating value={review.rating} size='sm' starsOnly />
                  </div>
                  <p className='mt-3 text-sm leading-relaxed text-foreground'>
                    {review.comment}
                  </p>
                </article>
              ))}

              {reviews.length > 3 && (
                <ButtonLink
                  href={`/gears/${gear.id}/reviews`}
                  variant='outline'
                  fullWidth
                  trailingIcon={<ChevronRight className='h-4 w-4' />}
                >
                  See all {reviews.length} reviews
                </ButtonLink>
              )}
            </div>
          )}
        </section>

        {/* ── Related items ────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className='mt-12'>
            <div className='mb-6 flex items-center justify-between gap-4'>
              <h2 className='text-xl font-bold text-foreground'>
                Similar gear
              </h2>
              {gear.category?.name && (
                <Link
                  href={`/gears?category=${encodeURIComponent(gear.category.name)}`}
                  className='flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-opacity hover:opacity-80'
                >
                  More in {gear.category.name}
                  <ChevronRight className='h-3.5 w-3.5' />
                </Link>
              )}
            </div>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {related.map((item) => (
                <GearCard key={item.id} gear={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modals */}
      <ImageModal
        open={imgModalOpen}
        onClose={() => setImgModalOpen(false)}
        src={currentSrc}
        alt={gear.name}
      />

      <Modal
        open={rentModalOpen}
        onClose={() => setRentModalOpen(false)}
        title='Create Rental Order'
        noFooter
      >
        <RentalCreateForm
          gear={gear}
          onSuccess={() => setRentModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
