import type { Metadata } from 'next';
import { Clock, CreditCard, ShoppingBag, Star } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PageHeader, SectionHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { ChartCard } from '@/components/charts/ChartCard';
import { LineChart } from '@/components/charts/LineChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { RankedBars } from '@/components/charts/RankedBars';
import {
  byMonth,
  monthOverMonth,
  PAYMENT_STATUS_META,
  rentalStatusBreakdown,
} from '@/lib/chart-data';
import { formatBDT } from '@/lib/gear-utils';
import type { PaymentStatus } from '@/lib/types';
import { getCustomerOverview } from './_actions/getCustomerOverview';
import { RecentRentalsTable } from './_components/RecentRentalsTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Customer Dashboard · GearUp' };

export default async function CustomerOverviewPage() {
  const { stats, orders, payments, sampled, errors } =
    await getCustomerOverview();

  /* Every series below is derived from the customer's own records. */
  const spendPerMonth = byMonth(orders, (order) => order.createdAt, {
    getValue: (order) => Number(order.amount) || 0,
  });
  const ordersByStatus = rentalStatusBreakdown(orders);

  // Bar length here is the money involved, not the transaction count — a
  // single failed high-value payment matters more than three small ones.
  const paymentsByOutcome = (
    ['COMPLETED', 'PENDING', 'FAILED'] as PaymentStatus[]
  ).map((status) => ({
    label: PAYMENT_STATUS_META[status].label,
    color: PAYMENT_STATUS_META[status].color,
    value: payments
      .filter((payment) => payment.status === status)
      .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0),
  }));

  const totalSpend = orders.reduce(
    (sum, order) => sum + (Number(order.amount) || 0),
    0,
  );
  const sampleNote = sampled
    ? ' Based on your 100 most recent orders.'
    : '';

  return (
    <div>
      {errors.length > 0 && <ErrorBanner message={errors[0]} />}

      <PageHeader
        title='Welcome back'
        description='Your rentals, payments and activity at a glance.'
      />

      {/* Overview cards */}
      <div className='mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatsCard
          title='Total Rental Orders'
          value={stats.totalOrders}
          icon={ShoppingBag}
          description='All time'
          tone='primary'
          href='/customer/rental-orders'
          trend={monthOverMonth(orders, (order) => order.createdAt)}
        />
        <StatsCard
          title='Active Rentals'
          value={stats.activeRentals}
          icon={Clock}
          description='Currently out with you'
          tone='secondary'
        />
        <StatsCard
          title='Payments Made'
          value={stats.paymentsMade}
          icon={CreditCard}
          description='All transactions'
          tone='accent'
          href='/customer/payments'
          trend={monthOverMonth(payments, (payment) => payment.createdAt)}
        />
        <StatsCard
          title='Reviews Given'
          value={stats.reviewsGiven}
          icon={Star}
          description='Feedback you have shared'
          tone='primary'
          href='/customer/reviews'
        />
      </div>

      {/* Charts */}
      <SectionHeader
        title='Your rental activity'
        description={`Trends from your real order and payment history.${sampleNote}`}
      />
      <div className='mb-8 grid gap-4 lg:grid-cols-3'>
        <ChartCard
          className='lg:col-span-2'
          title='Rental spend per month'
          description='Total order value over the last 6 months'
          action={
            <span className='block text-sm font-bold text-foreground'>
              {formatBDT(totalSpend)}
              <span className='mt-0.5 block text-[11px] font-medium text-muted-foreground'>
                sampled total
              </span>
            </span>
          }
          isEmpty={orders.length === 0}
          emptyTitle='No rentals yet'
          emptyDescription='Once you place a rental order, your monthly spend appears here.'
        >
          <LineChart
            data={spendPerMonth}
            seriesLabel='Rental spend'
            format='currency'
          />
        </ChartCard>

        <ChartCard
          title='Orders by status'
          description='Where your rentals are in the lifecycle'
          isEmpty={orders.length === 0}
          emptyTitle='No orders to break down'
          emptyDescription='Your rental statuses will be charted here.'
        >
          <DonutChart data={ordersByStatus} totalLabel='rental orders' />
        </ChartCard>
      </div>

      <div className='mb-8 grid gap-4 lg:grid-cols-3'>
        <ChartCard
          title='Payment outcomes'
          description='Value of your transactions by result'
          className='lg:col-span-3'
          isEmpty={payments.length === 0}
          emptyTitle='No payments yet'
          emptyDescription='Pay for a confirmed rental and the breakdown shows up here.'
        >
          <RankedBars
            data={paymentsByOutcome.map((slice) => ({
              label: slice.label,
              value: slice.value,
              color: slice.color,
              displayValue: formatBDT(Math.round(slice.value)),
            }))}
            valueLabel='taka'
            scaleTo='total'
            showShare
          />
        </ChartCard>
      </div>

      {/* Data table */}
      <SectionHeader
        title='Recent rental orders'
        description='Search, filter and page through your latest rentals.'
        linkHref='/customer/rental-orders'
      />
      <RecentRentalsTable orders={orders} />
    </div>
  );
}
