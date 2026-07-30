'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TableSkeleton } from '@/components/ui/Skeleton';
import type { RentalOrder } from '@/lib/types';
import { DUMMY_ORDERS, DUMMY_CUSTOMER } from '@/lib/dummy-data';

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
  });
}

function formatCurrency(amount: string | number) {
  return `$${Number(amount).toFixed(2)}`;
}

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ?? 'https://gear-up-self.vercel.app';

const LIMIT = 5;
const MY_ORDERS = DUMMY_ORDERS.filter(
  (o) => o.customerId === DUMMY_CUSTOMER.id,
);

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    // ── DEMO MODE: API call commented out ──────────────────────────────────
    // const params = new URLSearchParams({ page: String(page), limit: '10', ... });
    // const res = await fetch(`${API_URL}/api/rentals?${params}`, { credentials: 'include' });
    // const json = await res.json();
    await new Promise((r) => setTimeout(r, 200));
    const filtered = statusFilter
      ? MY_ORDERS.filter((o) => o.status === statusFilter)
      : MY_ORDERS;
    const start = (page - 1) * LIMIT;
    setOrders(filtered.slice(start, start + LIMIT));
    setTotalPages(Math.ceil(filtered.length / LIMIT));
    setTotal(filtered.length);
    // ───────────────────────────────────────────────────────────────────────

    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        title='My Orders'
        description={`${total} total rental order${total !== 1 ? 's' : ''}`}
      />

      {/* Status filter pills */}
      <div className='mb-6 flex flex-wrap gap-2'>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleStatusChange(f.value)}
            className='rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all'
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
        {loading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : orders.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <ShoppingBag
              className='mb-3 h-10 w-10 opacity-30'
              style={{ color: 'var(--muted-foreground)' }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--muted-foreground)' }}
            >
              No orders found
            </p>
            {statusFilter && (
              <button
                onClick={() => handleStatusChange('')}
                className='mt-2 text-xs font-medium'
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
                    <th className='px-6 py-3'>Order ID</th>
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
                      className='transition-colors'
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
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
                          href={`/customer/orders/${order.id}`}
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
                  Page {page} of {totalPages}
                </p>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className='flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className='flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
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
