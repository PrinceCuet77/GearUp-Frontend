import type { Metadata } from 'next';
import { ClipboardList, Clock, Package, PackageCheck } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PageHeader, SectionHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { ChartCard } from '@/components/charts/ChartCard';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { RankedBars } from '@/components/charts/RankedBars';
import {
  byMonth,
  countBy,
  monthOverMonth,
  rentalStatusBreakdown,
  topEntries,
} from '@/lib/chart-data';
import { formatBDT } from '@/lib/gear-utils';
import { getProviderOverview } from './_actions/getProviderOverview';
import { RecentOrdersTable } from './_components/RecentOrdersTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Provider Dashboard · GearUp' };

export default async function ProviderOverviewPage() {
  const { stats, orders, gears, sampled, errors } = await getProviderOverview();

  /* Series derived from this provider's own orders and inventory. */
  const revenuePerMonth = byMonth(orders, (order) => order.createdAt, {
    getValue: (order) => Number(order.amount) || 0,
  });
  const ordersByStatus = rentalStatusBreakdown(orders);
  const listingsByCategory = topEntries(
    countBy(gears, (gear) => gear.category?.name ?? 'Uncategorised'),
    6,
  );

  const sampledRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.amount) || 0),
    0,
  );
  const activeListings = gears.filter((gear) => gear.isActive).length;
  const sampleNote = sampled ? ' Based on your 100 most recent orders.' : '';

  return (
    <div>
      {errors.length > 0 && <ErrorBanner message={errors[0]} />}

      <PageHeader
        title='Provider Dashboard'
        description='How your inventory is performing and what needs your attention.'
      />

      {/* Overview cards */}
      <div className='mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatsCard
          title='Gear Listed'
          value={stats.totalGearListed}
          icon={Package}
          description={`${activeListings} active in the marketplace`}
          tone='primary'
          href='/provider/gears'
        />
        <StatsCard
          title='Total Orders'
          value={stats.totalOrders}
          icon={ClipboardList}
          description='Rentals received all time'
          tone='accent'
          href='/provider/rental-orders'
          trend={monthOverMonth(orders, (order) => order.createdAt)}
        />
        <StatsCard
          title='Needs Confirmation'
          value={stats.needsConfirmation}
          icon={Clock}
          description='Waiting on your response'
          tone='primary'
          href='/provider/rental-orders?status=PLACED'
        />
        <StatsCard
          title='Ready for Pickup'
          value={stats.readyForPickup}
          icon={PackageCheck}
          description='Confirmed and awaiting collection'
          tone='secondary'
          href='/provider/rental-orders?status=CONFIRMED'
        />
      </div>

      {/* Charts */}
      <SectionHeader
        title='Business performance'
        description={`Derived from your real orders and listings.${sampleNote}`}
      />
      <div className='mb-8 grid gap-4 lg:grid-cols-3'>
        <ChartCard
          className='lg:col-span-2'
          title='Order value per month'
          description='Total value of rentals received over the last 6 months'
          action={
            <span className='block text-sm font-bold text-foreground'>
              {formatBDT(sampledRevenue)}
              <span className='mt-0.5 block text-[11px] font-medium text-muted-foreground'>
                sampled total
              </span>
            </span>
          }
          isEmpty={orders.length === 0}
          emptyTitle='No orders yet'
          emptyDescription='When customers rent your gear, monthly order value appears here.'
        >
          <BarChart
            data={revenuePerMonth}
            seriesLabel='Order value'
            color='var(--chart-2)'
            format='currency'
          />
        </ChartCard>

        <ChartCard
          title='Orders by status'
          description='Where incoming rentals sit in the lifecycle'
          isEmpty={orders.length === 0}
          emptyTitle='No orders to break down'
          emptyDescription='Order statuses will be charted here.'
        >
          <DonutChart data={ordersByStatus} totalLabel='rental orders' />
        </ChartCard>
      </div>

      <div className='mb-8'>
        <ChartCard
          title='Listings by category'
          description='Where your inventory is concentrated'
          action={
            <span className='block text-sm font-bold text-foreground'>
              {gears.length}
              <span className='mt-0.5 block text-[11px] font-medium text-muted-foreground'>
                listings
              </span>
            </span>
          }
          isEmpty={gears.length === 0}
          emptyTitle='No gear listed yet'
          emptyDescription='Add your first listing to see how your inventory is spread across categories.'
        >
          <RankedBars
            data={listingsByCategory.map((row) => ({
              label: row.label,
              value: row.value,
              color: 'var(--chart-3)',
            }))}
            valueLabel='listings'
            showShare
          />
        </ChartCard>
      </div>

      {/* Data table */}
      <SectionHeader
        title='Recent rental orders'
        description='Search, filter and page through the latest requests.'
        linkHref='/provider/rental-orders'
      />
      <RecentOrdersTable orders={orders} />
    </div>
  );
}
