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
import { deleteReview } from '../_actions/deleteReview';
import { getAllReviews } from '../_actions/getAllReviews';
import { updateReview } from '../_actions/updateReview';

const LIMIT = 10;

function StarRating({
  rating,
  interactive = false,
  onChange,
  size = 'sm',
}: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hover, setHover] = useState(0);
  const [justClicked, setJustClicked] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };

  const handleClick = (i: number) => {
    if (!interactive) return;
    onChange?.(i + 1);
    setJustClicked(i);
    setTimeout(() => setJustClicked(null), 300);
  };

  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} transition-transform duration-200 ${
            interactive ? 'cursor-pointer hover:scale-125' : ''
          } ${justClicked === i ? 'scale-125' : ''}`}
          style={{
            color: i < (hover || rating) ? '#f59e0b' : 'var(--border)',
            fill: i < (hover || rating) ? '#f59e0b' : 'transparent',
          }}
          onMouseEnter={() => interactive && setHover(i + 1)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => handleClick(i)}
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
    timeZone: 'Asia/Dhaka',
  });
}

function ratingLabel(rating: number) {
  if (rating === 5) return 'Excellent';
  if (rating === 4) return 'Great';
  if (rating === 3) return 'Good';
  if (rating === 2) return 'Fair';
  return 'Poor';
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

  // View review state
  const [viewingReview, setViewingReview] = useState<Review | null>(null);

  // Animation: track which review was just deleted
  const [fadeReviewId, setFadeReviewId] = useState<string | null>(null);

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

    const result = await deleteReview(reviewId);

    if (result.success) {
      toast.success('Review deleted successfully.');
      setFadeReviewId(reviewId);
      setTimeout(() => {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        setTotal((total) => total - 1);
        setFadeReviewId(null);
      }, 300);
    } else {
      toast.error(result.error ?? 'Failed to delete review.');
    }

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
    router.push(`/customer/rental-orders/${rentalOrderId}`);
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
            <div className='mb-3 relative'>
              <Star
                className='h-10 w-10 animate-[pulse_3s_ease-in-out_infinite]'
                style={{ color: 'var(--muted-foreground)', opacity: 0.3 }}
              />
              <Star
                className='absolute -right-3 -top-2 h-5 w-5 animate-[pulse_3s_ease-in-out_1s_infinite]'
                style={{ color: 'var(--muted-foreground)', opacity: 0.2 }}
              />
            </div>
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
              {reviews.map((review, index) => (
                <li
                  key={review.id}
                  className='p-5 transition-all duration-300 hover:bg-(--muted)/30'
                  style={{
                    opacity: fadeReviewId === review.id ? 0 : 1,
                    transform:
                      fadeReviewId === review.id ? 'translateX(-10px)' : 'none',
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='min-w-0 flex-1'>
                      <div className='mb-1.5 flex flex-wrap items-center gap-2.5'>
                        <StarRating rating={review.rating} />
                        <span
                          className='rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider'
                          style={{
                            backgroundColor:
                              review.rating >= 4
                                ? '#dcfce7'
                                : review.rating >= 3
                                  ? '#fef9c3'
                                  : '#fee2e2',
                            color:
                              review.rating >= 4
                                ? '#166534'
                                : review.rating >= 3
                                  ? '#854d0e'
                                  : '#991b1b',
                          }}
                        >
                          {ratingLabel(review.rating)}
                        </span>
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
                        className='mt-1 line-clamp-2 text-sm'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {review.comment}
                      </p>
                    </div>
                    <div className='flex shrink-0 items-center gap-1 opacity-50 transition-opacity duration-200 group-hover:opacity-100 hover:opacity-100!'>
                      <button
                        onClick={() => setViewingReview(review)}
                        className='cursor-pointer rounded-lg p-1.5 transition-all duration-200 hover:bg-(--primary)/10 hover:text-primary'
                        style={{ color: 'var(--muted-foreground)' }}
                        title='View review'
                      >
                        <Eye className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => openEditModal(review)}
                        className='cursor-pointer rounded-lg p-1.5 transition-all duration-200 hover:bg-(--primary)/10 hover:text-primary'
                        style={{ color: 'var(--muted-foreground)' }}
                        title='Edit review'
                      >
                        <Pencil className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(review)}
                        disabled={deleting === review.id}
                        className='cursor-pointer rounded-lg p-1.5 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500'
                        style={{ color: 'var(--muted-foreground)' }}
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
                    className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 hover:bg-muted disabled:opacity-40'
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
                    className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 hover:bg-muted disabled:opacity-40'
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
          <div
            className='flex items-center gap-3 rounded-lg px-4 py-3'
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
            }}
          >
            <Trash2 className='h-5 w-5 shrink-0 text-red-500' />
            <p className='text-sm text-red-700'>
              This will permanently remove your review for{' '}
              <strong>
                {confirmDelete?.gearItem?.name ??
                  `Gear #${confirmDelete?.gearItemId.slice(0, 8)}`}
              </strong>
              .
            </p>
          </div>
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
              className='inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 cursor-pointer'
            >
              {deleting && <Loader2 className='h-4 w-4 animate-spin' />}
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* View review modal */}
      <Modal
        open={!!viewingReview}
        onClose={() => setViewingReview(null)}
        title='Review Details'
        noFooter
      >
        {viewingReview && (
          <div className='space-y-5'>
            {/* Gear info */}
            <div>
              <label
                className='mb-1.5 block text-xs font-semibold uppercase tracking-wider'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Gear
              </label>
              <p
                className='text-sm font-medium'
                style={{ color: 'var(--foreground)' }}
              >
                {viewingReview.gearItem?.name ??
                  `Gear #${viewingReview.gearItemId.slice(0, 8)}`}
              </p>
            </div>

            {/* Rating card */}
            <div
              className='rounded-xl p-4'
              style={{
                background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
                border: '1px solid #fde68a',
              }}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <StarRating rating={viewingReview.rating} size='lg' />
                  <span
                    className='text-sm font-semibold'
                    style={{ color: '#92400e' }}
                  >
                    {ratingLabel(viewingReview.rating)}
                  </span>
                </div>
                <div
                  className='flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold'
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                  }}
                >
                  {viewingReview.rating}/5
                </div>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label
                className='mb-1.5 block text-xs font-semibold uppercase tracking-wider'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Comment
              </label>
              <div
                className='rounded-lg border-l-4 py-3 pl-4 pr-3 text-sm italic'
                style={{
                  backgroundColor: 'var(--muted)',
                  borderColor: 'var(--primary)',
                  color: 'var(--foreground)',
                }}
              >
                &ldquo;{viewingReview.comment}&rdquo;
              </div>
            </div>

            {/* Date & action */}
            <div
              className='flex items-center justify-between rounded-lg px-4 py-3'
              style={{
                backgroundColor: 'var(--muted)',
              }}
            >
              <p
                className='text-xs'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Submitted on {formatDate(viewingReview.createdAt)}
                {viewingReview.updatedAt !== viewingReview.createdAt &&
                  ' (edited)'}
              </p>
              <button
                onClick={() => {
                  setViewingReview(null);
                  handleViewOrder(viewingReview.rentalOrderId);
                }}
                className='inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer'
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                }}
              >
                <Eye className='h-3.5 w-3.5' />
                View Order
              </button>
            </div>

            {/* Close */}
            <div className='flex justify-end'>
              <button
                onClick={() => setViewingReview(null)}
                className='rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80'
                style={{
                  backgroundColor: 'var(--muted)',
                  color: 'var(--foreground)',
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
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
