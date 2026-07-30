'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setLoading(true);

    // ── DEMO MODE: API call commented out ────────────────────────────────────
    // const res = await fetch(`${API_URL}/api/rentals/${orderId}/cancel`, {
    //   method: 'PATCH',
    //   credentials: 'include',
    // });
    // const json = await res.json();
    // if (!res.ok) throw new Error(json.message ?? 'Cancellation failed.');
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    // ─────────────────────────────────────────────────────────────────────────

    toast.success('Order cancelled successfully. (demo)');
    setLoading(false);
    router.push('/customer/orders');
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className='inline-flex h-10 items-center gap-2 rounded-lg border px-5 text-sm font-semibold transition-colors disabled:opacity-60'
      style={{
        borderColor: 'var(--border)',
        color: 'var(--muted-foreground)',
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#ef4444';
        e.currentTarget.style.color = '#ef4444';
        e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.color = 'var(--muted-foreground)';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {loading ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : (
        <XCircle className='h-4 w-4' />
      )}
      Cancel Order
    </button>
  );
}
