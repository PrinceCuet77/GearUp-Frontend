'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';
import {
  ArrowLeft,
  Star,
  Package,
  User,
  Calendar,
  ShoppingBag,
  ZoomIn,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { DUMMY_GEARS, DUMMY_REVIEWS } from '@/lib/dummy-data';
import { formatBDT, parseGearImages, calcAvgRating } from '@/lib/gear-utils';
import ImageModal from '@/components/ImageModal';
import Modal from '@/components/Modal';

interface Props {
  params: Promise<{ id: string }>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function StarRating({
  rating,
  max = 5,
  size = 'sm',
}: {
  rating: number;
  max?: number;
  size?: 'sm' | 'md';
}) {
  const cls = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cls}
          style={{
            fill: i < rating ? '#f59e0b' : 'transparent',
            color: i < rating ? '#f59e0b' : 'var(--border)',
          }}
        />
      ))}
    </div>
  );
}

function RentalCreateForm({
  gear,
  onSuccess,
}: {
  gear: (typeof DUMMY_GEARS)[number];
  onSuccess: () => void;
}) {
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
    // ── TODO: replace with real API call ──────────────────────────────────
    // await fetch('/api/rentals', { method: 'POST', credentials: 'include', body: JSON.stringify({ startDate, endDate, items: [{ gearItemId: gear.id, quantity: qty }] }) });
    await new Promise((r) => setTimeout(r, 800));
    // ────────────────────────────────────────────────────────────────────
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

export default function GearDetailPage({ params }: Props) {
  const { id } = use(params);

  const gear = DUMMY_GEARS.find((g) => g.id === id);
  if (!gear) notFound();

  const reviews = DUMMY_REVIEWS.filter((r) => r.gearItemId === id);
  const images = parseGearImages(gear.images);
  const avgRating = reviews.length > 0 ? calcAvgRating(reviews) : 0;

  const [imgModalOpen, setImgModalOpen] = useState(false);
  const [imgModalSrc, setImgModalSrc] = useState('');
  const [rentModalOpen, setRentModalOpen] = useState(false);

  const openImage = (src: string) => {
    setImgModalSrc(src);
    setImgModalOpen(true);
  };

  return (
    <div
      className='min-h-screen'
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Back */}
        <Link
          href='/gears'
          className='mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors'
          style={{ color: 'var(--muted-foreground)' }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color =
              'var(--foreground)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color =
              'var(--muted-foreground)')
          }
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Browse
        </Link>

        {/* Main grid */}
        <div className='grid gap-8 lg:grid-cols-2'>
          {/* Images */}
          <div className='space-y-3'>
            {/* Primary image */}
            <div
              className='group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-2xl'
              onClick={() => openImage(images[0])}
            >
              <Image
                src={images[0]}
                alt={gear.name}
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                className='object-cover transition-transform duration-300 group-hover:scale-105'
                priority
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://placehold.co/800x600/e2e8f0/94a3b8?text=Gear';
                }}
              />
              {!gear.isActive && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
                  <span className='rounded-full bg-white/90 px-4 py-1.5 text-sm font-bold text-gray-900'>
                    Currently Unavailable
                  </span>
                </div>
              )}
              <span
                className='absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold'
                style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
              >
                {gear.category?.name ?? 'Gear'}
              </span>
              <div className='absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-sm'>
                <ZoomIn className='h-3 w-3' />
                Click to expand
              </div>
            </div>

            {/* Thumbnail strip (if multiple images) */}
            {images.length > 1 && (
              <div className='flex gap-2 overflow-x-auto pb-1'>
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => openImage(src)}
                    className='relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors'
                    style={{
                      borderColor: i === 0 ? 'var(--primary)' : 'var(--border)',
                    }}
                  >
                    <Image
                      src={src}
                      alt={`View ${i + 1}`}
                      fill
                      className='object-cover'
                      sizes='64px'
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Rating card */}
            {reviews.length > 0 && (
              <div
                className='flex items-center gap-4 rounded-xl border p-4'
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className='flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl font-black'
                  style={{
                    backgroundColor:
                      'color-mix(in srgb, var(--primary) 12%, transparent)',
                    color: 'var(--primary)',
                  }}
                >
                  {avgRating.toFixed(1)}
                </div>
                <div>
                  <StarRating rating={Math.round(avgRating)} size='md' />
                  <p
                    className='mt-0.5 text-xs'
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Link
                  href={`/gears/${id}/reviews`}
                  className='ml-auto flex items-center gap-1 text-sm font-medium'
                  style={{ color: 'var(--primary)' }}
                >
                  See all <ChevronRight className='h-3.5 w-3.5' />
                </Link>
              </div>
            )}
          </div>

          {/* Info */}
          <div className='flex flex-col gap-5'>
            {/* Status badge */}
            <div className='flex items-center gap-2'>
              {gear.isActive && gear.stock > 0 ? (
                <span
                  className='inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold'
                  style={{
                    backgroundColor: 'rgba(34,197,94,0.12)',
                    color: '#16a34a',
                  }}
                >
                  <CheckCircle2 className='h-3.5 w-3.5' />
                  Available
                </span>
              ) : (
                <span
                  className='inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold'
                  style={{
                    backgroundColor: 'rgba(239,68,68,0.12)',
                    color: '#dc2626',
                  }}
                >
                  <XCircle className='h-3.5 w-3.5' />
                  Unavailable
                </span>
              )}
            </div>

            {/* Title & price */}
            <div>
              <h1
                className='text-2xl font-extrabold leading-tight sm:text-3xl'
                style={{ color: 'var(--foreground)' }}
              >
                {gear.name}
              </h1>
              <div className='mt-2 flex items-baseline gap-1'>
                <span
                  className='text-3xl font-extrabold'
                  style={{ color: 'var(--primary)' }}
                >
                  {formatBDT(gear.price)}
                </span>
                <span
                  className='text-sm'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  /day
                </span>
              </div>
            </div>

            {/* Meta */}
            <div
              className='flex flex-wrap gap-4 text-sm'
              style={{ color: 'var(--muted-foreground)' }}
            >
              <span className='flex items-center gap-1.5'>
                <User className='h-4 w-4' />
                {gear.provider?.name ?? 'Provider'}
              </span>
              <span className='flex items-center gap-1.5'>
                <Package className='h-4 w-4' />
                {gear.stock > 0
                  ? `${gear.stock} unit${gear.stock !== 1 ? 's' : ''} available`
                  : 'Out of stock'}
              </span>
              <span className='flex items-center gap-1.5'>
                <Calendar className='h-4 w-4' />
                Added {formatDate(gear.createdAt)}
              </span>
            </div>

            {/* Description */}
            <div
              className='rounded-xl border p-4'
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              <h2
                className='mb-2 text-xs font-semibold uppercase tracking-wide'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Description
              </h2>
              <p
                className='text-sm leading-relaxed'
                style={{ color: 'var(--foreground)' }}
              >
                {gear.description}
              </p>
            </div>

            {/* CTA */}
            {/* {user?.role === 'CUSTOMER' ? (
              <button
                onClick={() => setRentModalOpen(true)}
                disabled={!gear.isActive || gear.stock === 0}
                className='flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-colors disabled:opacity-50'
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <ShoppingBag className='h-4 w-4' />
                Rent Now
              </button>
            ) : !user ? (
              <div
                className='rounded-xl border p-4 text-center text-sm'
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--muted-foreground)',
                }}
              >
                <Link
                  href='/login'
                  className='font-semibold'
                  style={{ color: 'var(--primary)' }}
                >
                  Sign in
                </Link>{' '}
                as a customer to rent this gear.
              </div>
            ) : null} */}
          </div>
        </div>

        {/* Reviews */}
        <section className='mt-12'>
          <div className='mb-6 flex items-center justify-between'>
            <h2
              className='text-xl font-bold'
              style={{ color: 'var(--foreground)' }}
            >
              Reviews
              {reviews.length > 0 && (
                <span
                  className='ml-2 rounded-full px-2.5 py-0.5 text-sm font-semibold'
                  style={{
                    backgroundColor: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  {reviews.length}
                </span>
              )}
            </h2>
            {reviews.length > 3 && (
              <Link
                href={`/gears/${id}/reviews`}
                className='flex items-center gap-1 text-sm font-medium'
                style={{ color: 'var(--primary)' }}
              >
                View all <ChevronRight className='h-3.5 w-3.5' />
              </Link>
            )}
          </div>

          {reviews.length === 0 ? (
            <div
              className='flex flex-col items-center justify-center rounded-2xl border py-14 text-center'
              style={{ borderColor: 'var(--border)' }}
            >
              <Star
                className='mb-3 h-10 w-10 opacity-20'
                style={{ color: 'var(--muted-foreground)' }}
              />
              <p
                className='text-base font-semibold'
                style={{ color: 'var(--foreground)' }}
              >
                No reviews yet
              </p>
              <p
                className='mt-1 text-sm'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Be the first to rent and review this gear.
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {reviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className='rounded-2xl border p-5'
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex items-center gap-3'>
                      <div
                        className='flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white'
                        style={{ backgroundColor: '#f97316' }}
                      >
                        {(review.customer?.name ??
                          review.customerId)[0].toUpperCase()}
                      </div>
                      <div>
                        <p
                          className='text-sm font-semibold'
                          style={{ color: 'var(--foreground)' }}
                        >
                          {review.customer?.name ?? 'Customer'}
                        </p>
                        <p
                          className='text-xs'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p
                    className='mt-3 text-sm leading-relaxed'
                    style={{ color: 'var(--foreground)' }}
                  >
                    {review.comment}
                  </p>
                </div>
              ))}
              {reviews.length > 3 && (
                <Link
                  href={`/gears/${id}/reviews`}
                  className='flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors'
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--primary)',
                  }}
                >
                  See all {reviews.length} reviews
                  <ChevronRight className='h-4 w-4' />
                </Link>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
      <ImageModal
        open={imgModalOpen}
        onClose={() => setImgModalOpen(false)}
        src={imgModalSrc}
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
