import Link from 'next/link';
import {
  Package,
  ClipboardList,
  Clock,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { getProviderDashboardInfo } from './_actions/getProviderDashboardInfo';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  });
}

export default async function ProviderDashboardPage() {
  const result = await getProviderDashboardInfo();

  const stats = result.data?.stats ?? {
    totalGearListed: 0,
    totalOrders: 0,
    pendingOrders: 0,
  };
  const orders = result.data?.recentOrders ?? [];

  return (
    <div>
      {!result.success && result.error && (
        <ErrorBanner
          title='Could not load provider dashboard'
          message={result.error}
        />
      )}

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
      <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <StatsCard
          title='Total Gear Listed'
          value={stats.totalGearListed}
          icon={Package}
          description='In your inventory'
        />
        <StatsCard
          title='Total Orders'
          value={stats.totalOrders}
          icon={ClipboardList}
          description='All incoming orders'
          accentColor='#7c3aed'
        />
        <StatsCard
          title='Pending Approval'
          value={stats.pendingOrders}
          icon={Clock}
          description='Awaiting confirmation'
          accentColor='#f59e0b'
        />
      </div>

      {/* Recent orders */}
      <div
        className='rounded-xl border'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className='flex items-center justify-between border-b px-6 py-4'
          style={{ borderColor: 'var(--border)' }}
        >
          <h2
            className='text-base font-semibold'
            style={{ color: 'var(--foreground)' }}
          >
            Recent Orders
          </h2>
          <Link
            href='/provider/rental-orders'
            className='flex items-center gap-1 text-sm font-medium'
            style={{ color: 'var(--primary)' }}
          >
            View all <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16'>
            <ClipboardList
              className='mb-3 h-10 w-10 opacity-30'
              style={{ color: 'var(--muted-foreground)' }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--muted-foreground)' }}
            >
              No orders yet
            </p>
            <p
              className='mt-1 text-xs'
              style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}
            >
              Add gear to start receiving rental orders.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr
                  className='border-b text-left text-xs font-semibold uppercase tracking-wide'
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  <th className='px-6 py-3'>Order ID</th>
                  <th className='px-6 py-3'>Customer</th>
                  <th className='px-6 py-3'>Dates</th>
                  <th className='px-6 py-3'>Amount</th>
                  <th className='px-6 py-3'>Status</th>
                  <th className='px-6 py-3'></th>
                </tr>
              </thead>
              <tbody
                className='divide-y'
                style={{ borderColor: 'var(--border)' }}
              >
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className='transition-colors hover:bg-muted'
                  >
                    <td
                      className='px-6 py-4 font-mono text-sm'
                      style={{ color: 'var(--foreground)' }}
                    >
                      #{order.id.slice(0, 8)}
                    </td>
                    <td
                      className='px-6 py-4 text-sm'
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {order.customer?.name ?? order.customer?.email ?? '—'}
                    </td>
                    <td
                      className='px-6 py-4 text-sm'
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {formatDate(order.startDate)} –{' '}
                      {formatDate(order.endDate)}
                    </td>
                    <td
                      className='px-6 py-4 text-sm font-semibold'
                      style={{ color: 'var(--foreground)' }}
                    >
                      ${Number(order.amount).toFixed(2)}
                    </td>
                    <td className='px-6 py-4'>
                      <RentalStatusBadge status={order.status} />
                    </td>
                    <td className='px-6 py-4'>
                      <Link
                        href={`/provider/rental-orders/${order.id}`}
                        className='text-sm font-medium'
                        style={{ color: 'var(--primary)' }}
                      >
                        Manage
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
