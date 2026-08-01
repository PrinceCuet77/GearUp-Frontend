import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Package, CreditCard } from 'lucide-react';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { CancelOrderButton } from './CancelOrderButton';
import { getSingleRentalOrder } from '../_actions/getSingleRentalOrder';

interface Props {
  params: Promise<{ id: string }>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCurrency(amount: string | number) {
  return `$${Number(amount).toFixed(2)}`;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const result = await getSingleRentalOrder(id);

  if (!result.success || !result.data) notFound();

  const order = result.data;

  const canPay = order.status === 'CONFIRMED';
  const canCancel = order.status === 'PLACED' || order.status === 'CONFIRMED';

  return (
    <div className='mx-auto max-w-3xl'>
      {/* Back link */}
      <Link
        href='/customer/orders'
        className='mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors'
        style={{ color: 'var(--muted-foreground)' }}
      >
        <ArrowLeft className='h-4 w-4' />
        Back to Orders
      </Link>

      {/* Header */}
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1
            className='text-2xl font-bold tracking-tight'
            style={{ color: 'var(--foreground)' }}
          >
            Order #{order.id.slice(0, 8)}
          </h1>
          <p
            className='mt-1 text-sm'
            style={{ color: 'var(--muted-foreground)' }}
          >
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <RentalStatusBadge status={order.status} />
      </div>

      {/* Cards grid */}
      <div className='grid gap-4 sm:grid-cols-2'>
        {/* Rental period */}
        <div
          className='rounded-xl border p-5'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <div className='mb-3 flex items-center gap-2'>
            <Calendar className='h-4 w-4' style={{ color: 'var(--primary)' }} />
            <h2
              className='text-sm font-semibold'
              style={{ color: 'var(--foreground)' }}
            >
              Rental Period
            </h2>
          </div>
          <p className='text-sm' style={{ color: 'var(--muted-foreground)' }}>
            <span
              className='font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              From:
            </span>{' '}
            {formatDate(order.startDate)}
          </p>
          <p
            className='mt-1 text-sm'
            style={{ color: 'var(--muted-foreground)' }}
          >
            <span
              className='font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              To:
            </span>{' '}
            {formatDate(order.endDate)}
          </p>
        </div>

        {/* Amount */}
        <div
          className='rounded-xl border p-5'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <div className='mb-3 flex items-center gap-2'>
            <CreditCard className='h-4 w-4' style={{ color: '#7c3aed' }} />
            <h2
              className='text-sm font-semibold'
              style={{ color: 'var(--foreground)' }}
            >
              Payment
            </h2>
          </div>
          <p
            className='text-2xl font-bold'
            style={{ color: 'var(--foreground)' }}
          >
            {formatCurrency(order.amount)}
          </p>
          <p
            className='mt-1 text-sm'
            style={{ color: 'var(--muted-foreground)' }}
          >
            Total rental amount
          </p>
        </div>
      </div>

      {/* Items */}
      {order.items && order.items.length > 0 && (
        <div
          className='mt-4 rounded-xl border'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className='flex items-center gap-2 border-b px-5 py-4'
            style={{ borderColor: 'var(--border)' }}
          >
            <Package className='h-4 w-4' style={{ color: 'var(--primary)' }} />
            <h2
              className='text-sm font-semibold'
              style={{ color: 'var(--foreground)' }}
            >
              Rented Items
            </h2>
          </div>
          <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
            {order.items.map((item) => (
              <li
                key={item.id}
                className='flex items-center justify-between px-5 py-4'
              >
                <div>
                  <p
                    className='text-sm font-medium'
                    style={{ color: 'var(--foreground)' }}
                  >
                    {item.gearItem?.name ??
                      `Gear #${item.gearItemId.slice(0, 8)}`}
                  </p>
                  <p
                    className='text-xs'
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Qty: {item.quantity}
                  </p>
                </div>
                <p
                  className='text-sm font-semibold'
                  style={{ color: 'var(--foreground)' }}
                >
                  {formatCurrency(item.price)} / day
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className='mt-6 flex flex-wrap gap-3'>
        {canPay && (
          <Link
            href={`/customer/orders/${order.id}/pay`}
            className='inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-colors'
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <CreditCard className='h-4 w-4' />
            Pay Now
          </Link>
        )}
        {canCancel && <CancelOrderButton orderId={order.id} />}
      </div>
    </div>
  );
}
