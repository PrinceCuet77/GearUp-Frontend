import type { Metadata } from 'next';
import { Boxes, ClipboardList, Coins, Percent } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PageHeader, SectionHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { GearListingsTable } from '@/components/dashboard/GearListingsTable';
import { ChartCard } from '@/components/charts/ChartCard';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { RankedBars } from '@/components/charts/RankedBars';
import { byMonth, cumulative, sumBy, topEntries } from '@/lib/chart-data';
import { formatBDT } from '@/lib/gear-utils';
import { getProviderOverview } from '../_actions/getProviderOverview';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Provider Analytics · GearUp' };

export default async function ProviderAnalyticsPage() {
  const { orders, gears, sampled, errors } = await getProviderOverview();

  const orderValue = (order: { amount: string }) => Number(order.amount) || 0;
  const totalValue = orders.reduce((sum, order) => sum + orderValue(order), 0);
  const completed = orders.filter((order) => order.status === 'RETURNED');
  const cancelled = orders.filter((order) => order.status === 'CANCELLED');
  const activeListings = gears.filter((gear) => gear.isActive);

  const ordersPerMonth = byMonth(orders, (order) => order.createdAt);
  const valuePerMonth = byMonth(orders, (order) => order.createdAt, {
    getValue: orderValue,
  });
  const cumulativeValue = cumulative(valuePerMonth);

  const availability = [
    { label: 'Active', value: activeListings.length, color: 'var(--chart-2)' },
    {
      label: 'Paused',
      value: gears.length - activeListings.length,
      color: 'var(--muted-foreground)',
    },
  ];

  const stockByCategory = topEntries(
    sumBy(
      gears,
      (gear) => gear.category?.name ?? 'Uncategorised',
      (gear) => gear.stock,
    ),
    6,
  );

  const averageOrder = orders.length ? Math.round(totalValue / orders.length) : 0;
  const completionRate = orders.length
    ? Math.round((completed.length / orders.length) * 100)
    : 0;
  const totalStock = gears.reduce((sum, gear) => sum + gear.stock, 0);
  const sampleNote = sampled ? ' Based on your 100 most recent orders.' : '';

  return (
    <div>
      {errors.length > 0 && <ErrorBanner message={errors[0]} />}

      <PageHeader
        title='Provider Analytics'
        description='Demand, revenue and inventory health for your listings.'
      />

      <div className='mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatsCard
          title='Order Value'
          value={formatBDT(totalValue)}
          icon={Coins}
          description='Across sampled orders'
          tone='primary'
        />
        <StatsCard
          title='Average Order'
          value={formatBDT(averageOrder)}
          icon={ClipboardList}
          description={`${orders.length} orders sampled`}
          tone='accent'
        />
        <StatsCard
          title='Completion Rate'
          value={`${completionRate}%`}
          icon={Percent}
          description={`${completed.length} returned · ${cancelled.length} cancelled`}
          tone='secondary'
        />
        <StatsCard
          title='Units in Stock'
          value={totalStock}
          icon={Boxes}
          description={`${activeListings.length} active listings`}
          tone='primary'
        />
      </div>

      <SectionHeader
        title='Demand and revenue'
        description={`Computed from your real rental orders.${sampleNote}`}
      />
      <div className='mb-4 grid gap-4 lg:grid-cols-2'>
        <ChartCard
          title='Orders received per month'
          description='Rental requests over the last 6 months'
          isEmpty={orders.length === 0}
          emptyTitle='No orders yet'
          emptyDescription='Incoming rentals will be charted here.'
        >
          <BarChart data={ordersPerMonth} seriesLabel='Orders' />
        </ChartCard>

        <ChartCard
          title='Cumulative order value'
          description='Running total across the last 6 months'
          action={
            <span className='block text-sm font-bold text-foreground'>
              {formatBDT(totalValue)}
              <span className='mt-0.5 block text-[11px] font-medium text-muted-foreground'>
                sampled total
              </span>
            </span>
          }
          isEmpty={orders.length === 0}
          emptyTitle='No revenue yet'
          emptyDescription='Order value accumulates here as rentals come in.'
        >
          <LineChart
            data={cumulativeValue}
            seriesLabel='Cumulative value'
            color='var(--chart-2)'
            format='currency'
          />
        </ChartCard>
      </div>

      <div className='mb-8 grid gap-4 lg:grid-cols-2'>
        <ChartCard
          title='Listing availability'
          description='Active versus paused inventory'
          isEmpty={gears.length === 0}
          emptyTitle='No listings yet'
          emptyDescription='Availability appears once you list gear.'
        >
          <DonutChart data={availability} totalLabel='listings' />
        </ChartCard>

        <ChartCard
          title='Stock by category'
          description='Where your available units sit'
          isEmpty={gears.length === 0}
          emptyTitle='No stock recorded'
          emptyDescription='Add listings with stock to see this breakdown.'
        >
          <RankedBars
            data={stockByCategory.map((row) => ({
              label: row.label,
              value: row.value,
              color: 'var(--chart-3)',
            }))}
            valueLabel='units'
            showShare
          />
        </ChartCard>
      </div>

      <SectionHeader
        title='My listings'
        description='Search, filter by category or availability, and page through your inventory.'
        linkHref='/provider/gears'
        linkLabel='Manage gear'
      />
      <GearListingsTable
        gears={gears}
        caption='Your gear listings'
        emptyTitle='No gear listed yet'
        emptyDescription='Add your first listing to start receiving rental orders.'
      />
    </div>
  );
}
