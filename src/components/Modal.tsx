'use client';

/**
 * Reusable app-wide modal.
 *
 * Layout:
 *   Header  – title (left) + × close button (right)
 *   Body    – scrollable children
 *   Footer  – [Cancel] [Save] buttons
 *
 * Features:
 *   • Blur backdrop over the themed `--overlay` scrim
 *   • Click outside → close
 *   • Escape key → close
 *   • Body-scroll lock while open
 *   • Labelled by its own title for screen readers
 */

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Panel title shown in the header. */
  title?: string;
  /** Called when the primary action button is clicked. */
  onSave?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  /** Shows a spinner and disables buttons while true. */
  saving?: boolean;
  children: ReactNode;
  /**
   * Hide the footer entirely (e.g. for read-only info modals).
   * Cancel/Save buttons won't render.
   */
  noFooter?: boolean;
  /** Tailwind max-width class for the panel. Default `max-w-lg`. */
  maxWidth?: string;
  /** Disable the Save button (independent of `saving`). */
  saveDisabled?: boolean;
  /** Align footer buttons to the right instead of the left. */
  footerRight?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  onSave,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  saving = false,
  children,
  noFooter = false,
  maxWidth = 'max-w-lg',
  saveDisabled = false,
  footerRight = false,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, saving, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      style={{ backgroundColor: 'var(--overlay)' }}
      onMouseDown={(e) => {
        // Close only when clicking the backdrop itself
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      {/* Blur layer */}
      <div className='pointer-events-none absolute inset-0 backdrop-blur-sm' />

      {/* Panel */}
      <div
        ref={panelRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? titleId : undefined}
        className={`surface-card relative z-10 flex max-h-[90vh] w-full ${maxWidth} flex-col shadow-xl`}
      >
        {/* Header */}
        <div className='flex shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4'>
          {title ? (
            <h2 id={titleId} className='text-base font-bold text-foreground'>
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            onClick={() => !saving && onClose()}
            aria-label='Close modal'
            className='ml-auto flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* Body */}
        <div className='flex-1 overflow-y-auto px-6 py-5'>{children}</div>

        {/* Footer */}
        {!noFooter && (
          <div
            className={`flex shrink-0 items-center gap-3 border-t border-border px-6 py-4 ${footerRight ? 'justify-end' : ''}`}
          >
            <Button
              variant='outline'
              size='md'
              onClick={() => !saving && onClose()}
              disabled={saving}
            >
              {cancelLabel}
            </Button>

            {onSave && (
              <Button
                variant='primary'
                size='md'
                onClick={onSave}
                disabled={saveDisabled}
                loading={saving}
              >
                {saveLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
