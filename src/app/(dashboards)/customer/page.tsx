import Link from 'next/link';
import { ShoppingBag, CreditCard, Star, Clock, ArrowRight } from 'lucide-react';
// import { getCurrentUser, serverFetch } from '@/lib/api';
// import type { RentalOrder, Payment, ApiResponse, ApiMeta } from '@/lib/api';
import {
  DUMMY_CUSTOMER,
  DUMMY_ORDERS,
  DUMMY_PAYMENTS,
  DUMMY_REVIEWS,
} from '@/lib/dummy-data';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCurrency(amount: string | number) {
  return `$${Number(amount).toFixed(2)}`;
}

export default async function CustomerOverviewPage() {
  // ── DEMO MODE: API calls commented out ──────────────────────────────────────
  // const user = await getCurrentUser();
  // const [rentalRes, paymentRes, reviewRes] = await Promise.allSettled([...]);
  const user = DUMMY_CUSTOMER;
  const rentals = DUMMY_ORDERS.filter(
    (o) => o.customerId === DUMMY_CUSTOMER.id,
  ).slice(0, 5);
  const activeRentals = rentals.filter(
    (r) => r.status === 'PAID' || r.status === 'PICKED_UP',
  ).length;
  const payments = DUMMY_PAYMENTS;
  const reviews = DUMMY_REVIEWS.filter(
    (r) => r.customerId === DUMMY_CUSTOMER.id,
  );
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Welcome */}
      <div className='mb-8'>
        <h1
          className='text-2xl font-bold tracking-tight'
          style={{ color: 'var(--foreground)' }}
        >
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p
          className='mt-1 text-sm'
          style={{ color: 'var(--muted-foreground)' }}
        >
          Here&apos;s a summary of your rental activity.
        </p>
      </div>

      {/* Stats cards */}
      <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Orders'
          value={rentals.length}
          icon={ShoppingBag}
          description='All time'
        />
        <StatsCard
          title='Active Rentals'
          value={activeRentals}
          icon={Clock}
          description='Currently rented'
          accentColor='#22c55e'
        />
        <StatsCard
          title='Payments Made'
          value={payments.length}
          icon={CreditCard}
          description='All transactions'
          accentColor='#7c3aed'
        />
        <StatsCard
          title='Reviews Given'
          value={reviews.length}
          icon={Star}
          description='Your feedback'
          accentColor='#f59e0b'
        />
      </div>

      {/* Recent orders */}
      <div
        className='rounded-xl border'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className='flex items-center justify-between border-b px-6 py-4'
          style={{ borderColor: 'var(--border)' }}
        >
          <h2
            className='text-base font-semibold'
            style={{ color: 'var(--foreground)' }}
          >
            Recent Orders
          </h2>
          <Link
            href='/customer/orders'
            className='flex items-center gap-1 text-sm font-medium transition-colors'
            style={{ color: 'var(--primary)' }}
          >
            View all <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </div>

        {rentals.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16'>
            <ShoppingBag
              className='mb-3 h-10 w-10'
              style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--muted-foreground)' }}
            >
              No orders yet
            </p>
            <p
              className='mt-1 text-xs'
              style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}
            >
              Browse gear to place your first rental.
            </p>
            <Link
              href='/gear'
              className='mt-4 inline-flex h-9 items-center rounded-lg px-4 text-sm font-semibold text-white transition-colors'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Browse Gear
            </Link>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr
                  className='border-b text-left text-xs font-semibold uppercase tracking-wide'
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  <th className='px-6 py-3'>Order ID</th>
                  <th className='px-6 py-3'>Dates</th>
                  <th className='px-6 py-3'>Amount</th>
                  <th className='px-6 py-3'>Status</th>
                  <th className='px-6 py-3'></th>
                </tr>
              </thead>
              <tbody
                className='divide-y'
                style={{ borderColor: 'var(--border)' }}
              >
                {rentals.map((order) => (
                  <tr
                    key={order.id}
                    className='transition-colors hover:bg-muted'
                  >
                    <td
                      className='px-6 py-4 text-sm font-mono'
                      style={{ color: 'var(--foreground)' }}
                    >
                      #{order.id.slice(0, 8)}
                    </td>
                    <td
                      className='px-6 py-4 text-sm'
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {formatDate(order.startDate)} –{' '}
                      {formatDate(order.endDate)}
                    </td>
                    <td
                      className='px-6 py-4 text-sm font-semibold'
                      style={{ color: 'var(--foreground)' }}
                    >
                      {formatCurrency(order.amount)}
                    </td>
                    <td className='px-6 py-4'>
                      <RentalStatusBadge status={order.status} />
                    </td>
                    <td className='px-6 py-4'>
                      <Link
                        href={`/customer/orders/${order.id}`}
                        className='text-sm font-medium transition-colors'
                        style={{ color: 'var(--primary)' }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
