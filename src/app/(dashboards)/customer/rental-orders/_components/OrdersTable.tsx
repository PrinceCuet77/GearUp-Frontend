'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import type { RentalOrder } from '@/lib/types';

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'PLACED', label: 'Placed' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PICKED_UP', label: 'Picked Up' },
  { value: 'RETURNED', label: 'Returned' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  });
}

function formatCurrency(amount: string | number) {
  return `Tk ${Number(amount).toFixed(2)}/per day`;
}

interface OrdersTableProps {
  orders: RentalOrder[];
  page: number;
  totalPages: number;
  total: number;
  statusFilter: string;
}

export function OrdersTable({
  orders,
  page,
  totalPages,
  total,
  statusFilter,
}: OrdersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      return params.toString();
    },
    [searchParams],
  );

  const handleStatusChange = (status: string) => {
    router.push(`${pathname}?${createQueryString({ status, page: '1' })}`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString({ page: String(newPage) })}`);
  };

  return (
    <div>
      {/* Status filter pills */}
      <div className='mb-6 flex flex-wrap gap-2'>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleStatusChange(f.value)}
            className='cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all'
            style={
              statusFilter === f.value
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
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className='rounded-xl border'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        {orders.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <ShoppingBag
              className='mb-3 h-10 w-10 opacity-30'
              style={{ color: 'var(--muted-foreground)' }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--muted-foreground)' }}
            >
              No rental orders found
            </p>
            {statusFilter && (
              <button
                onClick={() => handleStatusChange('')}
                className='cursor-pointer mt-2 text-xs font-medium'
                style={{ color: 'var(--primary)' }}
              >
                Clear filter
              </button>
            )}
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
                    <th className='px-6 py-3'>Rental Order ID</th>
                    <th className='px-6 py-3'>Rental Dates</th>
                    <th className='px-6 py-3'>Amount</th>
                    <th className='px-6 py-3'>Status</th>
                    <th className='px-6 py-3'>Placed</th>
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
                        className='px-6 py-4 text-sm font-mono'
                        style={{ color: 'var(--foreground)' }}
                      >
                        #{order.id.slice(0, 8)}
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
                        {formatCurrency(order.amount)}
                      </td>
                      <td className='px-6 py-4'>
                        <RentalStatusBadge status={order.status} />
                      </td>
                      <td
                        className='px-6 py-4 text-sm'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {formatDate(order.createdAt)}
                      </td>
                      <td className='px-6 py-4'>
                        <Link
                          href={`/customer/rental-orders/${order.id}`}
                          className='text-sm font-medium transition-colors'
                          style={{ color: 'var(--primary)' }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className='flex items-center justify-between border-t px-6 py-4'
                style={{ borderColor: 'var(--border)' }}
              >
                <p
                  className='text-sm'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Page {page} of {totalPages} · {total} order
                  {total === 1 ? '' : 's'}
                </p>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
