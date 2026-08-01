'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  params: Promise<{ id: string }>;
}

export default function PayOrderPage({ params: _params }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const initiatePayment = async () => {
    setLoading(true);

    // ── DEMO MODE: API call commented out ──────────────────────────────────
    // const { id: orderId } = await params;
    // const res = await fetch(`${API_URL}/api/payments/create`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   credentials: 'include',
    //   body: JSON.stringify({ rentalOrderId: orderId }),
    // });
    // const json = await res.json();
    // if (!res.ok) throw new Error(json.message ?? 'Payment initiation failed.');
    // const paymentUrl = json.data?.paymentUrl ?? json.data?.GatewayPageURL;
    // if (paymentUrl) { window.location.href = paymentUrl; return; }
    await new Promise((r) => setTimeout(r, 800)); // simulate redirect
    // ───────────────────────────────────────────────────────────────────────

    toast.success('Payment initiated! Redirecting to gateway… (demo)');
    setLoading(false);
    router.push('/payment/success');
  };

  return (
    <div className='mx-auto max-w-md'>
      <Link
        href={`/customer/orders`}
        className='mb-6 inline-flex items-center gap-1.5 text-sm font-medium'
        style={{ color: 'var(--muted-foreground)' }}
      >
        <ArrowLeft className='h-4 w-4' />
        Back to Orders
      </Link>

      <div
        className='rounded-2xl border p-8'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Icon */}
        <div
          className='mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl'
          style={{
            backgroundColor: 'color-mix(in srgb, #7c3aed 14%, transparent)',
          }}
        >
          <CreditCard className='h-7 w-7' style={{ color: '#7c3aed' }} />
        </div>

        <h1
          className='mb-2 text-center text-xl font-bold'
          style={{ color: 'var(--foreground)' }}
        >
          Complete Your Payment
        </h1>
        <p
          className='mb-8 text-center text-sm'
          style={{ color: 'var(--muted-foreground)' }}
        >
          You will be redirected to SSLCommerz to securely complete your
          payment. Your order will be confirmed once payment is received.
        </p>

        {/* Security note */}
        <div
          className='mb-6 flex items-start gap-3 rounded-lg p-4'
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

        {/* Pay button */}
        <button
          onClick={initiatePayment}
          disabled={loading}
          className='cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-colors disabled:opacity-60'
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {loading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              Redirecting to Payment…
            </>
          ) : (
            <>
              <CreditCard className='h-4 w-4' />
              Proceed to Pay
            </>
          )}
        </button>
      </div>
    </div>
  );
}
