'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UpdateOrderStatusModal } from '@/components/dashboard/UpdateOrderStatusModal';
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
      <button
        type='button'
        onClick={() => setOpen(true)}
        disabled={isDisabled}
        className='cursor-pointer text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
        style={{
          color: isDisabled ? 'var(--muted-foreground)' : 'var(--primary)',
        }}
      >
        Manage
      </button>

      <UpdateOrderStatusModal
        open={open}
        onClose={() => setOpen(false)}
        order={order}
        onUpdated={() => router.refresh()}
      />
    </>
  );
}
