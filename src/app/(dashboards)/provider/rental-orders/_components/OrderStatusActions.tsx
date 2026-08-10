'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Truck, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { RentalStatus } from '@/lib/types';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import { updateRentalOrderForProvider } from '../_actions/updateRentalOrderForProvider';

interface Props {
  orderId: string;
  currentStatus: RentalStatus;
}

/**
 * The single next step available at each stage of the order lifecycle:
 * PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED
 */
const NEXT_ACTIONS: Partial<
  Record<
    RentalStatus,
    {
      status: string;
      label: string;
      icon: React.ElementType;
      variant: ButtonVariant;
    }
  >
> = {
  PLACED: {
    status: 'CONFIRMED',
    label: 'Confirm Order',
    icon: CheckCircle,
    variant: 'accent',
  },
  PAID: {
    status: 'PICKED_UP',
    label: 'Mark as Picked Up',
    icon: Truck,
    variant: 'secondary',
  },
  PICKED_UP: {
    status: 'RETURNED',
    label: 'Mark as Returned',
    icon: RotateCcw,
    variant: 'primary',
  },
};

export function OrderStatusActions({ orderId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const action = NEXT_ACTIONS[currentStatus];
  if (!action) return null;

  const Icon = action.icon;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const result = await updateRentalOrderForProvider(orderId, action.status);
      if (result.success) {
        toast.success(
          `Order status updated to ${action.status.replace('_', ' ')}.`,
        );
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to update order status.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='surface-card p-5'>
      <h2 className='mb-4 text-sm font-bold text-foreground'>Order Actions</h2>
      <Button
        variant={action.variant}
        onClick={handleUpdate}
        loading={loading}
        loadingText='Updating…'
        leadingIcon={<Icon className='h-4 w-4' />}
      >
        {action.label}
      </Button>
    </div>
  );
}
