'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ReviewFormModal } from '@/components/dashboard/ReviewFormModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Rating } from '@/components/ui/Rating';
import { ReviewSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import type { Review } from '@/lib/types';
import { deleteReview } from '../_actions/deleteReview';
import { getAllReviews } from '../_actions/getAllReviews';
import { updateReview } from '../_actions/updateReview';

const LIMIT = 10;

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

/** Sentiment tone stays inside the brand + state palette. */
function ratingTone(rating: number): BadgeTone {
  if (rating >= 4) return 'secondary';
  if (rating >= 3) return 'warning';
  return 'danger';
}

function gearLabel(review: Review) {
  return review.gearItem?.name ?? `Gear #${review.gearItemId.slice(0, 8)}`;
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
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Review | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [viewingReview, setViewingReview] = useState<Review | null>(null);

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
    setDeleting(true);

    const result = await deleteReview(reviewId);
    setDeleting(false);

    if (result.success) {
      toast.success('Review deleted successfully.');
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      setTotal((t) => Math.max(0, t - 1));
      setConfirmDelete(null);
    } else {
      toast.error(result.error ?? 'Failed to delete review.');
    }
  };

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

  const iconButton =
    'cursor-pointer rounded-control p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';

  return (
    <div>
      <PageHeader
        title='My Reviews'
        description={`${total} review${total !== 1 ? 's' : ''} submitted`}
      />

      {loading ? (
        <ReviewSkeleton rows={4} />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title='No reviews yet'
          description='Reviews can be left after returning rented gear.'
          action={
            <ButtonLink href='/customer/rental-orders' size='sm'>
              View my rentals
            </ButtonLink>
          }
        />
      ) : (
        <div className='surface-card overflow-hidden'>
          <ul className='divide-y divide-border'>
            {reviews.map((review) => (
              <li
                key={review.id}
                className='p-5 transition-colors hover:bg-muted/40'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='min-w-0 flex-1'>
                    <div className='mb-1.5 flex flex-wrap items-center gap-2.5'>
                      <Rating value={review.rating} size='sm' starsOnly />
                      <Badge tone={ratingTone(review.rating)} size='sm'>
                        {ratingLabel(review.rating)}
                      </Badge>
                      <span className='text-xs text-muted-foreground'>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className='text-sm font-semibold text-foreground'>
                      {gearLabel(review)}
                    </p>
                    <p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
                      {review.comment}
                    </p>
                  </div>

                  <div className='flex shrink-0 items-center gap-1'>
                    <button
                      onClick={() => setViewingReview(review)}
                      className={iconButton}
                      aria-label={`View review for ${gearLabel(review)}`}
                      title='View review'
                    >
                      <Eye className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => setEditingReview(review)}
                      className={iconButton}
                      aria-label={`Edit review for ${gearLabel(review)}`}
                      title='Edit review'
                    >
                      <Pencil className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(review)}
                      className={cn(
                        iconButton,
                        'hover:bg-danger-soft hover:text-danger',
                      )}
                      aria-label={`Delete review for ${gearLabel(review)}`}
                      title='Delete review'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className='flex items-center justify-between gap-4 border-t border-border px-6 py-4'>
              <p className='text-sm text-muted-foreground'>
                Page {page} of {totalPages}
              </p>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  aria-label='Previous page'
                  className='w-9 px-0'
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, page + 1))
                  }
                  disabled={page === totalPages}
                  aria-label='Next page'
                  className='w-9 px-0'
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => !deleting && setConfirmDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        tone='danger'
        title='Delete Review'
        confirmLabel='Delete'
        description={
          <>
            This will permanently remove your review for{' '}
            <strong className='text-foreground'>
              {confirmDelete ? gearLabel(confirmDelete) : ''}
            </strong>
            .
          </>
        }
      />

      {/* View review modal */}
      <Modal
        open={Boolean(viewingReview)}
        onClose={() => setViewingReview(null)}
        title='Review Details'
        noFooter
      >
        {viewingReview && (
          <div className='space-y-5'>
            <div>
              <span className='mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase'>
                Gear
              </span>
              <p className='text-sm font-semibold text-foreground'>
                {gearLabel(viewingReview)}
              </p>
            </div>

            {/* Rating card */}
            <div className='rounded-control border border-warning/25 bg-warning-soft p-4'>
              <div className='flex items-center justify-between gap-3'>
                <div className='flex items-center gap-3'>
                  <Rating value={viewingReview.rating} size='lg' starsOnly />
                  <span className='text-sm font-bold text-warning-soft-foreground'>
                    {ratingLabel(viewingReview.rating)}
                  </span>
                </div>
                <span className='flex h-10 w-10 items-center justify-center rounded-full bg-warning text-sm font-bold text-background'>
                  {viewingReview.rating}/5
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <span className='mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase'>
                Comment
              </span>
              <blockquote className='rounded-control border-l-4 border-primary bg-muted py-3 pr-3 pl-4 text-sm text-foreground italic'>
                &ldquo;{viewingReview.comment}&rdquo;
              </blockquote>
            </div>

            {/* Date & action */}
            <div className='flex flex-wrap items-center justify-between gap-3 rounded-control bg-muted px-4 py-3'>
              <p className='text-xs text-muted-foreground'>
                Submitted on {formatDate(viewingReview.createdAt)}
                {viewingReview.updatedAt !== viewingReview.createdAt &&
                  ' (edited)'}
              </p>
              <Button
                size='sm'
                leadingIcon={<Eye className='h-3.5 w-3.5' />}
                onClick={() => {
                  const orderId = viewingReview.rentalOrderId;
                  setViewingReview(null);
                  router.push(`/customer/rental-orders/${orderId}`);
                }}
              >
                View Order
              </Button>
            </div>

            <div className='flex justify-end'>
              <Button variant='outline' onClick={() => setViewingReview(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit review modal */}
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
    </div>
  );
}
