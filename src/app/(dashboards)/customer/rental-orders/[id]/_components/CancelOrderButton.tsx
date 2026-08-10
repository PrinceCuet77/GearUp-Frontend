'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { cancelRentalOrder } from '../_actions/cancelRentalOrder';

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const result = await cancelRentalOrder(orderId);

      if (!result.success) {
        toast.error(result.error ?? 'Failed to cancel order.');
        return;
      }

      toast.success('Rental order cancelled successfully.');
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
        leadingIcon={<XCircle className='h-4 w-4' />}
        className='hover:border-danger hover:bg-danger-soft hover:text-danger'
      >
        Cancel Order
      </Button>

      <ConfirmDialog
        open={showModal}
        onClose={() => !loading && setShowModal(false)}
        onConfirm={handleConfirm}
        loading={loading}
        tone='danger'
        title='Cancel Order'
        description="Do you want to cancel this order? This can't be undone."
      />
    </>
  );
}
