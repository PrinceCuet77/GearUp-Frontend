'use client';

import { useState } from 'react';
import {
  Pencil,
  Trash2,
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  Tag,
  Clock,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteGear } from '../_actions/deleteGear';
import Modal from '@/components/Modal';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Rating } from '@/components/ui/Rating';
import type { GearItem } from '@/lib/types';
import {
  parseGearImages,
  formatBDT,
  formatDate,
  calcAvgRating,
} from '@/lib/gear-utils';

interface GearActionsProps {
  gearId: string;
  gearName: string;
  gear?: GearItem;
  onEdit?: () => void;
}

export function GearActions({
  gearId,
  gearName,
  gear,
  onEdit,
}: GearActionsProps) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);

    const result = await deleteGear(gearId);

    if (result.success) {
      toast.success(`"${gearName}" removed from inventory.`);
      router.refresh();
    } else {
      toast.error(result.error ?? 'Failed to delete gear.');
    }

    setDeleting(false);
  };

  const gearImages = gear?.images ? parseGearImages(gear.images) : [];

  return (
    <>
      {/* Mobile view */}
      <div className='flex items-center gap-2 sm:hidden'>
        <button
          onClick={() => {
            setActiveImageIndex(0);
            setViewDetails(true);
          }}
          className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg transition-colors'
          style={{ color: 'var(--muted-foreground)' }}
        >
          <Eye className='h-4 w-4' />
        </button>
        <button
          onClick={() => onEdit?.()}
          className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg transition-colors'
          style={{ color: 'var(--muted-foreground)' }}
        >
          <Pencil className='h-4 w-4' />
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={deleting}
          className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg transition-colors'
          style={{ color: 'var(--muted-foreground)' }}
        >
          {deleting ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Trash2 className='h-4 w-4' />
          )}
        </button>
      </div>

      {/* Desktop view */}
      <div className='hidden items-center gap-2 sm:flex'>
        <button
          onClick={() => {
            setActiveImageIndex(0);
            setViewDetails(true);
          }}
          className='cursor-pointer flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors'
          style={{
            backgroundColor: 'var(--muted)',
            color: 'var(--foreground)',
          }}
        >
          <Eye className='h-3 w-3' />
        </button>
        <button
          onClick={() => onEdit?.()}
          className='cursor-pointer flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors'
          style={{
            backgroundColor: 'var(--muted)',
            color: 'var(--foreground)',
          }}
        >
          <Pencil className='h-3 w-3' />
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={deleting}
          aria-label={`Delete ${gearName}`}
          className='flex h-8 cursor-pointer items-center gap-1.5 rounded-control bg-danger-soft px-3 text-xs font-medium text-danger transition-colors disabled:opacity-50'
        >
          {deleting ? (
            <Loader2 className='h-3 w-3 animate-spin' />
          ) : (
            <Trash2 className='h-3 w-3' />
          )}
        </button>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => !deleting && setConfirmDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        tone='danger'
        title='Delete Gear'
        confirmLabel='Delete'
        description={
          <>
            Are you sure you want to delete this gear named{' '}
            <strong className='text-foreground'>{gearName}</strong>? This action
            cannot be undone.
          </>
        }
      />

      {/* View Details Modal */}
      <Modal
        open={viewDetails}
        onClose={() => setViewDetails(false)}
        title='Gear Details'
        noFooter
        maxWidth='max-w-3xl'
      >
        {gear ? (
          <div className='space-y-6'>
            {/* Image Gallery */}
            {gearImages.length > 0 && (
              <div className='space-y-3'>
                {/* Main Image */}
                <div
                  className='relative overflow-hidden rounded-xl'
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <img
                    src={gearImages[activeImageIndex]}
                    alt={gear.name}
                    className='h-64 w-full object-cover sm:h-80 transition-all duration-300'
                  />

                  {/* Navigation Arrows */}
                  {gearImages.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === 0 ? gearImages.length - 1 : prev - 1,
                          )
                        }
                        className='absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110 cursor-pointer'
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          color: 'white',
                        }}
                      >
                        <ChevronLeft className='h-5 w-5' />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === gearImages.length - 1 ? 0 : prev + 1,
                          )
                        }
                        className='absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110 cursor-pointer'
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          color: 'white',
                        }}
                      >
                        <ChevronRight className='h-5 w-5' />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div
                    className='absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md'
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                    }}
                  >
                    {activeImageIndex + 1} / {gearImages.length}
                  </div>

                  {/* Status Badge */}
                  <div className='absolute top-3 left-3'>
                    <Badge
                      tone={gear.isActive ? 'secondary' : 'danger'}
                      size='md'
                      className='backdrop-blur-md'
                      icon={
                        <span className='h-1.5 w-1.5 rounded-full bg-current' />
                      }
                    >
                      {gear.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {gearImages.length > 1 && (
                  <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-thin'>
                    {gearImages.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className='shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all duration-200 hover:opacity-100'
                        style={{
                          opacity: activeImageIndex === i ? 1 : 0.5,
                          border:
                            activeImageIndex === i
                              ? '2px solid var(--primary)'
                              : '2px solid transparent',
                          transform:
                            activeImageIndex === i ? 'scale(1.05)' : 'scale(1)',
                        }}
                      >
                        <img
                          src={src}
                          alt={`Thumbnail ${i + 1}`}
                          className='h-16 w-16 object-cover'
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Info Cards */}
            <div className='grid gap-4 sm:grid-cols-2'>
              {/* Name & Category Card */}
              <div
                className='rounded-xl p-4 space-y-3'
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className='flex items-start justify-between gap-2'>
                  <div className='space-y-1 flex-1 min-w-0'>
                    <p
                      className='text-xs font-medium uppercase tracking-wider'
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      Gear Name
                    </p>
                    <p
                      className='text-base font-semibold truncate'
                      style={{ color: 'var(--foreground)' }}
                    >
                      {gear.name}
                    </p>
                  </div>
                </div>

                {gear.category && (
                  <div className='flex items-center gap-2'>
                    <Tag
                      className='h-3.5 w-3.5 shrink-0'
                      style={{ color: 'var(--muted-foreground)' }}
                    />
                    <span
                      className='inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium'
                      style={{
                        backgroundColor: 'var(--muted)',
                        color: 'var(--foreground)',
                      }}
                    >
                      {gear.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Price & Stock Card */}
              <div
                className='rounded-xl p-4 space-y-3'
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className='space-y-1'>
                  <p
                    className='text-xs font-medium uppercase tracking-wider'
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Rental Price
                  </p>
                  <p
                    className='text-2xl font-bold'
                    style={{ color: 'var(--primary)' }}
                  >
                    {formatBDT(gear.price)}
                    <span
                      className='text-xs font-normal ml-1'
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      / day
                    </span>
                  </p>
                </div>

                <div className='flex items-center gap-2 pt-1'>
                  <Package
                    className='h-4 w-4'
                    style={{ color: 'var(--muted-foreground)' }}
                  />
                  <span
                    className='text-sm'
                    style={{ color: 'var(--foreground)' }}
                  >
                    <span className='font-semibold'>{gear.stock}</span>{' '}
                    <span style={{ color: 'var(--muted-foreground)' }}>
                      available
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Rating & Provider Row */}
            <div className='grid gap-4 sm:grid-cols-2'>
              {/* Rating */}
              {gear.reviews && gear.reviews.length > 0 && (
                <div
                  className='rounded-xl p-4 space-y-2'
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className='flex items-center justify-between'>
                    <p
                      className='text-xs font-medium uppercase tracking-wider'
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      Rating
                    </p>
                    <span
                      className='text-xs'
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {gear.reviews.length} review
                      {gear.reviews.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <Rating value={calcAvgRating(gear.reviews)} size='md' />
                </div>
              )}

              {/* Provider */}
              {gear.provider && (
                <div
                  className='rounded-xl p-4 space-y-2'
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <p
                    className='text-xs font-medium uppercase tracking-wider'
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Provider
                  </p>
                  <div className='flex items-center gap-3'>
                    <div
                      className='flex h-9 w-9 items-center justify-center rounded-full'
                      style={{ backgroundColor: 'var(--muted)' }}
                    >
                      {gear.provider.avatarUrl ? (
                        <img
                          src={gear.provider.avatarUrl}
                          alt={gear.provider.name ?? 'Provider'}
                          className='h-9 w-9 rounded-full object-cover'
                        />
                      ) : (
                        <User
                          className='h-4 w-4'
                          style={{ color: 'var(--muted-foreground)' }}
                        />
                      )}
                    </div>
                    <div className='min-w-0'>
                      <p
                        className='text-sm font-medium truncate'
                        style={{ color: 'var(--foreground)' }}
                      >
                        {gear.provider.name}
                      </p>
                      <p
                        className='text-xs truncate'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {gear.provider.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div
              className='rounded-xl p-4 space-y-2'
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
              }}
            >
              <p
                className='text-xs font-medium uppercase tracking-wider'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Description
              </p>
              <p
                className='text-sm leading-relaxed whitespace-pre-wrap'
                style={{ color: 'var(--foreground)' }}
              >
                {gear.description || 'No description provided.'}
              </p>
            </div>

            {/* Recent Reviews */}
            {gear.reviews && gear.reviews.length > 0 && (
              <div
                className='rounded-xl p-4 space-y-3'
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                }}
              >
                <p
                  className='text-xs font-medium uppercase tracking-wider'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Recent Reviews
                </p>
                <div className='space-y-3'>
                  {gear.reviews.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      className='rounded-lg p-3 space-y-2'
                      style={{ backgroundColor: 'var(--muted)' }}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Rating value={review.rating} size='sm' starsOnly />
                          {review.customer && (
                            <span
                              className='text-xs font-medium'
                              style={{ color: 'var(--foreground)' }}
                            >
                              {review.customer.name}
                            </span>
                          )}
                        </div>
                        <span
                          className='text-xs'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      {review.comment && (
                        <p
                          className='text-xs leading-relaxed'
                          style={{ color: 'var(--foreground)' }}
                        >
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div
              className='flex flex-wrap items-center gap-x-6 gap-y-2 text-xs'
              style={{ color: 'var(--muted-foreground)' }}
            >
              <div className='flex items-center gap-1.5'>
                <Clock className='h-3.5 w-3.5' />
                <span>Created: {formatDate(gear.createdAt)}</span>
              </div>
              <div className='flex items-center gap-1.5'>
                <Clock className='h-3.5 w-3.5' />
                <span>Updated: {formatDate(gear.updatedAt)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p
            className='text-sm py-8 text-center'
            style={{ color: 'var(--muted-foreground)' }}
          >
            No details available.
          </p>
        )}
      </Modal>
    </>
  );
}
