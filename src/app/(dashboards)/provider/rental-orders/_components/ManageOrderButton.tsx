'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UpdateOrderStatusModal } from '@/components/dashboard/UpdateOrderStatusModal';
import { Button } from '@/components/ui/Button';
import type { RentalOrder } from '@/lib/types';

interface ManageOrderButtonProps {
  order: RentalOrder;
}

export function ManageOrderButton({ order }: ManageOrderButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const isDisabled = order.status !== 'PLACED' && order.status !== 'PAID';

  return (
    <>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setOpen(true)}
        disabled={isDisabled}
        title={
          isDisabled
            ? 'Only placed or paid orders can be advanced'
            : 'Advance this order'
        }
      >
        Manage
        <span className='sr-only'> order #{order.id.slice(0, 8)}</span>
      </Button>

      <UpdateOrderStatusModal
        open={open}
        onClose={() => setOpen(false)}
        order={order}
        onUpdated={() => router.refresh()}
      />
    </>
  );
}
