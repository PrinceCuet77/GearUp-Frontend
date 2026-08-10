'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { returnRentalOrder } from '../_actions/returnRentalOrder';

export function ReturnOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const result = await returnRentalOrder(orderId);

      if (!result.success) {
        toast.error(result.error ?? 'Failed to return order.');
        return;
      }

      toast.success('Rental order returned successfully.');
      setShowModal(false);
      router.refresh();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant='outline'
        onClick={() => setShowModal(true)}
        disabled={loading}
        leadingIcon={<RotateCcw className='h-4 w-4' />}
        className='hover:border-primary hover:bg-primary-soft hover:text-primary'
      >
        Return Order
      </Button>

      <ConfirmDialog
        open={showModal}
        onClose={() => !loading && setShowModal(false)}
        onConfirm={handleConfirm}
        loading={loading}
        tone='primary'
        title='Return Order'
        description='Confirm that you have returned this gear to the provider. This marks the rental as returned and cannot be undone.'
        confirmLabel='Confirm Return'
      />
    </>
  );
}
