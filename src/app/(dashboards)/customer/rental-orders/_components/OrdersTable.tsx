'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { TableToolbar } from '@/components/dashboard/TableToolbar';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { ButtonLink } from '@/components/ui/Button';
import { useUrlQuery } from '@/lib/hooks';
import { RENTAL_STATUS_META, RENTAL_STATUS_ORDER } from '@/lib/chart-data';
import { formatBDT, formatShortDate } from '@/lib/gear-utils';
import type { RentalOrder } from '@/lib/types';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...RENTAL_STATUS_ORDER.map((status) => ({
    value: status,
    label: RENTAL_STATUS_META[status].label,
  })),
];

interface OrdersTableProps {
  orders: RentalOrder[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

/**
 * The customer's full rental history. Status and page are URL params so the
 * backend does the filtering and the view stays bookmarkable.
 */
export function OrdersTable({
  orders,
  page,
  totalPages,
  total,
  pageSize,
}: OrdersTableProps) {
  const query = useUrlQuery();
  const status = query.get('status');

  const columns: Array<DataTableColumn<RentalOrder>> = [
    {
      id: 'id',
      header: 'Order',
      cell: (order) => (
        <span className='font-mono text-xs text-foreground'>
          #{order.id.slice(0, 8)}
        </span>
      ),
    },
    {
      id: 'dates',
      header: 'Rental period',
      hideBelow: 'md',
      cell: (order) => (
        <span className='whitespace-nowrap text-muted-foreground'>
          {formatShortDate(order.startDate)} – {formatShortDate(order.endDate)}
        </span>
      ),
    },
    {
      id: 'amount',
      header: 'Amount',
      align: 'right',
      cell: (order) => (
        <span className='font-semibold'>{formatBDT(order.amount)}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (order) => <RentalStatusBadge status={order.status} />,
    },
    {
      id: 'placed',
      header: 'Placed',
      hideBelow: 'md',
      cell: (order) => (
        <span className='whitespace-nowrap text-muted-foreground'>
          {formatShortDate(order.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      srOnlyHeader: true,
      cell: (order) => (
        <Link
          href={`/customer/rental-orders/${order.id}`}
          className='text-sm font-semibold text-primary transition-opacity hover:opacity-80'
        >
          View
          <span className='sr-only'> order #{order.id.slice(0, 8)}</span>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        selects={[
          {
            key: 'status',
            label: 'Filter by status',
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
        caption='Your rental orders'
        columns={columns}
        rows={orders}
        getRowKey={(order) => order.id}
        loading={query.isPending && orders.length === 0}
        emptyIcon={ShoppingBag}
        emptyTitle={status ? 'No orders with this status' : 'No rental orders yet'}
        emptyDescription={
          status
            ? 'Try a different status, or clear the filter to see everything.'
            : 'Browse the marketplace and place your first rental to see it here.'
        }
        emptyAction={
          status ? undefined : (
            <ButtonLink href='/gears' size='sm'>
              Browse gear
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
            itemLabel='orders'
            isPending={query.isPending}
          />
        }
      />
    </div>
  );
}
