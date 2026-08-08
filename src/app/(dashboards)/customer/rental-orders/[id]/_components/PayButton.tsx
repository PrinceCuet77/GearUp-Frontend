'use client';

import { useState } from 'react';
import { CreditCard, Shield } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
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
      <button
        onClick={() => setOpen(true)}
        className='inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-colors cursor-pointer'
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <CreditCard className='h-4 w-4' />
        Pay Now
      </button>

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
          <div
            className='mb-5 flex h-14 w-14 items-center justify-center rounded-2xl'
            style={{
              backgroundColor: 'color-mix(in srgb, #7c3aed 14%, transparent)',
            }}
          >
            <CreditCard className='h-7 w-7' style={{ color: '#7c3aed' }} />
          </div>
          <h2
            className='mb-2 text-center text-lg font-bold'
            style={{ color: 'var(--foreground)' }}
          >
            Proceed to Payment
          </h2>
          <p
            className='mb-6 text-center text-sm'
            style={{ color: 'var(--muted-foreground)' }}
          >
            You will be redirected to SSLCommerz to securely complete your
            payment.
          </p>
          <div
            className='flex w-full items-start gap-3 rounded-lg p-4'
            style={{
              backgroundColor: 'color-mix(in srgb, #22c55e 8%, transparent)',
              border: '1px solid color-mix(in srgb, #22c55e 20%, transparent)',
            }}
          >
            <Shield
              className='mt-0.5 h-4 w-4 shrink-0'
              style={{ color: '#16a34a' }}
            />
            <p className='text-xs' style={{ color: '#16a34a' }}>
              Payments are securely processed via SSLCommerz. Your financial
              information is never stored on our servers.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
