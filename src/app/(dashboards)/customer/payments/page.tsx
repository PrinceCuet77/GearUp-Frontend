'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { PaymentStatusBadge } from '@/components/dashboard/StatusBadge';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TableSkeleton } from '@/components/ui/Skeleton';
import type { Payment } from '@/lib/types';
import { DUMMY_PAYMENTS } from '@/lib/dummy-data';

const MY_PAYMENTS = DUMMY_PAYMENTS;
const LIMIT = 10;

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
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

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPayments = useCallback(async () => {
    setLoading(true);

    // ── DEMO MODE: API call commented out ──────────────────────────────
    // const params = new URLSearchParams({ page: String(page), limit: '10', ... });
    // const res = await fetch(`${API_URL}/api/payments?${params}`, { credentials: 'include' });
    // const json = await res.json();
    // setPayments(json.data ?? []);
    // setTotalPages(json.meta?.totalPages ?? 1);
    // setTotal(json.meta?.total ?? 0);
    await new Promise((r) => setTimeout(r, 200));
    const filtered = statusFilter
      ? MY_PAYMENTS.filter((p) => p.status === statusFilter)
      : MY_PAYMENTS;
    const start = (page - 1) * LIMIT;
    setPayments(filtered.slice(start, start + LIMIT));
    setTotalPages(Math.ceil(filtered.length / LIMIT));
    setTotal(filtered.length);
    // ───────────────────────────────────────────────────────────────────────

    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    void fetchPayments();
  }, [fetchPayments]);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        title='Payment History'
        description={`${total} transaction${total !== 1 ? 's' : ''}`}
      />

      {/* Filter pills */}
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

      <div
        className='rounded-xl border'
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {loading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : payments.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <CreditCard
              className='mb-3 h-10 w-10 opacity-30'
              style={{ color: 'var(--muted-foreground)' }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--muted-foreground)' }}
            >
              No payments found
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
                    <th className='px-6 py-3'>Transaction ID</th>
                    <th className='px-6 py-3'>Order</th>
                    <th className='px-6 py-3'>Amount</th>
                    <th className='px-6 py-3'>Status</th>
                    <th className='px-6 py-3'>Date</th>
                  </tr>
                </thead>
                <tbody
                  className='divide-y'
                  style={{ borderColor: 'var(--border)' }}
                >
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className='transition-colors'
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td
                        className='px-6 py-4 font-mono text-xs'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {payment.transactionId}
                      </td>
                      <td
                        className='px-6 py-4 text-sm'
                        style={{ color: 'var(--foreground)' }}
                      >
                        <Link
                          href={`/customer/orders/${payment.rentalOrderId}`}
                          className='font-medium transition-colors'
                          style={{ color: 'var(--primary)' }}
                        >
                          #{payment.rentalOrderId.slice(0, 8)}
                        </Link>
                      </td>
                      <td
                        className='px-6 py-4 text-sm font-semibold'
                        style={{ color: 'var(--foreground)' }}
                      >
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className='px-6 py-4'>
                        <PaymentStatusBadge status={payment.status} />
                      </td>
                      <td
                        className='px-6 py-4 text-sm'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {formatDate(payment.paidAt ?? payment.createdAt)}
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
                    className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
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
