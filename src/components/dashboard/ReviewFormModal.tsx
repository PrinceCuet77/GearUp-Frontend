'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { cn } from '@/lib/cn';

const MAX_COMMENT = 100;

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

/**
 * Interactive star picker. Rendered as a radio group so it is reachable and
 * operable by keyboard, not just by mouse.
 */
function StarPicker({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || rating;

  return (
    <div
      className='flex items-center gap-0.5'
      role='radiogroup'
      aria-label='Rating out of 5'
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1;
        return (
          <button
            key={value}
            type='button'
            role='radio'
            aria-checked={rating === value}
            aria-label={`${value} star${value === 1 ? '' : 's'}`}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(value)}
            className='cursor-pointer rounded p-0.5'
          >
            <Star
              className={cn(
                'h-6 w-6 transition-colors',
                value <= shown ? 'text-warning' : 'text-border-strong',
              )}
              fill='currentColor'
              aria-hidden='true'
            />
          </button>
        );
      })}
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

  // Seed the form from the initial values each time the modal opens. Done
  // during render so the first painted frame already shows the right values -
  // an effect would flash the previous review's text for one frame.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setRating(initialRating);
      setComment(initialComment);
    }
  }

  const isEditing = initialRating > 0 || initialComment.length > 0;

  const hasChanges =
    rating !== initialRating || comment.trim() !== initialComment;

  const canSubmit =
    rating >= 1 &&
    rating <= 5 &&
    comment.trim().length > 0 &&
    comment.trim().length <= MAX_COMMENT &&
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
    }
    // On failure the modal stays open so the user can retry; the parent's
    // onSubmit is responsible for surfacing the error toast.
  };

  return (
    <Modal
      open={open}
      onClose={() => !saving && onClose()}
      title={title}
      noFooter
    >
      <form
        className='space-y-4'
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Rating */}
        <div>
          <span className='field-label'>Rating</span>
          <StarPicker rating={rating} onChange={setRating} />
          <p className='field-hint' aria-live='polite'>
            {rating > 0 ? `${rating}/5 selected` : 'Select a rating'}
          </p>
        </div>

        {/* Comment */}
        <FormField
          label='Comment'
          hint={`${comment.length}/${MAX_COMMENT} characters`}
          required
        >
          {(props) => (
            <textarea
              {...props}
              className={cn(props.className, 'resize-none')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={MAX_COMMENT}
              placeholder='Share your experience with this gear…'
            />
          )}
        </FormField>

        {/* Actions */}
        <div className='flex justify-end gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={() => !saving && onClose()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={!canSubmit}
            loading={saving}
            loadingText='Saving…'
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
