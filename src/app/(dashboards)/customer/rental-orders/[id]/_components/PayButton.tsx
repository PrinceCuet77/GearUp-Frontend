'use client';

import { useState } from 'react';
import { CreditCard, Shield } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/Button';
import { createPayment } from '../_actions/createPayment';

export function PayButton({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const result = await createPayment(orderId);
      if (!result.success || !result.gatewayPageURL) {
        toast.error(result.error ?? 'Failed to initiate payment.');
        setLoading(false);
        setOpen(false);
        return;
      }
      toast.success('Redirecting to payment gateway...');
      // Redirect to external payment gateway (replace to prevent back-navigation duplicate payments)
      window.location.replace(result.gatewayPageURL);
    } catch {
      toast.error('An unexpected error occurred.');
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        leadingIcon={<CreditCard className='h-4 w-4' />}
      >
        Pay Now
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title='Confirm Payment'
        onSave={handlePay}
        saving={loading}
        saveLabel='Proceed'
        cancelLabel='Cancel'
        maxWidth='max-w-md'
        footerRight
      >
        <div className='flex flex-col items-center justify-center py-4'>
          <span className='mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft'>
            <CreditCard
              className='h-7 w-7 text-accent-soft-foreground'
              aria-hidden='true'
            />
          </span>
          <h2 className='mb-2 text-center text-lg font-bold text-foreground'>
            Proceed to Payment
          </h2>
          <p className='mb-6 text-center text-sm text-muted-foreground'>
            You will be redirected to SSLCommerz to securely complete your
            payment.
          </p>
          <div className='flex w-full items-start gap-3 rounded-control border border-secondary/25 bg-secondary-soft p-4'>
            <Shield
              className='mt-0.5 h-4 w-4 shrink-0 text-secondary-soft-foreground'
              aria-hidden='true'
            />
            <p className='text-xs text-secondary-soft-foreground'>
              Payments are securely processed via SSLCommerz. Your financial
              information is never stored on our servers.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
