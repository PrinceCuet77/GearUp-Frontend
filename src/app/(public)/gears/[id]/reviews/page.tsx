'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { DUMMY_GEARS, DUMMY_REVIEWS } from '@/lib/dummy-data';

interface Props {
  params: Promise<{ id: string }>;
}

const REVIEWS_PER_PAGE = 8;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className='h-4 w-4'
          style={{
            fill: i < rating ? '#f59e0b' : 'transparent',
            color: i < rating ? '#f59e0b' : 'var(--border)',
          }}
        />
      ))}
    </div>
  );
}

function RatingBar({
  count,
  total,
  label,
}: {
  count: number;
  total: number;
  label: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className='flex items-center gap-3'>
      <span
        className='w-12 shrink-0 text-xs font-medium text-right'
        style={{ color: 'var(--muted-foreground)' }}
      >
        {label}
      </span>
      <div
        className='relative h-2 flex-1 overflow-hidden rounded-full'
        style={{ backgroundColor: 'var(--muted)' }}
      >
        <div
          className='absolute inset-y-0 left-0 rounded-full'
          style={{ width: `${pct}%`, backgroundColor: '#f59e0b' }}
        />
      </div>
      <span
        className='w-6 shrink-0 text-xs'
        style={{ color: 'var(--muted-foreground)' }}
      >
        {count}
      </span>
    </div>
  );
}

export default function GearReviewsPage({ params }: Props) {
  const { id } = use(params);
  const gear = DUMMY_GEARS.find((g) => g.id === id);
  if (!gear) notFound();

  const reviews = DUMMY_REVIEWS.filter((r) => r.gearItemId === id);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(Math.ceil(reviews.length / REVIEWS_PER_PAGE), 1);
  const paged = reviews.slice(
    (page - 1) * REVIEWS_PER_PAGE,
    page * REVIEWS_PER_PAGE,
  );

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div
      className='min-h-screen'
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className='mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Back */}
        <Link
          href={`/gears/${id}`}
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
          Back to {gear.name}
        </Link>

        <h1
          className='mb-2 text-2xl font-bold'
          style={{ color: 'var(--foreground)' }}
        >
          Reviews
        </h1>
        <p
          className='mb-8 text-sm'
          style={{ color: 'var(--muted-foreground)' }}
        >
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} for{' '}
          {gear.name}
        </p>

        {/* Summary card */}
        {reviews.length > 0 && (
          <div
            className='mb-8 rounded-2xl border p-6'
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
            }}
          >
            <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
              {/* Big number */}
              <div className='flex flex-col items-center text-center sm:w-32 sm:shrink-0'>
                <span
                  className='text-5xl font-black'
                  style={{ color: 'var(--foreground)' }}
                >
                  {avgRating.toFixed(1)}
                </span>
                <StarRating rating={Math.round(avgRating)} />
                <p
                  className='mt-1 text-xs'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Bars */}
              <div className='flex-1 space-y-2'>
                {ratingCounts.map(({ star, count }) => (
                  <RatingBar
                    key={star}
                    label={`${star} ★`}
                    count={count}
                    total={reviews.length}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <div
            className='flex flex-col items-center justify-center rounded-2xl border py-16 text-center'
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
              Rent this gear to be the first to leave a review.
            </p>
          </div>
        ) : (
          <>
            <div className='space-y-4'>
              {paged.map((review) => (
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
                    <div className='flex items-center gap-2'>
                      <StarRating rating={review.rating} />
                      <span
                        className='rounded-full px-2 py-0.5 text-xs font-bold'
                        style={{
                          backgroundColor:
                            'color-mix(in srgb, #f59e0b 15%, transparent)',
                          color: '#b45309',
                        }}
                      >
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  <p
                    className='mt-3 text-sm leading-relaxed'
                    style={{ color: 'var(--foreground)' }}
                  >
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='mt-8 flex items-center justify-center gap-2'>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className='flex h-9 w-9 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                    backgroundColor: 'var(--card)',
                  }}
                >
                  <ChevronLeft className='h-4 w-4' />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className='flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors'
                      style={
                        n === page
                          ? {
                              backgroundColor: 'var(--primary)',
                              borderColor: 'var(--primary)',
                              color: '#fff',
                            }
                          : {
                              borderColor: 'var(--border)',
                              color: 'var(--foreground)',
                              backgroundColor: 'var(--card)',
                            }
                      }
                    >
                      {n}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className='flex h-9 w-9 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                    backgroundColor: 'var(--card)',
                  }}
                >
                  <ChevronRight className='h-4 w-4' />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
