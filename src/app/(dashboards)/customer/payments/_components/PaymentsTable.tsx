'use client';

import Link from 'next/link';
import { CreditCard } from 'lucide-react';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/dashboard/DataTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { TableToolbar } from '@/components/dashboard/TableToolbar';
import { PaymentStatusBadge } from '@/components/dashboard/StatusBadge';
import { ButtonLink } from '@/components/ui/Button';
import { useUrlQuery } from '@/lib/hooks';
import { formatBDT, formatShortDate } from '@/lib/gear-utils';
import type { Payment } from '@/lib/types';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'COMPLETED', label: 'Successful' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FAILED', label: 'Failed' },
];

interface PaymentsTableProps {
  payments: Payment[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

/** Transaction history, filtered by outcome and paged on the server. */
export function PaymentsTable({
  payments,
  page,
  totalPages,
  total,
  pageSize,
}: PaymentsTableProps) {
  const query = useUrlQuery();
  const status = query.get('status');

  const columns: Array<DataTableColumn<Payment>> = [
    {
      id: 'transaction',
      header: 'Transaction',
      hideBelow: 'md',
      cell: (payment) => (
        <span className='block max-w-48 truncate font-mono text-xs text-muted-foreground'>
          {payment.transactionId}
        </span>
      ),
    },
    {
      id: 'order',
      header: 'Rental order',
      cell: (payment) => {
        if (!payment.rentalOrderId) {
          return <span className='text-muted-foreground'>-</span>;
        }
        return (
          <Link
            href={`/customer/rental-orders/${payment.rentalOrderId}`}
            className='font-mono text-xs font-semibold text-primary transition-opacity hover:opacity-80'
          >
            #{payment.rentalOrderId.slice(0, 8)}
          </Link>
        );
      },
    },
    {
      id: 'amount',
      header: 'Amount',
      align: 'right',
      cell: (payment) => (
        <span className='font-semibold'>{formatBDT(payment.amount)}</span>
      ),
    },
    {
      id: 'status',
      header: 'Outcome',
      cell: (payment) => <PaymentStatusBadge status={payment.status} />,
    },
    {
      id: 'date',
      header: 'Date',
      hideBelow: 'md',
      align: 'right',
      cell: (payment) => (
        <span className='whitespace-nowrap text-muted-foreground'>
          {formatShortDate(payment.paidAt ?? payment.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        selects={[
          {
            key: 'status',
            label: 'Filter by outcome',
            value: status,
            options: STATUS_OPTIONS,
            onChange: (value) => query.set({ status: value }),
          },
        ]}
        hasActiveFilters={Boolean(status)}
        onClearFilters={() => query.clear()}
        isPending={query.isPending}
      />

      <DataTable
        caption='Your payment history'
        columns={columns}
        rows={payments}
        getRowKey={(payment) => payment.id}
        loading={query.isPending && payments.length === 0}
        emptyIcon={CreditCard}
        emptyTitle={
          status ? 'No payments with this outcome' : 'No payments yet'
        }
        emptyDescription={
          status
            ? 'Try a different outcome, or clear the filter to see everything.'
            : 'Payments appear here once you pay for a confirmed rental.'
        }
        emptyAction={
          status ? undefined : (
            <ButtonLink href='/customer/rental-orders' size='sm'>
              View my rentals
            </ButtonLink>
          )
        }
        footer={
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={(next) => query.set({ page: next })}
            itemLabel='payments'
            isPending={query.isPending}
          />
        }
      />
    </div>
  );
}
