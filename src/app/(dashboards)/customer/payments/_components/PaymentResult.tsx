'use client';

import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  Ban,
  ArrowLeft,
  RotateCcw,
  PartyPopper,
  AlertTriangle,
  Receipt,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentResultProps {
  status: string;
  orderId?: string;
  tranId?: string;
}

export function PaymentResult({ status, orderId, tranId }: PaymentResultProps) {
  const copyTransactionId = () => {
    if (tranId) {
      navigator.clipboard.writeText(tranId);
      toast.success('Transaction ID copied!');
    }
  };

  if (status === 'success') {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <div
          className='mb-6 flex h-20 w-20 items-center justify-center rounded-full'
          style={{
            backgroundColor: 'color-mix(in srgb, #22c55e 12%, transparent)',
          }}
        >
          <PartyPopper className='h-10 w-10' style={{ color: '#16a34a' }} />
        </div>
        <h1
          className='mb-2 text-3xl font-bold'
          style={{ color: 'var(--foreground)' }}
        >
          Payment Successful!
        </h1>
        <p
          className='mb-6 max-w-sm text-sm'
          style={{ color: 'var(--muted-foreground)' }}
        >
          Your payment has been processed successfully. You can now track your
          rental order status.
        </p>
        {tranId && (
          <div
            className='mb-8 max-w-sm rounded-lg p-4 text-left text-sm'
            style={{
              backgroundColor: 'color-mix(in srgb, #22c55e 8%, transparent)',
              border: '1px solid color-mix(in srgb, #22c55e 20%, transparent)',
            }}
          >
            <div className='flex items-center gap-2 mb-2'>
              <Receipt className='h-4 w-4' style={{ color: '#16a34a' }} />
              <p className='font-medium' style={{ color: '#16a34a' }}>
                Transaction Details
              </p>
            </div>
            <div className='flex items-center justify-between'>
              <span style={{ color: 'var(--muted-foreground)' }}>
                Transaction ID:
              </span>
              <div className='flex items-center gap-2'>
                <code
                  className='text-xs font-mono'
                  style={{ color: 'var(--foreground)' }}
                >
                  {tranId}
                </code>
                <button
                  onClick={copyTransactionId}
                  className='p-1 rounded hover:bg-black/5 transition-colors cursor-pointer'
                  title='Copy Transaction ID'
                >
                  <Copy
                    className='h-3 w-3'
                    style={{ color: 'var(--muted-foreground)' }}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
        <Link
          href={`/customer/rental-orders/${orderId}`}
          className='inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors'
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <ArrowLeft className='h-4 w-4' />
          View Rental Order
        </Link>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <div
          className='mb-6 flex h-20 w-20 items-center justify-center rounded-full'
          style={{
            backgroundColor: 'color-mix(in srgb, #ef4444 12%, transparent)',
          }}
        >
          <AlertTriangle className='h-10 w-10' style={{ color: '#dc2626' }} />
        </div>
        <h1
          className='mb-2 text-3xl font-bold'
          style={{ color: 'var(--foreground)' }}
        >
          Payment Failed
        </h1>
        <p
          className='mb-8 max-w-sm text-sm'
          style={{ color: 'var(--muted-foreground)' }}
        >
          Unfortunately, your payment could not be processed. Please check your
          payment details and try again.
        </p>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Link
            href='/customer/rental-orders'
            className='inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-colors'
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'var(--background)',
            }}
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Rental Orders
          </Link>
          <Link
            href={`/customer/rental-orders/${orderId}`}
            className='inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors'
            style={{ backgroundColor: '#dc2626' }}
          >
            <RotateCcw className='h-4 w-4' />
            Retry Payment
          </Link>
        </div>
      </div>
    );
  }

  // Cancelled
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <div
        className='mb-6 flex h-20 w-20 items-center justify-center rounded-full'
        style={{
          backgroundColor: 'color-mix(in srgb, #6b7280 12%, transparent)',
        }}
      >
        <Ban className='h-10 w-10' style={{ color: '#4b5563' }} />
      </div>
      <h1
        className='mb-2 text-3xl font-bold'
        style={{ color: 'var(--foreground)' }}
      >
        Payment Cancelled
      </h1>
      <p
        className='mb-4 max-w-sm text-sm'
        style={{ color: 'var(--muted-foreground)' }}
      >
        The payment process was cancelled. No charges have been made to your
        account.
      </p>
      <div
        className='mb-8 max-w-sm rounded-lg p-4 text-left text-sm'
        style={{
          backgroundColor: 'color-mix(in srgb, #3b82f6 8%, transparent)',
          border: '1px solid color-mix(in srgb, #3b82f6 20%, transparent)',
          color: '#1d4ed8',
        }}
      >
        <p className='font-medium'>What happened?</p>
        <p className='mt-1 opacity-80'>
          You may have navigated away from the payment page or clicked the
          cancel button. Your order is still saved and you can try paying again
          anytime.
        </p>
      </div>
      <div className='flex flex-col gap-3 sm:flex-row'>
        <Link
          href={`/customer/rental-orders/${orderId}`}
          className='inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors'
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <ArrowLeft className='h-4 w-4' />
          View Rental Order
        </Link>
      </div>
    </div>
  );
}
