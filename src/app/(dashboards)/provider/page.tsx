import Link from 'next/link';
import {
  Package,
  ClipboardList,
  Clock,
  ArrowRight,
  KeyRound,
  UserCog,
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { getProviderDashboardInfo } from './_actions/getProviderDashboardInfo';

export default async function ProviderDashboardPage() {
  const result = await getProviderDashboardInfo();

  const stats = result.data?.stats ?? {
    totalGearListed: 0,
    totalOrders: 0,
    needsConfirmation: 0,
    readyForPickup: 0,
  };

  const quickLinks = [
    {
      href: '/provider/gears',
      label: 'My Gears',
      description: 'View and manage your listed gear inventory.',
      icon: Package,
      color: 'var(--primary)',
    },
    {
      href: '/provider/rental-orders',
      label: 'Rental Orders',
      description: 'Review and manage incoming rental requests.',
      icon: ClipboardList,
      color: '#7c3aed',
    },
    {
      href: '/provider/profile',
      label: 'Profile Settings',
      description: 'Update your provider profile and preferences.',
      icon: UserCog,
      color: '#22c55e',
    },
    {
      href: '/provider/change-password',
      label: 'Change Password',
      description: 'Update your account security credentials.',
      icon: KeyRound,
      color: '#f59e0b',
    },
  ];

  return (
    <div>
      {result.error && <ErrorBanner message={result.error} />}

      <div className='mb-8'>
        <h1
          className='text-2xl font-bold tracking-tight'
          style={{ color: 'var(--foreground)' }}
        >
          Provider Dashboard
        </h1>
        <p
          className='mt-1 text-sm'
          style={{ color: 'var(--muted-foreground)' }}
        >
          Manage your gear inventory and incoming orders.
        </p>
      </div>

      {/* Stats */}
      <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Gear Listed'
          value={stats.totalGearListed}
          icon={Package}
          description='In your inventory'
          accentColor='var(--primary)'
        />
        <StatsCard
          title='Total Orders'
          value={stats.totalOrders}
          icon={ClipboardList}
          description='All incoming orders'
          accentColor='#7c3aed'
        />
        <StatsCard
          title='Needs Confirmation'
          value={stats.needsConfirmation}
          icon={Clock}
          description='Awaiting your confirmation'
          accentColor='#f59e0b'
        />
        <StatsCard
          title='Ready for Pickup'
          value={stats.readyForPickup}
          icon={Package}
          description='Confirmed and waiting'
          accentColor='#22c55e'
        />
      </div>

      {/* Quick links */}
      <h2
        className='mb-4 text-base font-semibold'
        style={{ color: 'var(--foreground)' }}
      >
        Quick Actions
      </h2>
      <div className='grid gap-4 sm:grid-cols-2'>
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className='group flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md'
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              <div
                className='mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'
                style={{
                  backgroundColor: `color-mix(in srgb, ${link.color} 14%, transparent)`,
                }}
              >
                <Icon className='h-5 w-5' style={{ color: link.color }} />
              </div>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center justify-between'>
                  <p
                    className='text-sm font-semibold'
                    style={{ color: 'var(--foreground)' }}
                  >
                    {link.label}
                  </p>
                  <ArrowRight
                    className='h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100'
                    style={{ color: 'var(--muted-foreground)' }}
                  />
                </div>
                <p
                  className='mt-0.5 text-sm'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {link.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
