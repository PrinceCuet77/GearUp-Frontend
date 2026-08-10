'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { TableToolbar } from '@/components/dashboard/TableToolbar';
import { RentalStatusBadge } from '@/components/dashboard/StatusBadge';
import { ButtonLink } from '@/components/ui/Button';
import { useClientTable } from '@/lib/hooks';
import { RENTAL_STATUS_META, RENTAL_STATUS_ORDER } from '@/lib/chart-data';
import { formatBDT, formatShortDate } from '@/lib/gear-utils';
import type { RentalOrder, RentalStatus } from '@/lib/types';

const PAGE_SIZE = 5;

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...RENTAL_STATUS_ORDER.map((status) => ({
    value: status,
    label: RENTAL_STATUS_META[status].label,
  })),
];

/**
 * Recent rental activity on the customer overview.
 *
 * Filters and pages entirely on the client: the rows are already loaded for
 * the charts above, so a request per keystroke would buy nothing.
 */
export function RecentRentalsTable({ orders }: { orders: RentalOrder[] }) {
  const table = useClientTable(orders, {
    pageSize: PAGE_SIZE,
    searchAccessor: (order) => `${order.id} ${order.status} ${order.amount}`,
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
      cell: (order) => (
        <RentalStatusBadge status={order.status as RentalStatus} />
      ),
    },
    {
      id: 'createdAt',
      header: 'Placed',
      hideBelow: 'lg',
      sortable: true,
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
        searchValue={table.search}
        onSearchChange={table.setSearch}
        searchLabel='Find an order'
        searchPlaceholder='Search by order ID or amount…'
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
        caption='Your most recent rental orders'
        columns={columns}
        rows={table.rows}
        getRowKey={(order) => order.id}
        emptyIcon={ShoppingBag}
        emptyTitle={
          table.hasActiveFilters ? 'No matching orders' : 'No rental orders yet'
        }
        emptyDescription={
          table.hasActiveFilters
            ? 'Try a different search term or status.'
            : 'Browse the marketplace and place your first rental to see it here.'
        }
        emptyAction={
          !table.hasActiveFilters && (
            <ButtonLink href='/gears' size='sm'>
              Browse gear
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
