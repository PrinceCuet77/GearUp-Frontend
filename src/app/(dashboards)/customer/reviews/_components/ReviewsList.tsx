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

function StarRating({
  rating,
  interactive = false,
  onChange,
}: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${interactive ? 'cursor-pointer' : ''}`}
          style={{
            color: i < (hover || rating) ? '#f59e0b' : 'var(--border)',
            fill: i < (hover || rating) ? '#f59e0b' : 'transparent',
          }}
          onMouseEnter={() => interactive && setHover(i + 1)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange?.(i + 1)}
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

  // Track if changes were made in the edit modal
  const hasChanges =
    editingReview != null &&
    (editRating !== editingReview.rating ||
      editComment.trim() !== editingReview.comment);

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
                        className='cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-muted'
                        title='Edit review'
                      >
                        <Pencil className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => handleViewOrder(review.rentalOrderId)}
                        className='cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-muted'
                        title='View order'
                      >
                        <Eye className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(review)}
                        disabled={deleting === review.id}
                        className='cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-muted'
                        title='Delete review'
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
        noFooter
      >
        <div className='space-y-4'>
          <p className='text-sm' style={{ color: 'var(--foreground)' }}>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
          <div className='flex justify-end gap-3'>
            <button
              onClick={() => setConfirmDelete(null)}
              className='rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer'
              style={{
                backgroundColor: 'var(--muted)',
                color: 'var(--foreground)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!!deleting}
              className='inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 cursor-pointer'
              style={{ backgroundColor: 'var(--destructive)' }}
            >
              {deleting && <Loader2 className='h-4 w-4 animate-spin' />}
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit review modal */}
      <Modal
        open={!!editingReview}
        onClose={() => setEditingReview(null)}
        title='Edit Review'
        noFooter
      >
        <div className='space-y-4'>
          <div>
            <label
              className='mb-2 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Rating
            </label>
            <StarRating
              rating={editRating}
              interactive
              onChange={setEditRating}
            />
          </div>
          <div>
            <label
              className='mb-2 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Comment
            </label>
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows={3}
              maxLength={100}
              className='w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
              }}
            />
            <p
              className='mt-1 text-xs'
              style={{ color: 'var(--muted-foreground)' }}
            >
              {editComment.length}/100 characters
            </p>
          </div>
          <div className='flex justify-end gap-3'>
            <button
              onClick={() => setEditingReview(null)}
              className='rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer'
              style={{
                backgroundColor: 'var(--muted)',
                color: 'var(--foreground)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={savingEdit || !hasChanges}
              className='inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {savingEdit && <Loader2 className='h-4 w-4 animate-spin' />}
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
