'use client';

import {
  Ban,
  ArrowLeft,
  RotateCcw,
  PartyPopper,
  AlertTriangle,
  Receipt,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface PaymentResultProps {
  status: string;
  orderId?: string;
  tranId?: string;
}

/** Shared frame for all three outcomes so the layouts stay identical. */
function ResultShell({
  icon,
  iconClass,
  title,
  description,
  children,
  actions,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <span
        className={cn(
          'mb-6 flex h-20 w-20 items-center justify-center rounded-full',
          iconClass,
        )}
      >
        {icon}
      </span>
      <h1 className='mb-2 text-3xl font-bold text-foreground'>{title}</h1>
      <p className='mb-6 max-w-sm text-sm text-muted-foreground'>
        {description}
      </p>
      {children}
      <div className='flex flex-col gap-3 sm:flex-row'>{actions}</div>
    </div>
  );
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
      <ResultShell
        icon={<PartyPopper className='h-10 w-10' aria-hidden='true' />}
        iconClass='bg-secondary-soft text-secondary-soft-foreground'
        title='Payment Successful!'
        description='Your payment has been processed successfully. You can now track your rental order status.'
        actions={
          <ButtonLink
            href={`/customer/rental-orders/${orderId}`}
            size='lg'
            leadingIcon={<ArrowLeft className='h-5 w-5' />}
          >
            View Rental Order
          </ButtonLink>
        }
      >
        {tranId && (
          <div className='mb-8 w-full max-w-sm rounded-control border border-secondary/25 bg-secondary-soft p-4 text-left text-sm'>
            <div className='mb-2 flex items-center gap-2'>
              <Receipt
                className='h-4 w-4 text-secondary-soft-foreground'
                aria-hidden='true'
              />
              <p className='font-semibold text-secondary-soft-foreground'>
                Transaction Details
              </p>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-muted-foreground'>Transaction ID:</span>
              <div className='flex min-w-0 items-center gap-2'>
                <code className='truncate font-mono text-xs text-foreground'>
                  {tranId}
                </code>
                <button
                  onClick={copyTransactionId}
                  className='shrink-0 cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                  title='Copy Transaction ID'
                  aria-label='Copy transaction ID'
                >
                  <Copy className='h-3 w-3' />
                </button>
              </div>
            </div>
          </div>
        )}
      </ResultShell>
    );
  }

  if (status === 'failed') {
    return (
      <ResultShell
        icon={<AlertTriangle className='h-10 w-10' aria-hidden='true' />}
        iconClass='bg-danger-soft text-danger'
        title='Payment Failed'
        description='Unfortunately, your payment could not be processed. Please check your payment details and try again.'
        actions={
          <>
            <ButtonLink
              href='/customer/rental-orders'
              variant='outline'
              size='lg'
              leadingIcon={<ArrowLeft className='h-5 w-5' />}
            >
              Back to Rental Orders
            </ButtonLink>
            <ButtonLink
              href={`/customer/rental-orders/${orderId}`}
              variant='danger'
              size='lg'
              leadingIcon={<RotateCcw className='h-5 w-5' />}
            >
              Retry Payment
            </ButtonLink>
          </>
        }
      />
    );
  }

  // Cancelled
  return (
    <ResultShell
      icon={<Ban className='h-10 w-10' aria-hidden='true' />}
      iconClass='bg-muted text-muted-foreground'
      title='Payment Cancelled'
      description='The payment process was cancelled. No charges have been made to your account.'
      actions={
        <ButtonLink
          href={`/customer/rental-orders/${orderId}`}
          size='lg'
          leadingIcon={<ArrowLeft className='h-5 w-5' />}
        >
          View Rental Order
        </ButtonLink>
      }
    >
      <div className='mb-8 w-full max-w-sm rounded-control border border-accent/25 bg-accent-soft p-4 text-left text-sm text-accent-soft-foreground'>
        <p className='font-semibold'>What happened?</p>
        <p className='mt-1 opacity-90'>
          You may have navigated away from the payment page or clicked the
          cancel button. Your order is still saved and you can try paying again
          anytime.
        </p>
      </div>
    </ResultShell>
  );
}
