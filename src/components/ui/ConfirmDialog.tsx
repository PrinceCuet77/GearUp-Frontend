'use client';

import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import type { ButtonVariant } from '@/components/ui/Button';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual weight of the confirm action. `danger` for destructive steps. */
  tone?: 'danger' | 'primary';
  loading?: boolean;
}

const TONE: Record<
  NonNullable<ConfirmDialogProps['tone']>,
  { icon: string; button: ButtonVariant }
> = {
  danger: { icon: 'bg-danger-soft text-danger', button: 'danger' },
  primary: { icon: 'bg-primary-soft text-primary', button: 'primary' },
};

/**
 * Shared confirmation dialog for irreversible actions, built on `Modal` so the
 * backdrop, escape handling and scroll lock behave like every other dialog.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Proceed',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const toneClasses = TONE[tone];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth='max-w-md'
      noFooter
    >
      <div className='flex gap-4'>
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            toneClasses.icon,
          )}
        >
          <AlertTriangle className='h-5 w-5' aria-hidden='true' />
        </span>
        <p className='text-sm leading-relaxed text-muted-foreground'>
          {description}
        </p>
      </div>

      <div className='mt-6 flex justify-end gap-3'>
        <Button variant='outline' onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={toneClasses.button}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
