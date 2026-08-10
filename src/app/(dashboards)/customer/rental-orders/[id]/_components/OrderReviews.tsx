'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { ReviewFormModal } from '@/components/dashboard/ReviewFormModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Rating } from '@/components/ui/Rating';
import { useAuthStore } from '@/store/useAuthStore';
import type { Review } from '@/lib/types';
import { updateReview } from '@/app/(dashboards)/customer/reviews/_actions/updateReview';
import { deleteReview } from '@/app/(dashboards)/customer/reviews/_actions/deleteReview';

interface OrderReviewsProps {
  reviews: Review[];
}

export function OrderReviews({ reviews: initialReviews }: OrderReviewsProps) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleSaveEdit = async (data: { rating: number; comment: string }) => {
    if (!editingReview) return { success: false };

    const res = await updateReview(editingReview.id, {
      rating: data.rating,
      comment: data.comment,
    });

    if (res.success) {
      toast.success('Review updated successfully.');
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id
            ? { ...r, rating: data.rating, comment: data.comment }
            : r,
        ),
      );
      return { success: true };
    }

    toast.error(res.error ?? 'Failed to update review.');
    return { success: false, error: res.error };
  };

  const handleDelete = async () => {
    if (!deletingReview) return;
    setDeleting(true);
    const res = await deleteReview(deletingReview.id);
    setDeleting(false);

    if (res.success) {
      toast.success('Review deleted successfully.');
      const remaining = reviews.filter(
        (review) => review.id !== deletingReview.id,
      );
      if (remaining.length === 0) {
        // Last review deleted — refresh the server component to show the empty state
        router.refresh();
      } else {
        setReviews(remaining);
      }
      setDeletingReview(null);
    } else {
      toast.error(res.error ?? 'Failed to delete review.');
    }
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <div className='surface-card mt-4 overflow-hidden'>
      <div className='flex items-center gap-2 border-b border-border px-5 py-4'>
        <MessageSquare className='h-4 w-4 text-accent' aria-hidden='true' />
        <h2 className='text-sm font-bold text-foreground'>
          Reviews ({reviews.length})
        </h2>
      </div>

      <ul className='divide-y divide-border'>
        {reviews.map((review) => {
          const isMyReview = user && review.customerId === user.id;
          return (
            <li key={review.id} className='px-5 py-4'>
              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0 flex-1'>
                  <Rating value={review.rating} size='sm' starsOnly />
                  <p className='mt-2 text-sm text-foreground'>
                    {review.comment}
                  </p>
                  <p className='mt-1.5 text-xs text-muted-foreground'>
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
                  <div className='flex shrink-0 items-center gap-2'>
                    <button
                      onClick={() => setEditingReview(review)}
                      className='cursor-pointer rounded-control p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                      aria-label='Edit review'
                      title='Edit review'
                    >
                      <Pencil className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => setDeletingReview(review)}
                      className='cursor-pointer rounded-control p-1.5 text-danger transition-colors hover:bg-danger-soft'
                      aria-label='Delete review'
                      title='Delete review'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Edit Modal */}
      <ReviewFormModal
        open={Boolean(editingReview)}
        onClose={() => setEditingReview(null)}
        onSuccess={() => setEditingReview(null)}
        onSubmit={handleSaveEdit}
        initialRating={editingReview?.rating ?? 0}
        initialComment={editingReview?.comment ?? ''}
        title='Edit Review'
        submitLabel='Save Changes'
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deletingReview)}
        onClose={() => !deleting && setDeletingReview(null)}
        onConfirm={handleDelete}
        loading={deleting}
        tone='danger'
        title='Delete Review'
        description='Are you sure you want to delete this review? This action cannot be undone.'
        confirmLabel='Delete'
      />
    </div>
  );
}
