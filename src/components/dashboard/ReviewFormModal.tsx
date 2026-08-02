'use client';

import { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import Modal from '@/components/Modal';

interface ReviewFormModalProps {
  /** Whether the modal is open. */
  open: boolean;
  /** Called when the modal should close. */
  onClose: () => void;
  /** Called after a review is successfully created or updated. The new/updated review data is passed back. */
  onSuccess: (review: { rating: number; comment: string }) => void;
  /** The submit handler. Receives validated rating & comment. Should return { success, error? }. */
  onSubmit: (data: {
    rating: number;
    comment: string;
  }) => Promise<{ success: boolean; error?: string | null }>;
  /** Optional initial values for editing an existing review. */
  initialRating?: number;
  initialComment?: string;
  /** Modal title. Defaults to "Write a Review". */
  title?: string;
  /** Label for the submit button. Defaults to "Submit Review". */
  submitLabel?: string;
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
          className={`h-5 w-5 ${interactive ? 'cursor-pointer' : ''}`}
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

export function ReviewFormModal({
  open,
  onClose,
  onSuccess,
  onSubmit,
  initialRating = 0,
  initialComment = '',
  title = 'Write a Review',
  submitLabel = 'Submit Review',
}: ReviewFormModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [saving, setSaving] = useState(false);

  // Reset form when modal opens with new initial values
  useEffect(() => {
    if (open) {
      setRating(initialRating);
      setComment(initialComment);
    }
  }, [open, initialRating, initialComment]);

  const isEditing = initialRating > 0 || initialComment.length > 0;

  const hasChanges =
    rating !== initialRating || comment.trim() !== initialComment;

  const canSubmit =
    rating >= 1 &&
    rating <= 5 &&
    comment.trim().length > 0 &&
    comment.trim().length <= 100 &&
    (isEditing ? hasChanges : true);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setSaving(true);
    const result = await onSubmit({
      rating,
      comment: comment.trim(),
    });
    setSaving(false);

    if (result.success) {
      onSuccess({ rating, comment: comment.trim() });
      onClose();
    } else {
      // Error is expected to be handled by the parent (toast, etc.)
      // We still close the modal on success, but keep it open on error
      // so the user can retry. The parent's onSubmit should toast the error.
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => !saving && onClose()}
      title={title}
      noFooter
    >
      <div className='space-y-4'>
        {/* Rating */}
        <div>
          <label
            className='mb-2 block text-sm font-medium'
            style={{ color: 'var(--foreground)' }}
          >
            Rating
          </label>
          <StarRating rating={rating} interactive onChange={setRating} />
          {rating > 0 && (
            <p
              className='mt-1 text-xs'
              style={{ color: 'var(--muted-foreground)' }}
            >
              {rating}/5
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label
            className='mb-2 block text-sm font-medium'
            style={{ color: 'var(--foreground)' }}
          >
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={100}
            placeholder='Share your experience with this gear...'
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
            {comment.length}/100 characters
          </p>
        </div>

        {/* Actions */}
        <div className='flex justify-end gap-3'>
          <button
            onClick={() => !saving && onClose()}
            disabled={saving}
            className='cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50'
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !canSubmit}
            className='inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50'
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {saving && <Loader2 className='h-4 w-4 animate-spin' />}
            {submitLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
