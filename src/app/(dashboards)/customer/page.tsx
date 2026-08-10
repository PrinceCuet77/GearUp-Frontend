import Link from 'next/link';
import { ShoppingBag, CreditCard, Star, Clock, ArrowRight } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { getCustomerDashboardInfo } from './_actions/getCustomerDashboardInfo';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { formatBDT, formatShortDate } from '@/lib/gear-utils';
import type { CustomerRentalOrder, RentalStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

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
        <ErrorBanner message={result.error} />
      )}

      <PageHeader
        title='Welcome back!'
        description="Here's a summary of your rental activity."
      />

      {/* Stats cards */}
      <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Rental Orders'
          value={stats.totalOrders}
          icon={ShoppingBag}
          description='All time'
          tone='primary'
        />
        <StatsCard
          title='Active Rentals'
          value={stats.activeRentals}
          icon={Clock}
          description='Currently rented'
          tone='secondary'
        />
        <StatsCard
          title='Payments Made'
          value={stats.paymentsMade}
          icon={CreditCard}
          description='All transactions'
          tone='accent'
        />
        <StatsCard
          title='Reviews Given'
          value={stats.reviewsGiven}
          icon={Star}
          description='Your feedback'
          tone='primary'
        />
      </div>

      {/* Recent orders */}
      <div className='surface-card overflow-hidden'>
        <div className='flex items-center justify-between gap-4 border-b border-border px-6 py-4'>
          <h2 className='text-base font-bold text-foreground'>
            Recent Rental Orders
          </h2>
          <Link
            href='/customer/rental-orders'
            className='flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-opacity hover:opacity-80'
          >
            View all <ArrowRight className='h-3.5 w-3.5' aria-hidden='true' />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title='No rental orders yet'
            description='Browse gear to place your first rental.'
            className='border-0 shadow-none'
            action={
              <ButtonLink href='/gears' size='sm'>
                Browse Gear
              </ButtonLink>
            }
          />
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[640px]'>
              <thead>
                <tr className='border-b border-border text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
                  <th className='px-6 py-3'>Rental Order ID</th>
                  <th className='px-6 py-3'>Dates</th>
                  <th className='px-6 py-3'>Amount</th>
                  <th className='px-6 py-3'>Status</th>
                  <th className='px-6 py-3'>
                    <span className='sr-only'>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className='transition-colors hover:bg-muted'
                  >
                    <td className='px-6 py-4 font-mono text-sm text-foreground'>
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap text-muted-foreground'>
                      {formatShortDate(order.startDate)} –{' '}
                      {formatShortDate(order.endDate)}
                    </td>
                    <td className='px-6 py-4 text-sm font-semibold text-foreground'>
                      {formatBDT(order.amount)}
                    </td>
                    <td className='px-6 py-4'>
                      <RentalStatusBadge status={order.status as RentalStatus} />
                    </td>
                    <td className='px-6 py-4'>
                      <Link
                        href={`/customer/rental-orders/${order.id}`}
                        className='text-sm font-semibold text-primary transition-opacity hover:opacity-80'
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
