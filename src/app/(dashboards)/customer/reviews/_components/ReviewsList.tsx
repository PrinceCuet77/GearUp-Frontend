'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import type { Review } from '@/lib/types';
import { getAllReviews } from '../_actions/getAllReviews';
import { updateReview } from '../_actions/updateReview';

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
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Review | null>(null);

  // Edit review state
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

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

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;

    const trimmedComment = editComment.trim();

    if (editRating < 1 || editRating > 5 || !Number.isInteger(editRating)) {
      toast.error('Rating must be an integer between 1 and 5.');
      return;
    }
    if (!trimmedComment) {
      toast.error('Comment cannot be empty.');
      return;
    }
    if (trimmedComment.length > 100) {
      toast.error('Comment cannot exceed 100 characters.');
      return;
    }

    setSavingEdit(true);
    const res = await updateReview(editingReview.id, {
      rating: editRating,
      comment: trimmedComment,
    });
    setSavingEdit(false);

    if (res.success) {
      toast.success('Review updated successfully.');
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id
            ? { ...r, rating: editRating, comment: editComment.trim() }
            : r,
        ),
      );
      setEditingReview(null);
    } else {
      toast.error(res.error ?? 'Failed to update review.');
    }
  };

  const handleViewOrder = (rentalOrderId: string) => {
    router.push(`/customer/orders/${rentalOrderId}`);
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
                    <div className='flex shrink-0 items-center gap-1'>
                      <button
                        onClick={() => openEditModal(review)}
                        className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg transition-colors'
                        style={{ color: 'var(--muted-foreground)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#3b82f6';
                          e.currentTarget.style.backgroundColor =
                            'rgba(59,130,246,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            'var(--muted-foreground)';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        aria-label='Edit review'
                      >
                        <Pencil className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => handleViewOrder(review.rentalOrderId)}
                        className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg transition-colors'
                        style={{ color: 'var(--muted-foreground)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#8b5cf6';
                          e.currentTarget.style.backgroundColor =
                            'rgba(139,92,246,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            'var(--muted-foreground)';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        aria-label='View order'
                      >
                        <Eye className='h-4 w-4' />
                      </button>
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
                          e.currentTarget.style.color =
                            'var(--muted-foreground)';
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

      {/* Edit review modal */}
      <Modal
        open={!!editingReview}
        onClose={() => setEditingReview(null)}
        title='Edit Review'
        onSave={handleSaveEdit}
        saveLabel='Update'
        cancelLabel='Cancel'
        saving={savingEdit}
        footerRight
      >
        <div className='space-y-5'>
          {/* Rating */}
          <div>
            <label
              className='mb-1.5 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Rating
            </label>
            <div className='flex items-center gap-1'>
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type='button'
                  onClick={() => setEditRating(i + 1)}
                  className='cursor-pointer p-0.5 transition-transform hover:scale-110'
                  aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
                >
                  <Star
                    className='h-6 w-6 transition-colors'
                    style={{
                      color: i < editRating ? '#f59e0b' : 'var(--border)',
                      fill: i < editRating ? '#f59e0b' : 'transparent',
                    }}
                  />
                </button>
              ))}
              {editRating > 0 && (
                <span
                  className='ml-2 text-sm'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {editRating}/5
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <div className='mb-1.5 flex items-center justify-between'>
              <label
                className='text-sm font-medium'
                style={{ color: 'var(--foreground)' }}
              >
                Comment
              </label>
              <span
                className='text-xs'
                style={{
                  color:
                    editComment.length > 100
                      ? '#ef4444'
                      : 'var(--muted-foreground)',
                }}
              >
                {editComment.length}/100
              </span>
            </div>
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows={4}
              maxLength={100}
              placeholder='Write your review...'
              className='w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-1 focus:ring-ring'
              style={{
                backgroundColor: 'var(--background)',
                borderColor:
                  editComment.length > 100 ? '#ef4444' : 'var(--border)',
                color: 'var(--foreground)',
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
