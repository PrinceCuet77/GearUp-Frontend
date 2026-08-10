'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Pencil, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ReviewFormModal } from '@/components/dashboard/ReviewFormModal';
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { TableToolbar } from '@/components/dashboard/TableToolbar';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { useClientTable } from '@/lib/hooks';
import { formatShortDate, formatDate } from '@/lib/gear-utils';
import { cn } from '@/lib/cn';
import type { Review } from '@/lib/types';
import { deleteReview } from '../_actions/deleteReview';
import { updateReview } from '../_actions/updateReview';

const PAGE_SIZE = 10;

const RATING_OPTIONS = [
  { value: '', label: 'All ratings' },
  { value: '5', label: '5 stars' },
  { value: '4', label: '4 stars' },
  { value: '3', label: '3 stars' },
  { value: '2', label: '2 stars' },
  { value: '1', label: '1 star' },
];

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
  initialError?: string | null;
}

/**
 * The customer's reviews as a filterable table.
 *
 * The full set is loaded once by the page, so rating filters and search apply
 * across every review rather than only the page currently in view.
 */
export function ReviewsList({ initialReviews }: ReviewsListProps) {
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Review | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [viewingReview, setViewingReview] = useState<Review | null>(null);

  const table = useClientTable(reviews, {
    pageSize: PAGE_SIZE,
    searchAccessor: (review) => `${gearLabel(review)} ${review.comment}`,
    filters: [
      {
        key: 'rating',
        label: 'Rating',
        options: RATING_OPTIONS,
        accessor: (review) => String(review.rating),
      },
    ],
    sorters: {
      rating: (review) => review.rating,
      createdAt: (review) => new Date(review.createdAt).getTime(),
    },
    initialSort: { key: 'createdAt', direction: 'desc' },
  });

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const reviewId = confirmDelete.id;
    setDeleting(true);

    const result = await deleteReview(reviewId);
    setDeleting(false);

    if (!result.success) {
      toast.error(result.error ?? 'Failed to delete review.');
      return;
    }

    toast.success('Review deleted.');
    setReviews((previous) => previous.filter((review) => review.id !== reviewId));
    setConfirmDelete(null);
  };

  const handleSaveEdit = async (data: { rating: number; comment: string }) => {
    if (!editingReview) return { success: false };

    const result = await updateReview(editingReview.id, data);

    if (result.success) {
      toast.success('Review updated.');
      setReviews((previous) =>
        previous.map((review) =>
          review.id === editingReview.id ? { ...review, ...data } : review,
        ),
      );
      return { success: true };
    }

    toast.error(result.error ?? 'Failed to update review.');
    return { success: false, error: result.error };
  };

  const iconButton =
    'cursor-pointer rounded-control p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';

  const columns: Array<DataTableColumn<Review>> = [
    {
      id: 'gear',
      header: 'Gear',
      cell: (review) => (
        <div className='min-w-0'>
          <p className='truncate font-medium text-foreground'>
            {gearLabel(review)}
          </p>
          <p className='max-w-sm truncate text-xs text-muted-foreground'>
            {review.comment}
          </p>
        </div>
      ),
    },
    {
      id: 'rating',
      header: 'Rating',
      sortable: true,
      cell: (review) => (
        <div className='flex items-center gap-2'>
          <Rating value={review.rating} size='sm' starsOnly />
          <Badge tone={ratingTone(review.rating)} size='sm'>
            {ratingLabel(review.rating)}
          </Badge>
        </div>
      ),
    },
    {
      id: 'createdAt',
      header: 'Submitted',
      hideBelow: 'md',
      sortable: true,
      cell: (review) => (
        <span className='whitespace-nowrap text-muted-foreground'>
          {formatShortDate(review.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      srOnlyHeader: true,
      cell: (review) => (
        <div className='flex items-center justify-end gap-1'>
          <button
            type='button'
            onClick={() => setViewingReview(review)}
            className={iconButton}
            aria-label={`View review for ${gearLabel(review)}`}
            title='View review'
          >
            <Eye className='h-4 w-4' aria-hidden='true' />
          </button>
          <button
            type='button'
            onClick={() => setEditingReview(review)}
            className={iconButton}
            aria-label={`Edit review for ${gearLabel(review)}`}
            title='Edit review'
          >
            <Pencil className='h-4 w-4' aria-hidden='true' />
          </button>
          <button
            type='button'
            onClick={() => setConfirmDelete(review)}
            className={cn(iconButton, 'hover:bg-danger-soft hover:text-danger')}
            aria-label={`Delete review for ${gearLabel(review)}`}
            title='Delete review'
          >
            <Trash2 className='h-4 w-4' aria-hidden='true' />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title='My Reviews'
        description={`${reviews.length} review${reviews.length === 1 ? '' : 's'} submitted.`}
      />

      <TableToolbar
        searchValue={table.search}
        onSearchChange={table.setSearch}
        searchLabel='Find a review'
        searchPlaceholder='Search by gear or comment…'
        selects={[
          {
            key: 'rating',
            label: 'Rating',
            value: table.filterValues.rating ?? '',
            options: RATING_OPTIONS,
            onChange: (value) => table.setFilter('rating', value),
          },
        ]}
        hasActiveFilters={table.hasActiveFilters}
        onClearFilters={table.clearFilters}
      />

      <DataTable
        caption='Reviews you have written'
        columns={columns}
        rows={table.rows}
        getRowKey={(review) => review.id}
        emptyIcon={Star}
        emptyTitle={
          table.hasActiveFilters ? 'No matching reviews' : 'No reviews yet'
        }
        emptyDescription={
          table.hasActiveFilters
            ? 'Try a different search term or rating.'
            : 'Reviews can be left once you have returned a rental.'
        }
        emptyAction={
          !table.hasActiveFilters && (
            <ButtonLink href='/customer/rental-orders' size='sm'>
              View my rentals
            </ButtonLink>
          )
        }
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSort={table.toggleSort}
        footer={
          <Pagination
            page={table.page}
            totalPages={table.totalPages}
            total={table.filteredCount}
            pageSize={PAGE_SIZE}
            onPageChange={table.setPage}
            itemLabel='reviews'
          />
        }
      />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => !deleting && setConfirmDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        tone='danger'
        title='Delete review'
        confirmLabel='Delete'
        description={
          <>
            This permanently removes your review for{' '}
            <strong className='text-foreground'>
              {confirmDelete ? gearLabel(confirmDelete) : ''}
            </strong>
            .
          </>
        }
      />

      <Modal
        open={Boolean(viewingReview)}
        onClose={() => setViewingReview(null)}
        title='Review details'
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

            <div>
              <span className='mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase'>
                Comment
              </span>
              <blockquote className='rounded-control border-l-4 border-primary bg-muted py-3 pr-3 pl-4 text-sm text-foreground italic'>
                &ldquo;{viewingReview.comment}&rdquo;
              </blockquote>
            </div>

            <div className='flex flex-wrap items-center justify-between gap-3 rounded-control bg-muted px-4 py-3'>
              <p className='text-xs text-muted-foreground'>
                Submitted on {formatDate(viewingReview.createdAt)}
                {viewingReview.updatedAt !== viewingReview.createdAt &&
                  ' (edited)'}
              </p>
              <Button
                size='sm'
                leadingIcon={<Eye className='h-3.5 w-3.5' aria-hidden='true' />}
                onClick={() => {
                  const orderId = viewingReview.rentalOrderId;
                  setViewingReview(null);
                  router.push(`/customer/rental-orders/${orderId}`);
                }}
              >
                View order
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

      <ReviewFormModal
        open={Boolean(editingReview)}
        onClose={() => setEditingReview(null)}
        onSuccess={() => setEditingReview(null)}
        onSubmit={handleSaveEdit}
        initialRating={editingReview?.rating ?? 0}
        initialComment={editingReview?.comment ?? ''}
        title='Edit review'
        submitLabel='Save changes'
      />
    </div>
  );
}
