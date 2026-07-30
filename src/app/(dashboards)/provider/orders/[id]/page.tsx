import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Package, User, CreditCard } from 'lucide-react';
import { DUMMY_ORDERS } from '@/lib/dummy-data';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { OrderStatusActions } from './OrderStatusActions';

interface Props {
  params: Promise<{ id: string }>;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function ProviderOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = DUMMY_ORDERS.find((o) => o.id === id) ?? null;

  if (!order) notFound();

  return (
    <div className='mx-auto max-w-3xl'>
      <Link
        href='/provider/orders'
        className='mb-6 inline-flex items-center gap-1.5 text-sm font-medium'
        style={{ color: 'var(--muted-foreground)' }}
      >
        <ArrowLeft className='h-4 w-4' />
        Back to Orders
      </Link>

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

      <div className='grid gap-4 sm:grid-cols-2'>
        {/* Customer info */}
        <div
          className='rounded-xl border p-5'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <div className='mb-3 flex items-center gap-2'>
            <User className='h-4 w-4' style={{ color: '#3b82f6' }} />
            <h2
              className='text-sm font-semibold'
              style={{ color: 'var(--foreground)' }}
            >
              Customer
            </h2>
          </div>
          <p
            className='text-sm font-medium'
            style={{ color: 'var(--foreground)' }}
          >
            {order.customer?.name ?? 'Unknown'}
          </p>
          <p className='text-sm' style={{ color: 'var(--muted-foreground)' }}>
            {order.customer?.email ?? '—'}
          </p>
        </div>

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
      </div>

      {/* Amount */}
      <div
        className='mt-4 flex items-center justify-between rounded-xl border p-5'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <div className='flex items-center gap-2'>
          <CreditCard className='h-4 w-4' style={{ color: '#7c3aed' }} />
          <span
            className='text-sm font-semibold'
            style={{ color: 'var(--foreground)' }}
          >
            Order Total
          </span>
        </div>
        <span
          className='text-xl font-bold'
          style={{ color: 'var(--foreground)' }}
        >
          ${Number(order.amount).toFixed(2)}
        </span>
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
              Rented Items ({order.items.length})
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
                  ${Number(item.price).toFixed(2)} / day
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Status actions */}
      <div className='mt-6'>
        <OrderStatusActions orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}
