'use client';

import { useState, useCallback } from 'react';
import { Star, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import type { Review } from '@/lib/types';
import { getAllReviews } from '../_actions/getAllReviews';

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

interface ReviewsListProps {
  initialReviews: Review[];
  initialTotalPages: number;
  initialTotal: number;
}

export function ReviewsList({
  initialReviews,
  initialTotalPages,
  initialTotal,
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Review | null>(null);

  const fetchReviews = useCallback(async (targetPage: number) => {
    setLoading(true);

    const res = await getAllReviews({ page: targetPage, limit: LIMIT });

    if (res.success) {
      setReviews(res.data);
      setTotalPages(res.meta?.totalPages ?? 1);
      setTotal(res.meta?.total ?? res.data.length);
    } else {
      toast.error(res.error ?? 'Failed to load reviews.');
      setReviews([]);
      setTotalPages(1);
      setTotal(0);
    }

    setLoading(false);
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    void fetchReviews(newPage);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const reviewId = confirmDelete.id;
    setDeleting(reviewId);
    setConfirmDelete(null);

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
          <div className='p-5'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='mb-4 animate-pulse'
                style={{
                  borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                  paddingBottom: '1rem',
                }}
              >
                <div className='mb-2 flex items-center gap-2'>
                  <div
                    className='h-4 w-24 rounded'
                    style={{ backgroundColor: 'var(--muted)' }}
                  />
                  <div
                    className='h-3.5 w-20 rounded'
                    style={{ backgroundColor: 'var(--muted)' }}
                  />
                </div>
                <div
                  className='mb-1.5 h-3.5 w-3/4 rounded'
                  style={{ backgroundColor: 'var(--muted)' }}
                />
                <div
                  className='h-3 w-1/2 rounded'
                  style={{ backgroundColor: 'var(--muted)' }}
                />
              </div>
            ))}
          </div>
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
                      onClick={() => setConfirmDelete(review)}
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
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
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
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, page + 1))
                    }
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

      {/* Delete confirmation modal */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title='Delete Review'
        onSave={handleDelete}
        saveLabel='Delete'
        cancelLabel='Cancel'
        saving={!!deleting}
        footerRight
      >
        <p className='text-sm' style={{ color: 'var(--foreground)' }}>
          Do you want to delete this review?
        </p>
      </Modal>
    </div>
  );
}
