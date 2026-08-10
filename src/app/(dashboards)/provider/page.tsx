import {
  Package,
  ClipboardList,
  Clock,
  KeyRound,
  UserCog,
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  QuickActionGrid,
  type QuickAction,
} from '@/components/dashboard/QuickActionCard';
import { getProviderDashboardInfo } from './_actions/getProviderDashboardInfo';

export default async function ProviderDashboardPage() {
  const result = await getProviderDashboardInfo();

  const stats = result.data?.stats ?? {
    totalGearListed: 0,
    totalOrders: 0,
    needsConfirmation: 0,
    readyForPickup: 0,
  };

  const quickLinks: QuickAction[] = [
    {
      href: '/provider/gears',
      label: 'My Gears',
      description: 'View and manage your listed gear inventory.',
      icon: Package,
      tone: 'primary',
    },
    {
      href: '/provider/rental-orders',
      label: 'Rental Orders',
      description: 'Review and manage incoming rental requests.',
      icon: ClipboardList,
      tone: 'accent',
    },
    {
      href: '/provider/profile',
      label: 'Profile Settings',
      description: 'Update your provider profile and preferences.',
      icon: UserCog,
      tone: 'secondary',
    },
    {
      href: '/provider/change-password',
      label: 'Change Password',
      description: 'Update your account security credentials.',
      icon: KeyRound,
      tone: 'accent',
    },
  ];

  return (
    <div>
      {result.error && <ErrorBanner message={result.error} />}

      <PageHeader
        title='Provider Dashboard'
        description='Manage your gear inventory and incoming orders.'
      />

      {/* Stats */}
      <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Gear Listed'
          value={stats.totalGearListed}
          icon={Package}
          description='In your inventory'
          tone='primary'
        />
        <StatsCard
          title='Total Orders'
          value={stats.totalOrders}
          icon={ClipboardList}
          description='All incoming orders'
          tone='accent'
        />
        <StatsCard
          title='Needs Confirmation'
          value={stats.needsConfirmation}
          icon={Clock}
          description='Awaiting your confirmation'
          tone='primary'
        />
        <StatsCard
          title='Ready for Pickup'
          value={stats.readyForPickup}
          icon={Package}
          description='Confirmed and waiting'
          tone='secondary'
        />
      </div>

      {/* Quick links */}
      <h2 className='mb-4 text-base font-bold text-foreground'>Quick Actions</h2>
      <QuickActionGrid actions={quickLinks} />
    </div>
  );
}
