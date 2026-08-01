'use client';

/**
 * Reusable app-wide modal.
 *
 * Layout:
 *   Header  – title (left) + × close button (right)
 *   Body    – scrollable children
 *   Footer  – [Cancel] [Save] buttons on the LEFT (per spec)
 *
 * Features:
 *   • Blur backdrop (`backdrop-blur-sm`)
 *   • Click outside → close
 *   • Escape key → close
 *   • Body-scroll lock while open
 */

import { useEffect, useRef, type ReactNode } from 'react';
import { X, Loader2 } from 'lucide-react';

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
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Escape key ────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, saving, onClose]);

  /* ── Body scroll lock ──────────────────────────────────────────────────── */
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
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
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
        className={`relative z-10 flex w-full ${maxWidth} flex-col rounded-2xl shadow-2xl`}
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          className='flex shrink-0 items-center justify-between gap-4 border-b px-6 py-4'
          style={{ borderColor: 'var(--border)' }}
        >
          {title ? (
            <h2
              className='text-base font-semibold'
              style={{ color: 'var(--foreground)' }}
            >
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            onClick={() => !saving && onClose()}
            aria-label='Close modal'
            className='cursor-pointer ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors'
            style={{ color: 'var(--muted-foreground)' }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.backgroundColor = 'var(--muted)';
              btn.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.backgroundColor = 'transparent';
              btn.style.color = 'var(--muted-foreground)';
            }}
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* Body */}
        <div className='flex-1 overflow-y-auto px-6 py-5'>{children}</div>

        {/* Footer */}
        {!noFooter && (
          <div
            className='flex shrink-0 items-center gap-3 border-t px-6 py-4'
            style={{ borderColor: 'var(--border)' }}
          >
            <button
              onClick={() => !saving && onClose()}
              disabled={saving}
              className='cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50'
              style={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'var(--muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'transparent';
              }}
            >
              {cancelLabel}
            </button>

            {onSave && (
              <button
                onClick={onSave}
                disabled={saving || saveDisabled}
                className='cursor-pointer flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60'
                style={{ backgroundColor: 'var(--primary)' }}
                onMouseEnter={(e) => {
                  if (!saving && !saveDisabled)
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = 'var(--primary-hover)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'var(--primary)';
                }}
              >
                {saving && <Loader2 className='h-3.5 w-3.5 animate-spin' />}
                {saveLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
