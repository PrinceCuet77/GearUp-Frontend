import type { Metadata } from 'next';
import { Activity, Package, Store, Users } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PageHeader, SectionHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { GearListingsTable } from '@/components/dashboard/GearListingsTable';
import { ChartCard } from '@/components/charts/ChartCard';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { RankedBars } from '@/components/charts/RankedBars';
import { niceScale } from '@/components/charts/chart-utils';
import {
  byMonth,
  countBy,
  cumulative,
  distribute,
  topEntries,
} from '@/lib/chart-data';
import { formatBDT } from '@/lib/gear-utils';
import { getAdminOverview } from '../_actions/getAdminOverview';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Platform Analytics · GearUp' };

export default async function AdminAnalyticsPage() {
  const { stats, users, gears, sampled, errors } = await getAdminOverview();

  const providers = users.filter((user) => user.role === 'PROVIDER');
  const customers = users.filter((user) => user.role === 'CUSTOMER');
  const activeListings = gears.filter((gear) => gear.isActive);

  /* Growth: the running account total, seeded with everything that predates
     the six-month window so the curve starts at the real number. */
  const signupsPerMonth = byMonth(users, (user) => user.createdAt);
  const signupsInWindow = signupsPerMonth.reduce(
    (sum, point) => sum + point.value,
    0,
  );
  const accountGrowth = cumulative(
    signupsPerMonth,
    Math.max(0, stats.totalUsers - signupsInWindow),
  );

  const listingsPerMonth = byMonth(gears, (gear) => gear.createdAt);
  const availability = [
    {
      label: 'Active',
      value: activeListings.length,
      color: 'var(--chart-2)',
    },
    {
      label: 'Inactive',
      value: gears.length - activeListings.length,
      color: 'var(--muted-foreground)',
    },
  ];
  const topProviders = topEntries(
    countBy(
      gears,
      (gear) => gear.provider?.name ?? gear.provider?.email ?? 'Unknown',
    ),
    6,
  );
  /* Band edges come from the data, not a fixed ladder: a marketplace of ৳25
     day-rates and one of ৳6,000 day-rates both need four meaningful bands. */
  const priceTicks = niceScale(
    Math.max(...gears.map((gear) => Number(gear.price) || 0), 0),
    4,
  ).ticks.filter((tick) => tick > 0);
  const priceBands = distribute(
    gears,
    (gear) => Number(gear.price),
    priceTicks.slice(0, -1),
    (value) => formatBDT(value),
  );

  const activeRate = gears.length
    ? Math.round((activeListings.length / gears.length) * 100)
    : 0;
  const listingsPerProvider = providers.length
    ? (gears.length / providers.length).toFixed(1)
    : '0';
  const sampleNote = sampled
    ? ' Charts read the 100 most recent users and listings.'
    : '';

  return (
    <div>
      {errors.length > 0 && <ErrorBanner message={errors[0]} />}

      <PageHeader
        title='Platform Analytics'
        description='Growth, supply and pricing across the GearUp marketplace.'
      />

      <div className='mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatsCard
          title='Customers'
          value={customers.length}
          icon={Users}
          description='In the sampled accounts'
          tone='accent'
        />
        <StatsCard
          title='Providers'
          value={providers.length}
          icon={Store}
          description='Accounts listing gear'
          tone='secondary'
        />
        <StatsCard
          title='Listings per Provider'
          value={listingsPerProvider}
          icon={Package}
          description='Average across sampled data'
          tone='primary'
        />
        <StatsCard
          title='Active Listing Rate'
          value={`${activeRate}%`}
          icon={Activity}
          description='Listings currently rentable'
          tone='secondary'
        />
      </div>

      <SectionHeader
        title='Marketplace growth'
        description={`Every series below is computed from live records.${sampleNote}`}
      />
      <div className='mb-4 grid gap-4 lg:grid-cols-3'>
        <ChartCard
          className='lg:col-span-2'
          title='Total accounts over time'
          description='Cumulative registrations across the last 6 months'
          isEmpty={users.length === 0}
          emptyTitle='No accounts yet'
          emptyDescription='Growth is charted once people start registering.'
        >
          <LineChart data={accountGrowth} seriesLabel='Total accounts' />
        </ChartCard>

        <ChartCard
          title='Listing availability'
          description='Active versus paused inventory'
          isEmpty={gears.length === 0}
          emptyTitle='No listings yet'
          emptyDescription='Availability appears once providers list gear.'
        >
          <DonutChart data={availability} totalLabel='listings' />
        </ChartCard>
      </div>

      <div className='mb-8 grid gap-4 lg:grid-cols-2'>
        <ChartCard
          title='New listings per month'
          description='Supply added over the last 6 months'
          isEmpty={gears.length === 0}
          emptyTitle='No listings yet'
          emptyDescription='New inventory will be charted here.'
        >
          <BarChart
            data={listingsPerMonth}
            seriesLabel='New listings'
            color='var(--chart-3)'
          />
        </ChartCard>

        <ChartCard
          title='Price-per-day distribution'
          description='How listings are priced across the marketplace'
          isEmpty={gears.length === 0}
          emptyTitle='No pricing data yet'
          emptyDescription='Price bands appear once gear is listed.'
        >
          <RankedBars
            data={priceBands.map((band) => ({
              label: band.label,
              value: band.value,
              color: 'var(--chart-1)',
            }))}
            valueLabel='listings'
            showShare
          />
        </ChartCard>
      </div>

      <div className='mb-8'>
        <ChartCard
          title='Top providers by inventory'
          description='Who is supplying the most gear'
          isEmpty={topProviders.length === 0}
          emptyTitle='No providers yet'
          emptyDescription='Provider rankings appear once gear is listed.'
        >
          <RankedBars
            data={topProviders.map((row) => ({
              label: row.label,
              value: row.value,
              color: 'var(--chart-2)',
            }))}
            valueLabel='listings'
          />
        </ChartCard>
      </div>

      <SectionHeader
        title='Listings detail'
        description='Search, filter by category or availability, and page through the sampled listings.'
        linkHref='/admin/gears'
        linkLabel='Manage gear'
      />
      <GearListingsTable
        gears={gears}
        showProvider
        caption='Sampled gear listings across all providers'
        emptyTitle='No listings yet'
        emptyDescription='Listings created by providers will appear here.'
      />
    </div>
  );
}
