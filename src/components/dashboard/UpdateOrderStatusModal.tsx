'use client';

import { useState } from 'react';
import { ArrowRight, User, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { updateRentalOrderForProvider } from '@/app/(dashboards)/provider/rental-orders/_actions/updateRentalOrderForProvider';
import type { RentalOrder, RentalStatus } from '@/lib/types';

interface UpdateOrderStatusModalProps {
  open: boolean;
  onClose: () => void;
  order: RentalOrder;
  onUpdated: () => void;
}

export function UpdateOrderStatusModal({
  open,
  onClose,
  order,
  onUpdated,
}: UpdateOrderStatusModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  const nextStatus =
    order.status === 'PLACED'
      ? 'CONFIRMED'
      : order.status === 'PAID'
        ? 'PICKED_UP'
        : null;

  const handleClose = () => {
    if (!saving) {
      setError('');
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!nextStatus) return;

    setSaving(true);
    setError('');

    try {
      const result = await updateRentalOrderForProvider(order.id, nextStatus);

      if (result.success) {
        toast.success(
          `Order status updated to "${nextStatus === 'CONFIRMED' ? 'Confirmed' : 'Picked Up'}".`,
        );
        onUpdated();
        onClose();
      } else {
        setError(result.error ?? 'Failed to update order status.');
        toast.error(result.error ?? 'Failed to update order status.');
      }
    } catch {
      const msg = 'An unexpected error occurred.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title='Update Order Status'
      onSave={handleSubmit}
      saveLabel={saving ? 'Updating…' : 'Proceed'}
      saving={saving}
      footerRight
      maxWidth='max-w-md'
    >
      <div className='flex flex-col items-center py-2'>
        {/* Order Summary */}
        <div
          className='mb-6 w-full rounded-xl border p-4 text-left'
          style={{
            backgroundColor: 'var(--muted)',
            borderColor: 'var(--border)',
          }}
        >
          <div className='mb-3 flex items-center justify-between'>
            <span
              className='font-mono text-sm font-semibold'
              style={{ color: 'var(--foreground)' }}
            >
              #{order.id.slice(0, 8)}
            </span>
          </div>
          <div className='grid grid-cols-2 gap-3 text-xs'>
            <div className='flex items-center gap-1.5'>
              <User
                className='h-3.5 w-3.5'
                style={{ color: 'var(--muted-foreground)' }}
              />
              <span style={{ color: 'var(--muted-foreground)' }}>
                {order.customer?.name ?? order.customer?.email ?? '—'}
              </span>
            </div>
            <div className='flex items-center gap-1.5'>
              <CreditCard
                className='h-3.5 w-3.5'
                style={{ color: 'var(--muted-foreground)' }}
              />
              <span
                className='font-semibold'
                style={{ color: 'var(--foreground)' }}
              >
                ৳{Number(order.amount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Status Transition Visual */}
        <p
          className='mb-4 text-sm'
          style={{ color: 'var(--muted-foreground)' }}
        >
          Current status is <RentalStatusBadge status={order.status} /> → I want
          to change it to{' '}
          {nextStatus && (
            <RentalStatusBadge status={nextStatus as RentalStatus} />
          )}
        </p>

        <div
          className='flex w-full items-center justify-center gap-4 rounded-xl py-4'
          style={{ backgroundColor: 'var(--background)' }}
        >
          <div className='flex flex-col items-center gap-2'>
            <span
              className='text-xs font-semibold uppercase tracking-wide'
              style={{ color: 'var(--muted-foreground)' }}
            >
              Current Status
            </span>
            <RentalStatusBadge status={order.status} />
          </div>

          <ArrowRight
            className='h-5 w-5'
            style={{ color: 'var(--muted-foreground)' }}
          />

          <div className='flex flex-col items-center gap-2'>
            <span
              className='text-xs font-semibold uppercase tracking-wide'
              style={{ color: 'var(--muted-foreground)' }}
            >
              Change To
            </span>
            {nextStatus && (
              <RentalStatusBadge status={nextStatus as RentalStatus} />
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className='mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium'
            style={{
              backgroundColor: 'color-mix(in srgb, #ef4444 10%, transparent)',
              color: '#dc2626',
            }}
          >
            <AlertCircle className='h-3.5 w-3.5 shrink-0' />
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
}
