'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, Truck, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { RentalStatus } from '@/lib/types';

interface Props {
  orderId: string;
  currentStatus: RentalStatus;
}

const NEXT_ACTIONS: Partial<
  Record<
    RentalStatus,
    { status: string; label: string; icon: React.ElementType; color: string }
  >
> = {
  PLACED: {
    status: 'CONFIRMED',
    label: 'Confirm Order',
    icon: CheckCircle,
    color: '#2563eb',
  },
  PAID: {
    status: 'PICKED_UP',
    label: 'Mark as Picked Up',
    icon: Truck,
    color: '#22c55e',
  },
  PICKED_UP: {
    status: 'RETURNED',
    label: 'Mark as Returned',
    icon: RotateCcw,
    color: 'var(--muted-foreground)',
  },
};

export function OrderStatusActions({
  orderId: _orderId,
  currentStatus,
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const action = NEXT_ACTIONS[currentStatus];
  if (!action) return null;

  const Icon = action.icon;

  const handleUpdate = async () => {
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    toast.success(
      `Order status updated to ${action.status.replace('_', ' ')}. (demo)`,
    );
    setLoading(false);
    router.push('/provider/orders');
  };

  return (
    <div
      className='rounded-xl border p-5'
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      <h2
        className='mb-4 text-sm font-semibold'
        style={{ color: 'var(--foreground)' }}
      >
        Order Actions
      </h2>
      <button
        onClick={handleUpdate}
        disabled={loading}
        className='inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60'
        style={{
          backgroundColor:
            action.color !== 'var(--muted-foreground)'
              ? action.color
              : 'var(--primary)',
        }}
      >
        {loading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <Icon className='h-4 w-4' />
        )}
        {action.label}
      </button>
    </div>
  );
}
