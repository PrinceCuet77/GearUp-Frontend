import Link from 'next/link';
import { ShoppingBag, CreditCard, Star, Clock, ArrowRight } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { getCustomerDashboardInfo } from './_actions/getCustomerDashboardInfo';
import { DashboardErrorBanner } from './_components/DashboardErrorBanner';
import type { CustomerRentalOrder } from './_actions/getCustomerDashboardInfo';

export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCurrency(amount: string | number) {
  return `৳${Number(amount).toFixed(2)}/day`;
}

export default async function CustomerOverviewPage() {
  const result = await getCustomerDashboardInfo();

  const stats = result.data?.stats ?? {
    totalOrders: 0,
    activeRentals: 0,
    paymentsMade: 0,
    reviewsGiven: 0,
  };
  const recentOrders: CustomerRentalOrder[] = result.data?.recentOrders ?? [];

  return (
    <div>
      {/* Error banner */}
      {!result.success && result.error && (
        <DashboardErrorBanner error={result.error} />
      )}

      {/* Welcome */}
      <div className='mb-8'>
        <h1
          className='text-2xl font-bold tracking-tight'
          style={{ color: 'var(--foreground)' }}
        >
          Welcome back!
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
          title='Total Rental Orders'
          value={stats.totalOrders}
          icon={ShoppingBag}
          description='All time'
        />
        <StatsCard
          title='Active Rentals'
          value={stats.activeRentals}
          icon={Clock}
          description='Currently rented'
          accentColor='#22c55e'
        />
        <StatsCard
          title='Payments Made'
          value={stats.paymentsMade}
          icon={CreditCard}
          description='All transactions'
          accentColor='#7c3aed'
        />
        <StatsCard
          title='Reviews Given'
          value={stats.reviewsGiven}
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
            Recent Rental Orders
          </h2>
          <Link
            href='/customer/rental-orders'
            className='flex items-center gap-1 text-sm font-medium transition-colors'
            style={{ color: 'var(--primary)' }}
          >
            View all <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16'>
            <ShoppingBag
              className='mb-3 h-10 w-10'
              style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--muted-foreground)' }}
            >
              No rental orders yet
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
                  <th className='px-6 py-3'>Rental Order ID</th>
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
                {recentOrders.map((order) => (
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
                      <RentalStatusBadge
                        status={
                          order.status as import('@/lib/types').RentalStatus
                        }
                      />
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
