import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Package,
  CreditCard,
  Building2,
  Tag,
  Clock,
  Receipt,
} from 'lucide-react';
import {
  RentalStatusBadge,
  PaymentStatusBadge,
} from '@/components/dashboard/StatusBadge';
import { CancelOrderButton } from './_components/CancelOrderButton';
import { getSingleRentalOrder } from './_actions/getSingleRentalOrder';
import { OrderReviews } from './_components/OrderReviews';

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

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(amount: string | number) {
  return `৳${Number(amount).toFixed(2)}`;
}

/** Parse the gearItem.images JSON string into an array, fallback to empty */
function parseImages(imagesRaw?: string): string[] {
  if (!imagesRaw) return [];
  try {
    const parsed = JSON.parse(imagesRaw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const result = await getSingleRentalOrder(id);

  if (!result.success || !result.data) notFound();

  const order = result.data;

  const canPay = order.status === 'PLACED' || order.status === 'CONFIRMED';
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
        Back to Rental Orders
      </Link>

      {/* Header */}
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1
            className='text-2xl font-bold tracking-tight'
            style={{ color: 'var(--foreground)' }}
          >
            Rental Order #{order.id.slice(0, 8)}
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

      {/* Summary cards */}
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
              Total Amount
            </h2>
          </div>
          <p
            className='text-2xl font-bold'
            style={{ color: 'var(--foreground)' }}
          >
            {formatCurrency(order.amount)}
          </p>
          {order.items && order.items.length > 0 && (
            <p
              className='mt-1 text-sm'
              style={{ color: 'var(--muted-foreground)' }}
            >
              {order.items.length} item{order.items.length > 1 ? 's' : ''}{' '}
              rented
            </p>
          )}
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
            {order.items.map((item) => {
              const gear = item.gearItem;
              const images = parseImages(gear?.images);
              const thumbnail = images[0];

              return (
                <li key={item.id} className='flex gap-4 px-5 py-4'>
                  {/* Thumbnail */}
                  <div
                    className='relative h-20 w-20 shrink-0 overflow-hidden rounded-lg'
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={gear?.name ?? 'Gear item'}
                        fill
                        className='object-cover'
                        sizes='80px'
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center'>
                        <Package
                          className='h-6 w-6'
                          style={{ color: 'var(--muted-foreground)' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className='flex flex-1 flex-col justify-between'>
                    <div>
                      <p
                        className='text-sm font-semibold'
                        style={{ color: 'var(--foreground)' }}
                      >
                        {gear?.name ?? `Gear #${item.gearItemId.slice(0, 8)}`}
                      </p>
                      {gear?.description && (
                        <p
                          className='mt-0.5 text-xs line-clamp-2'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {gear.description}
                        </p>
                      )}
                    </div>
                    <div className='mt-1.5 flex flex-wrap items-center gap-3 text-xs'>
                      {gear?.category && (
                        <span
                          className='inline-flex items-center gap-1'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          <Tag className='h-3 w-3' />
                          {gear.category.name}
                        </span>
                      )}
                      {gear?.provider && (
                        <span
                          className='inline-flex items-center gap-1'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          <Building2 className='h-3 w-3' />
                          {gear.provider.name}
                        </span>
                      )}
                      <span
                        className='inline-flex items-center gap-1'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className='flex flex-col items-end justify-between'>
                    <p
                      className='text-base font-bold'
                      style={{ color: 'var(--primary)' }}
                    >
                      {formatCurrency(item.price)}
                    </p>
                    <p
                      className='text-xs'
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      per day
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Payment History */}
      {order.payments && order.payments.length > 0 && (
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
            <Receipt className='h-4 w-4' style={{ color: '#7c3aed' }} />
            <h2
              className='text-sm font-semibold'
              style={{ color: 'var(--foreground)' }}
            >
              Payment History
            </h2>
          </div>
          <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
            {order.payments.map((payment) => (
              <li
                key={payment.id}
                className='flex items-center justify-between px-5 py-4'
              >
                <div className='flex flex-col gap-1'>
                  <p
                    className='text-sm font-medium'
                    style={{ color: 'var(--foreground)' }}
                  >
                    Transaction #{payment.transactionId}
                  </p>
                  <div className='flex items-center gap-2'>
                    {payment.paidAt && (
                      <span
                        className='inline-flex items-center gap-1 text-xs'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        <Clock className='h-3 w-3' />
                        {formatDateTime(payment.paidAt)}
                      </span>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <PaymentStatusBadge status={payment.status} />
                  <p
                    className='text-base font-bold'
                    style={{ color: 'var(--primary)' }}
                  >
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reviews */}
      {order.reviews && order.reviews.length > 0 ? (
        <OrderReviews reviews={order.reviews} />
      ) : (
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
            <Receipt className='h-4 w-4' style={{ color: 'var(--primary)' }} />
            <h2
              className='text-sm font-semibold'
              style={{ color: 'var(--foreground)' }}
            >
              Reviews
            </h2>
          </div>
          <div className='flex flex-col items-center justify-center px-5 py-10'>
            <Receipt
              className='mb-3 h-10 w-10'
              style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              No reviews yet
            </p>
            <p
              className='mt-1 text-xs'
              style={{ color: 'var(--muted-foreground)' }}
            >
              Reviews will appear here once they are submitted.
            </p>
          </div>
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
