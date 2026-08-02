'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { ReviewFormModal } from '@/components/dashboard/ReviewFormModal';
import { createReview } from '../_actions/createReview';
import { useAuthStore } from '@/store/useAuthStore';
import type { Review } from '@/lib/types';

interface WriteReviewButtonProps {
  orderId: string;
  reviews: Review[];
  onReviewCreated?: () => void;
}

export function WriteReviewButton({
  orderId,
  reviews,
  onReviewCreated,
}: WriteReviewButtonProps) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  // Check if the current user has already reviewed this order
  const hasReviewed = useMemo(() => {
    if (!user) return false;
    return reviews.some((r) => r.customerId === user.id);
  }, [reviews, user]);

  if (!user || hasReviewed) return null;

  const handleModalClose = () => {
    setModalOpen(false);
    router.refresh();
  };

  const handleSubmit = async (data: { rating: number; comment: string }) => {
    const result = await createReview({
      rating: data.rating,
      comment: data.comment,
      rentalOrderId: orderId,
    });

    if (result.success) {
      toast.success('Review submitted successfully!');
      onReviewCreated?.();
      return { success: true };
    } else {
      toast.error(result.error ?? 'Failed to submit review.');
      return { success: false, error: result.error };
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setModalOpen(true)}
        className='inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-colors'
        style={{ backgroundColor: 'var(--primary)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        <Star className='h-4 w-4' />
        Add Review
      </button>

      {/* Review form modal */}
      <ReviewFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalClose}
        onSubmit={handleSubmit}
        title='Write a Review'
        submitLabel='Submit Review'
      />
    </>
  );
}
