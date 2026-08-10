import Link from 'next/link';
import { ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import type { RentalOrder } from '@/lib/types';
import { getAllRentalOrdersForProvider } from './_actions/getAllRentalOrdersForProvider';
import { formatDate } from '@/lib/gear-utils';
import { ManageOrderButton } from './_components/ManageOrderButton';

const LIMIT = 10;

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'PLACED', label: 'Placed' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PICKED_UP', label: 'Picked Up' },
  { value: 'RETURNED', label: 'Returned' },
];

function buildHref(page: number, status: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (status) params.set('status', status);
  const qs = params.toString();
  return `/provider/rental-orders${qs ? `?${qs}` : ''}`;
}

export default async function ProviderOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { page: rawPage, status: rawStatus } = await searchParams;
  const currentStatus = rawStatus ?? '';
  const currentPage = Math.max(1, parseInt(rawPage ?? '1', 10) || 1);

  const result = await getAllRentalOrdersForProvider({
    page: currentPage,
    limit: LIMIT,
    status: currentStatus || undefined,
  });

  const orders: RentalOrder[] = result.success ? result.data : [];
  const totalPages = result.meta?.totalPages ?? 1;
  const total = result.meta?.total ?? 0;

  return (
    <div>
      {result.error && (
        <ErrorBanner
          title='Could not load rental orders'
          message={result.error}
        />
      )}

      <PageHeader
        title='Order Management'
        description={`${total} order${total !== 1 ? 's' : ''} received`}
      />

      <div className='mb-6 flex flex-wrap gap-2'>
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={buildHref(1, f.value)}
            className='rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all'
            style={
              currentStatus === f.value
                ? {
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }
                : {
                    backgroundColor: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                  }
            }
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div
        className='surface-card'
      >
        {orders.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <ClipboardList
              className='mb-3 h-10 w-10 opacity-30'
              style={{ color: 'var(--muted-foreground)' }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--muted-foreground)' }}
            >
              No orders found
            </p>
          </div>
        ) : (
          <>
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
                    <th className='px-6 py-3'>Rental Dates</th>
                    <th className='px-6 py-3'>Amount</th>
                    <th className='px-6 py-3'>Status</th>
                    <th className='px-6 py-3'>Action</th>
                  </tr>
                </thead>
                <tbody
                  className='divide-y'
                  style={{ borderColor: 'var(--border)' }}
                >
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className='transition-colors hover:bg-[var(--muted)]'
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
                        {order.customer?.name ??
                          order.customer?.email ??
                          '\u2014'}
                      </td>
                      <td
                        className='px-6 py-4 text-sm'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {formatDate(order.startDate)} -{' '}
                        {formatDate(order.endDate)}
                      </td>
                      <td
                        className='px-6 py-4 text-sm font-semibold'
                        style={{ color: 'var(--foreground)' }}
                      >
                        ৳{Number(order.amount).toFixed(2)}
                      </td>
                      <td className='px-6 py-4'>
                        <RentalStatusBadge status={order.status} />
                      </td>
                      <td className='px-6 py-4'>
                        <ManageOrderButton order={order} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div
                className='flex items-center justify-between border-t px-6 py-4'
                style={{ borderColor: 'var(--border)' }}
              >
                <p
                  className='text-sm'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Page {currentPage} of {totalPages}
                </p>
                <div className='flex items-center gap-2'>
                  <Link
                    href={buildHref(
                      Math.max(1, currentPage - 1),
                      currentStatus,
                    )}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                      currentPage === 1 ? 'pointer-events-none opacity-40' : ''
                    }`}
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                    aria-disabled={currentPage === 1}
                    tabIndex={currentPage === 1 ? -1 : undefined}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Link>
                  <Link
                    href={buildHref(
                      Math.min(totalPages, currentPage + 1),
                      currentStatus,
                    )}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-40'
                        : ''
                    }`}
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                    aria-disabled={currentPage === totalPages}
                    tabIndex={currentPage === totalPages ? -1 : undefined}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
