'use client';

import { ClipboardList } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { TableToolbar } from '@/components/dashboard/TableToolbar';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { ButtonLink } from '@/components/ui/Button';
import { useClientTable } from '@/lib/hooks';
import { RENTAL_STATUS_META, RENTAL_STATUS_ORDER } from '@/lib/chart-data';
import { formatBDT, formatShortDate } from '@/lib/gear-utils';
import type { RentalOrder } from '@/lib/types';

const PAGE_SIZE = 5;

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...RENTAL_STATUS_ORDER.map((status) => ({
    value: status,
    label: RENTAL_STATUS_META[status].label,
  })),
];

/** Latest incoming rentals on the provider overview, filterable and paged. */
export function RecentOrdersTable({ orders }: { orders: RentalOrder[] }) {
  const table = useClientTable(orders, {
    pageSize: PAGE_SIZE,
    searchAccessor: (order) =>
      `${order.id} ${order.customer?.name ?? ''} ${order.customer?.email ?? ''}`,
    filters: [
      {
        key: 'status',
        label: 'Status',
        options: STATUS_OPTIONS,
        accessor: (order) => order.status,
      },
    ],
    sorters: {
      createdAt: (order) => new Date(order.createdAt).getTime(),
      amount: (order) => Number(order.amount),
    },
    initialSort: { key: 'createdAt', direction: 'desc' },
  });

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
      sortable: true,
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
      id: 'createdAt',
      header: 'Received',
      hideBelow: 'lg',
      sortable: true,
      cell: (order) => (
        <span className='whitespace-nowrap text-muted-foreground'>
          {formatShortDate(order.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        searchValue={table.search}
        onSearchChange={table.setSearch}
        searchLabel='Find an order'
        searchPlaceholder='Search by order ID or customer…'
        selects={[
          {
            key: 'status',
            label: 'Status',
            value: table.filterValues.status ?? '',
            options: STATUS_OPTIONS,
            onChange: (value) => table.setFilter('status', value),
          },
        ]}
        hasActiveFilters={table.hasActiveFilters}
        onClearFilters={table.clearFilters}
      />

      <DataTable
        caption='Most recent rental orders for your gear'
        columns={columns}
        rows={table.rows}
        getRowKey={(order) => order.id}
        emptyIcon={ClipboardList}
        emptyTitle={
          table.hasActiveFilters ? 'No matching orders' : 'No orders yet'
        }
        emptyDescription={
          table.hasActiveFilters
            ? 'Try a different search term or status.'
            : 'List gear in the marketplace and incoming rentals will appear here.'
        }
        emptyAction={
          !table.hasActiveFilters && (
            <ButtonLink href='/provider/gears' size='sm'>
              Manage my gear
            </ButtonLink>
          )
        }
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSort={table.toggleSort}
        footer={
          <Pagination
            page={table.page}
            totalPages={table.totalPages}
            total={table.filteredCount}
            pageSize={PAGE_SIZE}
            onPageChange={table.setPage}
            itemLabel='orders'
          />
        }
      />
    </div>
  );
}
