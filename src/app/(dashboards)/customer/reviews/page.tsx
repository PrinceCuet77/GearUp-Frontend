'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ReviewSkeleton } from '@/components/ui/Skeleton';
import type { Review } from '@/lib/types';
import { DUMMY_REVIEWS, DUMMY_CUSTOMER } from '@/lib/dummy-data';

const MY_REVIEWS = DUMMY_REVIEWS.filter(
  (r) => r.customerId === DUMMY_CUSTOMER.id,
);
const LIMIT = 10;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className='h-3.5 w-3.5'
          style={{
            color: i < rating ? '#f59e0b' : 'var(--border)',
            fill: i < rating ? '#f59e0b' : 'transparent',
          }}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);

    // ── DEMO MODE: API call commented out ──────────────────────────────
    // const res = await fetch(`${API_URL}/api/reviews?page=${page}&limit=10`, {
    //   credentials: 'include', cache: 'no-store',
    // });
    // const json = await res.json();
    // setReviews(json.data ?? []);
    // setTotalPages(json.meta?.totalPages ?? 1);
    // setTotal(json.meta?.total ?? 0);
    await new Promise((r) => setTimeout(r, 200));
    const start = (page - 1) * LIMIT;
    setReviews(MY_REVIEWS.slice(start, start + LIMIT));
    setTotalPages(Math.ceil(MY_REVIEWS.length / LIMIT));
    setTotal(MY_REVIEWS.length);
    // ───────────────────────────────────────────────────────────────────────

    setLoading(false);
  }, [page]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete this review?')) return;
    setDeleting(reviewId);

    // ── DEMO MODE: API call commented out ──────────────────────────────
    // const res = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
    //   method: 'DELETE', credentials: 'include',
    // });
    // if (!res.ok) throw new Error('Delete failed.');
    await new Promise((r) => setTimeout(r, 400));
    // ───────────────────────────────────────────────────────────────────────

    toast.success('Review deleted. (demo)');
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    setTotal((t) => t - 1);
    setDeleting(null);
  };

  return (
    <div>
      <PageHeader
        title='My Reviews'
        description={`${total} review${total !== 1 ? 's' : ''} submitted`}
      />

      <div
        className='rounded-xl border'
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {loading ? (
          <ReviewSkeleton rows={4} />
        ) : reviews.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <Star
              className='mb-3 h-10 w-10 opacity-30'
              style={{ color: 'var(--muted-foreground)' }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--muted-foreground)' }}
            >
              No reviews yet
            </p>
            <p
              className='mt-1 text-xs'
              style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}
            >
              Reviews can be left after returning rented gear.
            </p>
          </div>
        ) : (
          <>
            <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
              {reviews.map((review) => (
                <li key={review.id} className='p-5'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='min-w-0 flex-1'>
                      <div className='mb-1 flex flex-wrap items-center gap-2'>
                        <StarRating rating={review.rating} />
                        <span
                          className='text-xs'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <p
                        className='text-sm font-medium'
                        style={{ color: 'var(--foreground)' }}
                      >
                        {review.gearItem?.name ??
                          `Gear #${review.gearItemId.slice(0, 8)}`}
                      </p>
                      <p
                        className='mt-1 text-sm'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {review.comment}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deleting === review.id}
                      className='cursor-pointer flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors'
                      style={{ color: 'var(--muted-foreground)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#ef4444';
                        e.currentTarget.style.backgroundColor =
                          'rgba(239,68,68,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--muted-foreground)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      aria-label='Delete review'
                    >
                      {deleting === review.id ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div
                className='flex items-center justify-between border-t px-6 py-4'
                style={{ borderColor: 'var(--border)' }}
              >
                <p
                  className='text-sm'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Page {page} of {totalPages}
                </p>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
