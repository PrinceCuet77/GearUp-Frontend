import Link from 'next/link';
import { Users, Package, ClipboardList, Tag, ArrowRight } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { getAdminDashboardInfo } from './_actions/getAdminDashboardInfo';

export default async function AdminOverviewPage() {
  const { data, error } = await getAdminDashboardInfo();

  const userTotal = data?.stats?.totalUsers ?? 0;
  const gearTotal = data?.stats?.activeGears ?? 0;
  const rentalTotal = data?.stats?.totalRentals ?? 0;
  const categoryTotal = data?.stats?.totalCategories ?? 0;

  const quickLinks = [
    {
      href: '/admin/users',
      label: 'Manage Users',
      description: 'View, suspend or activate user accounts.',
      icon: Users,
      color: '#3b82f6',
    },
    {
      href: '/admin/gears',
      label: 'All Gears Listings',
      description: 'Browse all gear across providers.',
      icon: Package,
      color: 'var(--primary)',
    },
    {
      href: '/admin/categories',
      label: 'Categories',
      description: 'Create and manage gear categories.',
      icon: Tag,
      color: '#22c55e',
    },
    {
      href: '/admin/change-password',
      label: 'Change Password',
      description: 'Update your account password.',
      icon: ClipboardList,
      color: '#7c3aed',
    },
  ];

  return (
    <div>
      {error && <ErrorBanner message={error} />}
      <div className='mb-8'>
        <h1
          className='text-2xl font-bold tracking-tight'
          style={{ color: 'var(--foreground)' }}
        >
          Admin Dashboard
        </h1>
        <p
          className='mt-1 text-sm'
          style={{ color: 'var(--muted-foreground)' }}
        >
          Platform overview and moderation controls.
        </p>
      </div>

      {/* Stats */}
      <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Users'
          value={userTotal}
          icon={Users}
          description='Registered accounts'
          accentColor='#3b82f6'
        />
        <StatsCard
          title='Active Gears'
          value={gearTotal}
          icon={Package}
          description='Active listings'
          accentColor='var(--primary)'
        />
        <StatsCard
          title='Total Rentals'
          value={rentalTotal}
          icon={ClipboardList}
          description='All time orders'
          accentColor='#7c3aed'
        />
        <StatsCard
          title='Categories'
          value={categoryTotal}
          icon={Tag}
          description='Gear categories'
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
