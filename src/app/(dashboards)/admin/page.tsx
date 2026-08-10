import type { Metadata } from 'next';
import { ClipboardList, Package, Tag, Users } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PageHeader, SectionHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { ChartCard } from '@/components/charts/ChartCard';
import { LineChart } from '@/components/charts/LineChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { RankedBars } from '@/components/charts/RankedBars';
import {
  byMonth,
  countBy,
  monthOverMonth,
  roleBreakdown,
  topEntries,
} from '@/lib/chart-data';
import { getAdminOverview } from './_actions/getAdminOverview';
import { RecentUsersTable } from './_components/RecentUsersTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin Dashboard · GearUp' };

export default async function AdminOverviewPage() {
  const { stats, users, gears, categories, sampled, errors } =
    await getAdminOverview();

  /* Series derived from the platform's own user and listing records. */
  const signupsPerMonth = byMonth(users, (user) => user.createdAt);
  const usersByRole = roleBreakdown(users);
  const listingsByCategory = topEntries(
    countBy(gears, (gear) => gear.category?.name ?? 'Uncategorised'),
    6,
  );

  const activeListings = gears.filter((gear) => gear.isActive).length;
  const sampleNote = sampled
    ? ' Charts read the 100 most recent records.'
    : '';

  return (
    <div>
      {errors.length > 0 && <ErrorBanner message={errors[0]} />}

      <PageHeader
        title='Admin Dashboard'
        description='Platform health, growth and moderation at a glance.'
      />

      {/* Overview cards */}
      <div className='mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatsCard
          title='Total Users'
          value={stats.totalUsers}
          icon={Users}
          description='Registered accounts'
          tone='accent'
          href='/admin/users'
          trend={monthOverMonth(users, (user) => user.createdAt, {
            label: 'new signups vs last month',
          })}
        />
        <StatsCard
          title='Active Gear'
          value={stats.activeGears}
          icon={Package}
          description={`${activeListings} active in the sampled listings`}
          tone='primary'
          href='/admin/gears'
        />
        <StatsCard
          title='Total Rentals'
          value={stats.totalRentals}
          icon={ClipboardList}
          description='Orders placed all time'
          tone='accent'
        />
        <StatsCard
          title='Categories'
          value={stats.totalCategories || categories.length}
          icon={Tag}
          description='Gear categories in use'
          tone='secondary'
          href='/admin/categories'
        />
      </div>

      {/* Charts */}
      <SectionHeader
        title='Platform activity'
        description={`Derived from live account and listing data.${sampleNote}`}
        linkHref='/admin/analytics'
        linkLabel='Full analytics'
      />
      <div className='mb-8 grid gap-4 lg:grid-cols-3'>
        <ChartCard
          className='lg:col-span-2'
          title='New accounts per month'
          description='Registrations over the last 6 months'
          isEmpty={users.length === 0}
          emptyTitle='No accounts yet'
          emptyDescription='Signups will be charted here as people register.'
        >
          <LineChart data={signupsPerMonth} seriesLabel='New accounts' />
        </ChartCard>

        <ChartCard
          title='Accounts by role'
          description='Split of the sampled user base'
          isEmpty={users.length === 0}
          emptyTitle='No accounts to break down'
          emptyDescription='The role split appears once users register.'
        >
          <DonutChart data={usersByRole} totalLabel='accounts' />
        </ChartCard>
      </div>

      <div className='mb-8'>
        <ChartCard
          title='Listings by category'
          description='Which categories providers are listing into'
          action={
            <span className='block text-sm font-bold text-foreground'>
              {gears.length}
              <span className='mt-0.5 block text-[11px] font-medium text-muted-foreground'>
                listings sampled
              </span>
            </span>
          }
          isEmpty={gears.length === 0}
          emptyTitle='No listings yet'
          emptyDescription='Once providers list gear, category distribution shows here.'
        >
          <RankedBars
            data={listingsByCategory.map((row) => ({
              label: row.label,
              value: row.value,
              color: 'var(--chart-2)',
            }))}
            valueLabel='listings'
            showShare
          />
        </ChartCard>
      </div>

      {/* Data table */}
      <SectionHeader
        title='Newest accounts'
        description='Search, filter and page through recent registrations.'
        linkHref='/admin/users'
        linkLabel='Manage users'
      />
      <RecentUsersTable users={users} />
    </div>
  );
}
