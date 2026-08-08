'use client';

import { use, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Review, GearItem } from '@/lib/types';
import { getReviewsForGearAction } from './_actions/getReviewsForSingleGear';
import { getSingleGearAction } from '@/app/(public)/gears/[id]/_actions/getSingleGear';
import { Skeleton } from '@/components/ui/Skeleton';
import { StarRating } from '@/app/(public)/gears/[id]/_components/StarRating';
import { RatingBar } from './_components/RatingBar';
import { ReviewsSkeleton } from './_components/ReviewsSkeleton';
import { formatDate } from '@/lib/gear-utils';

interface Props {
  params: Promise<{ id: string }>;
}

const REVIEWS_PER_PAGE = 10;

export default function GearReviewsPage({ params }: Props) {
  const { id } = use(params);

  const [gear, setGear] = useState<GearItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [gearNotFound, setGearNotFound] = useState(false);

  // Fetch gear once
  useEffect(() => {
    getSingleGearAction(id).then((res) => {
      if (res?.data) {
        setGear(res.data);
      } else {
        setGearNotFound(true);
      }
    });
  }, [id]);

  // Fetch reviews whenever the page changes. `cancelled` drops a response that
  // arrives after the reader has already paged somewhere else.
  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      setReviewsLoading(true);

      const res = await getReviewsForGearAction(
        id,
        page,
        REVIEWS_PER_PAGE,
        'createdAt',
        'desc',
      );
      if (cancelled) return;

      if (res?.data) {
        setReviews(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      } else {
        setReviews([]);
        setTotal(0);
        setTotalPages(1);
      }

      setReviewsLoading(false);
      setLoading(false);
    };

    void fetchReviews();
    return () => {
      cancelled = true;
    };
  }, [id, page]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
    }));
  }, [reviews]);

  if (gearNotFound) notFound();

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
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
          Back to {gear?.name ?? 'Gear'}
        </Link>

        <h1
          className='mb-2 text-2xl font-bold'
          style={{ color: 'var(--foreground)' }}
        >
          Reviews
        </h1>
        <div
          className='mb-8 text-sm'
          style={{ color: 'var(--muted-foreground)' }}
        >
          {loading ? (
            <Skeleton className='inline-block h-4 w-48 align-middle' />
          ) : (
            <>
              {total} review{total !== 1 ? 's' : ''} for {gear?.name ?? 'Gear'}
            </>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && <ReviewsSkeleton />}

        {/* Loaded content */}
        {!loading && (
          <>
            {/* Summary card – only when there are reviews on the current page */}
            {total > 0 && (
              <div
                className='mb-8 rounded-2xl border p-6'
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
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
                      {total} review{total !== 1 ? 's' : ''}
                    </p>
                  </div>
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
            {total === 0 ? (
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
                {reviewsLoading ? (
                  <ReviewsSkeleton count={3} />
                ) : (
                  <div className='space-y-4'>
                    {reviews.map((review) => (
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
                )}

                {/* Pagination */}
                {totalPages > 10 && (
                  <div className='mt-8 flex items-center justify-center gap-2'>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className='cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
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
                          className='cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors'
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
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className='cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
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
          </>
        )}
      </div>
    </div>
  );
}
