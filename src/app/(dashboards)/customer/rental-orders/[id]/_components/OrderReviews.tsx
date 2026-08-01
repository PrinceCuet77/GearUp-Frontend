'use client';

import { useState } from 'react';
import { Star, Pencil, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import { useAuthStore } from '@/store/useAuthStore';
import type { Review } from '@/lib/types';
import { updateReview } from '@/app/(dashboards)/customer/reviews/_actions/updateReview';
import { deleteReview } from '@/app/(dashboards)/customer/reviews/_actions/deleteReview';

interface OrderReviewsProps {
  reviews: Review[];
}

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

export function OrderReviews({ reviews: initialReviews }: OrderReviewsProps) {
  const user = useAuthStore((s) => s.user);

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Check if there are any changes in the edit form
  const hasChanges =
    editingReview !== null &&
    (editRating !== editingReview.rating ||
      editComment.trim() !== editingReview.comment);

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    if (editRating < 1 || editRating > 5) {
      toast.error('Please select a rating between 1 and 5.');
      return;
    }
    if (!editComment.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }
    if (editComment.trim().length > 100) {
      toast.error('Comment cannot exceed 100 characters.');
      return;
    }

    setSavingEdit(true);
    const res = await updateReview(editingReview.id, {
      rating: editRating,
      comment: editComment.trim(),
    });
    setSavingEdit(false);

    if (res.success) {
      toast.success('Review updated successfully.');
      const updated = reviews.map((r) =>
        r.id === editingReview.id
          ? { ...r, rating: editRating, comment: editComment.trim() }
          : r,
      );
      setReviews(updated);
      setEditingReview(null);
    } else {
      toast.error(res.error ?? 'Failed to update review.');
    }
  };

  const handleDelete = async () => {
    if (!deletingReview) return;
    setDeleting(true);
    const res = await deleteReview(deletingReview.id);
    setDeleting(false);

    if (res.success) {
      toast.success('Review deleted successfully.');
      setReviews(reviews.filter((review) => review.id !== deletingReview.id));
      setDeletingReview(null);
    } else {
      toast.error(res.error ?? 'Failed to delete review.');
    }
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <div
      className='mt-4 rounded-xl border'
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div
        className='flex items-center gap-2 border-b px-5 py-4'
        style={{ borderColor: 'var(--border)' }}
      >
        <MessageSquare className='h-4 w-4' style={{ color: '#7c3aed' }} />
        <h2
          className='text-sm font-semibold'
          style={{ color: 'var(--foreground)' }}
        >
          Reviews ({reviews.length})
        </h2>
      </div>

      <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
        {reviews.map((review) => {
          const isMyReview = user && review.customerId === user.id;
          return (
            <li key={review.id} className='px-5 py-4'>
              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-3'>
                    <StarRating rating={review.rating} />
                    {isMyReview && (
                      <span
                        className='rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide'
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                        }}
                      >
                        Your Review
                      </span>
                    )}
                  </div>
                  <p
                    className='mt-2 text-sm'
                    style={{ color: 'var(--foreground)' }}
                  >
                    {review.comment}
                  </p>
                  <p
                    className='mt-1.5 text-xs'
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: 'Asia/Dhaka',
                    })}
                    {review.updatedAt !== review.createdAt && ' (edited)'}
                  </p>
                </div>

                {isMyReview && (
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => openEditModal(review)}
                      className='cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-muted'
                      title='Edit review'
                    >
                      <Pencil
                        className='h-4 w-4'
                        style={{ color: 'var(--muted-foreground)' }}
                      />
                    </button>
                    <button
                      onClick={() => setDeletingReview(review)}
                      className='cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-muted'
                      title='Delete review'
                    >
                      <Trash2
                        className='h-4 w-4'
                        style={{ color: 'var(--destructive)' }}
                      />
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Edit Modal */}
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
              className='cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors'
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
              className='inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {savingEdit && <Loader2 className='h-4 w-4 animate-spin' />}
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deletingReview}
        onClose={() => setDeletingReview(null)}
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
              onClick={() => setDeletingReview(null)}
              className='cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors'
              style={{
                backgroundColor: 'var(--muted)',
                color: 'var(--foreground)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className='inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50'
            >
              {deleting && <Loader2 className='h-4 w-4 animate-spin' />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
