'use client';

import { ClipboardList } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { TableToolbar } from '@/components/dashboard/TableToolbar';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { ButtonLink } from '@/components/ui/Button';
import { useUrlQuery } from '@/lib/hooks';
import { RENTAL_STATUS_META, RENTAL_STATUS_ORDER } from '@/lib/chart-data';
import { formatBDT, formatShortDate } from '@/lib/gear-utils';
import type { RentalOrder } from '@/lib/types';
import { ManageOrderButton } from './ManageOrderButton';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...RENTAL_STATUS_ORDER.map((status) => ({
    value: status,
    label: RENTAL_STATUS_META[status].label,
  })),
];

interface ProviderOrdersTableProps {
  orders: RentalOrder[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

/** Incoming rentals for the provider's gear, filtered and paged on the server. */
export function ProviderOrdersTable({
  orders,
  page,
  totalPages,
  total,
  pageSize,
}: ProviderOrdersTableProps) {
  const query = useUrlQuery();
  const status = query.get('status');

  const columns: Array<DataTableColumn<RentalOrder>> = [
    {
      id: 'id',
      header: 'Order',
      hideBelow: 'sm',
      cell: (order) => (
        <span className='font-mono text-xs text-foreground'>
          #{order.id.slice(0, 8)}
        </span>
      ),
    },
    {
      id: 'customer',
      header: 'Customer',
      cell: (order) => (
        <span className='block max-w-44 truncate'>
          {order.customer?.name ?? order.customer?.email ?? 'Unknown customer'}
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
      id: 'actions',
      header: 'Actions',
      align: 'right',
      srOnlyHeader: true,
      cell: (order) => <ManageOrderButton order={order} />,
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
        caption='Rental orders received for your gear'
        columns={columns}
        rows={orders}
        getRowKey={(order) => order.id}
        loading={query.isPending && orders.length === 0}
        emptyIcon={ClipboardList}
        emptyTitle={status ? 'No orders with this status' : 'No orders yet'}
        emptyDescription={
          status
            ? 'Try a different status, or clear the filter to see everything.'
            : 'List gear in the marketplace and incoming rentals will appear here.'
        }
        emptyAction={
          status ? undefined : (
            <ButtonLink href='/provider/gears' size='sm'>
              Manage my gear
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
