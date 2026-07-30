'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TableSkeleton } from '@/components/ui/Skeleton';
import type { RentalOrder } from '@/lib/types';
import { DUMMY_ORDERS } from '@/lib/dummy-data';

const ALL_ORDERS = DUMMY_ORDERS;
const LIMIT = 10;

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'PLACED', label: 'Placed' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PICKED_UP', label: 'Picked Up' },
  { value: 'RETURNED', label: 'Returned' },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    await new Promise((r) => setTimeout(r, 200));
    const filtered = statusFilter
      ? ALL_ORDERS.filter((o) => o.status === statusFilter)
      : ALL_ORDERS;
    const start = (page - 1) * LIMIT;
    setOrders(filtered.slice(start, start + LIMIT));
    setTotalPages(Math.ceil(filtered.length / LIMIT));
    setTotal(filtered.length);

    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return (
    <div>
      <PageHeader
        title='Order Management'
        description={`${total} order${total !== 1 ? 's' : ''} received`}
      />

      <div className='mb-6 flex flex-wrap gap-2'>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFilter(f.value);
              setPage(1);
            }}
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

      <div
        className='rounded-xl border'
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : orders.length === 0 ? (
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
                      className='transition-colors'
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
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
                        {formatDate(order.startDate)} \u2013{' '}
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
                          href={`/provider/orders/${order.id}`}
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
