'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, Loader2, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import { cancelRentalOrder } from '../_actions/cancelRentalOrder';

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!showModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showModal]);

  const handleConfirm = async () => {
    setShowModal(false);
    setLoading(true);

    try {
      const result = await cancelRentalOrder(orderId);

      if (!result.success) {
        toast.error(result.error ?? 'Failed to cancel order.');
        return;
      }

      toast.success('Rental order cancelled successfully.');
      router.refresh();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        className='cursor-pointer inline-flex h-10 items-center gap-2 rounded-lg border px-5 text-sm font-semibold transition-colors disabled:opacity-60'
        style={{
          borderColor: 'var(--border)',
          color: 'var(--muted-foreground)',
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#ef4444';
          e.currentTarget.style.color = '#ef4444';
          e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--muted-foreground)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {loading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <XCircle className='h-4 w-4' />
        )}
        Cancel Order
      </button>

      {/* Confirmation modal */}
      {showModal && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center'
          role='dialog'
          aria-modal='true'
        >
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setShowModal(false)}
          />

          {/* Dialog */}
          <div
            ref={modalRef}
            className='relative mx-4 w-full max-w-md rounded-2xl border p-6 shadow-xl'
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
            }}
          >
            {/* Close (X) */}
            <button
              onClick={() => setShowModal(false)}
              className='absolute right-4 top-4 rounded-md p-1 transition-colors cursor-pointer'
              style={{ color: 'var(--muted-foreground)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--foreground)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--muted-foreground)';
              }}
            >
              <X className='h-4 w-4' />
            </button>

            {/* Icon + text */}
            <div className='flex gap-4'>
              <div
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full'
                style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
              >
                <AlertTriangle
                  className='h-5 w-5'
                  style={{ color: '#ef4444' }}
                />
              </div>
              <div>
                <h3
                  className='text-base font-semibold'
                  style={{ color: 'var(--foreground)' }}
                >
                  Cancel Order
                </h3>
                <p
                  className='mt-2 text-sm leading-relaxed'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Do you want to cancel this order? This can&apos;t be undone.
                </p>
              </div>
            </div>

            {/* Buttons – bottom right */}
            <div className='mt-6 flex justify-end gap-3'>
              <button
                onClick={() => setShowModal(false)}
                className='cursor-pointer inline-flex h-9 items-center rounded-lg border px-4 text-sm font-medium transition-colors'
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
                onClick={handleConfirm}
                className='cursor-pointer inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition-colors'
                style={{ backgroundColor: '#ef4444' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                }}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
