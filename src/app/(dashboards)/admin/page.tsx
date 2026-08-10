import { Users, Package, ClipboardList, Tag } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  QuickActionGrid,
  type QuickAction,
} from '@/components/dashboard/QuickActionCard';
import { getAdminDashboardInfo } from './_actions/getAdminDashboardInfo';

export default async function AdminOverviewPage() {
  const { data, error } = await getAdminDashboardInfo();

  const userTotal = data?.stats?.totalUsers ?? 0;
  const gearTotal = data?.stats?.activeGears ?? 0;
  const rentalTotal = data?.stats?.totalRentals ?? 0;
  const categoryTotal = data?.stats?.totalCategories ?? 0;

  const quickLinks: QuickAction[] = [
    {
      href: '/admin/users',
      label: 'Manage Users',
      description: 'View, suspend or activate user accounts.',
      icon: Users,
      tone: 'accent',
    },
    {
      href: '/admin/gears',
      label: 'All Gears Listings',
      description: 'Browse all gear across providers.',
      icon: Package,
      tone: 'primary',
    },
    {
      href: '/admin/categories',
      label: 'Categories',
      description: 'Create and manage gear categories.',
      icon: Tag,
      tone: 'secondary',
    },
    {
      href: '/admin/change-password',
      label: 'Change Password',
      description: 'Update your account password.',
      icon: ClipboardList,
      tone: 'accent',
    },
  ];

  return (
    <div>
      {error && <ErrorBanner message={error} />}

      <PageHeader
        title='Admin Dashboard'
        description='Platform overview and moderation controls.'
      />

      {/* Stats */}
      <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Users'
          value={userTotal}
          icon={Users}
          description='Registered accounts'
          tone='accent'
        />
        <StatsCard
          title='Active Gears'
          value={gearTotal}
          icon={Package}
          description='Active listings'
          tone='primary'
        />
        <StatsCard
          title='Total Rentals'
          value={rentalTotal}
          icon={ClipboardList}
          description='All time orders'
          tone='accent'
        />
        <StatsCard
          title='Categories'
          value={categoryTotal}
          icon={Tag}
          description='Gear categories'
          tone='secondary'
        />
      </div>

      {/* Quick links */}
      <h2 className='mb-4 text-base font-bold text-foreground'>Quick Actions</h2>
      <QuickActionGrid actions={quickLinks} />
    </div>
  );
}
