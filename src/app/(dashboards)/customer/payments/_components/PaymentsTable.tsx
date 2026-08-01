'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import Link from 'next/link';
import { CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { PaymentStatusBadge } from '@/components/dashboard/StatusBadge';
import type { Payment } from '@/lib/types';

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
  return `Tk ${Number(amount).toFixed(2)}`;
}

interface PaymentsTableProps {
  payments: Payment[];
  page: number;
  totalPages: number;
  total: number;
  statusFilter: string;
}

export function PaymentsTable({
  payments,
  page,
  totalPages,
  total,
  statusFilter,
}: PaymentsTableProps) {
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
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {payments.length === 0 ? (
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
                    <th className='px-6 py-3'>Transaction ID</th>
                    <th className='px-6 py-3'>Rental Order</th>
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
                      className='transition-colors hover:bg-muted'
                    >
                      <td
                        className='px-6 py-4 font-mono text-xs'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {payment.transactionId}
                      </td>
                      <td className='px-6 py-4 text-sm'>
                        <Link
                          href={`/customer/orders/${payment.rentalOrderId}`}
                          className='font-medium transition-colors'
                          style={{ color: 'var(--primary)' }}
                        >
                          #{payment?.rentalOrder?.id?.slice(0, 8)}
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
