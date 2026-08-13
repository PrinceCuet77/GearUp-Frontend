'use client';

import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { TableToolbar } from '@/components/dashboard/TableToolbar';
import {
  PaymentStatusBadge,
  RentalStatusBadge,
} from '@/components/dashboard/StatusBadge';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { useDebouncedValue, useUrlQuery } from '@/lib/hooks';
import { formatBDT, formatShortDate } from '@/lib/gear-utils';
import type { AdminRentalsMeta, RentalOrder } from '@/lib/types';
import { RentalStatusTabs } from './RentalStatusTabs';

/** Preset bands, so amount filtering is one control instead of two number inputs. */
const AMOUNT_BANDS = [
  { value: '', label: 'Any amount', min: '', max: '' },
  { value: '0-1000', label: 'Under ৳1,000', min: '', max: '1000' },
  { value: '1000-5000', label: '৳1,000 – ৳5,000', min: '1000', max: '5000' },
  { value: '5000-10000', label: '৳5,000 – ৳10,000', min: '5000', max: '10000' },
  { value: '10000-', label: '৳10,000 and above', min: '10000', max: '' },
];

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'startDate:asc', label: 'Rental start: earliest' },
  { value: 'startDate:desc', label: 'Rental start: latest' },
  { value: 'amount:desc', label: 'Amount: high to low' },
  { value: 'amount:asc', label: 'Amount: low to high' },
];

interface AdminRentalsClientProps {
  orders: RentalOrder[];
  meta: AdminRentalsMeta;
  error: string | null;
}

/**
 * Every rental order on the platform, across every customer. Filters and
 * paging are URL-driven and applied by the backend, so the view stays
 * shareable and never loads more than a page.
 */
export function AdminRentalsClient({
  orders,
  meta,
  error,
}: AdminRentalsClientProps) {
  const query = useUrlQuery();
  const urlSearch = query.get('search');
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== urlSearch) query.set({ search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, urlSearch]);

  const status = query.get('status');
  const startDate = query.get('startDate');
  const endDate = query.get('endDate');

  const activeBand =
    AMOUNT_BANDS.find(
      (band) =>
        band.min === query.get('minAmount') && band.max === query.get('maxAmount'),
    )?.value ?? '';

  const currentSort = `${query.get('sortBy', 'createdAt')}:${query.get('sortOrder', 'desc')}`;

  const hasActiveFilters = Boolean(
    searchInput || status || activeBand || startDate || endDate || query.get('sortBy'),
  );

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
        <div className='min-w-0'>
          <p className='truncate font-medium text-foreground'>
            {order.customer?.name ?? 'Unknown customer'}
          </p>
          <p className='max-w-44 truncate text-xs text-muted-foreground'>
            {order.customer?.email ?? '—'}
          </p>
        </div>
      ),
    },
    {
      id: 'gear',
      header: 'Gear',
      hideBelow: 'md',
      cell: (order) => {
        const firstItem = order.items?.[0];
        const gearName = firstItem?.gearItem?.name ?? 'Unknown gear';
        const providerName =
          firstItem?.gearItem?.provider?.name ??
          firstItem?.gearItem?.provider?.email;
        const extra = (order.items?.length ?? 0) - 1;

        return (
          <div className='min-w-0'>
            <p className='truncate font-medium text-foreground'>
              {gearName}
              {extra > 0 && (
                <span className='ml-1.5 text-xs font-normal text-muted-foreground'>
                  +{extra} more
                </span>
              )}
            </p>
            {providerName && (
              <p className='max-w-44 truncate text-xs text-muted-foreground'>
                {providerName}
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: 'dates',
      header: 'Rental period',
      hideBelow: 'lg',
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
      id: 'payment',
      header: 'Payment',
      hideBelow: 'lg',
      cell: (order) => {
        const payment = order.payments?.[0];
        return payment ? (
          <PaymentStatusBadge status={payment.status} />
        ) : (
          <span className='text-xs text-muted-foreground'>—</span>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: (order) => <RentalStatusBadge status={order.status} />,
    },
  ];

  return (
    <div>
      {error && (
        <ErrorBanner message={error} title='Could not load rental orders' />
      )}

      <RentalStatusTabs
        activeStatus={status}
        totalRentals={meta.totalRentals}
        statusCounts={meta.statusCounts}
        onChange={(value) => query.set({ status: value })}
      />

      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end'>
        <div className='sm:w-44'>
          <label htmlFor='rentals-start-after' className='field-label'>
            Start on/after
          </label>
          <input
            id='rentals-start-after'
            type='date'
            value={startDate}
            onChange={(event) => query.set({ startDate: event.target.value })}
            className='field-input h-11'
          />
        </div>
        <div className='sm:w-44'>
          <label htmlFor='rentals-start-before' className='field-label'>
            Start on/before
          </label>
          <input
            id='rentals-start-before'
            type='date'
            value={endDate}
            onChange={(event) => query.set({ endDate: event.target.value })}
            className='field-input h-11'
          />
        </div>
      </div>

      <TableToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchLabel='Find a customer'
        searchPlaceholder='Search by customer name or email…'
        selects={[
          {
            key: 'amount',
            label: 'Amount',
            value: activeBand,
            options: AMOUNT_BANDS.map(({ value, label }) => ({ value, label })),
            onChange: (value) => {
              const band = AMOUNT_BANDS.find((entry) => entry.value === value);
              query.set({ minAmount: band?.min ?? '', maxAmount: band?.max ?? '' });
            },
          },
          {
            key: 'sort',
            label: 'Sort by',
            value: currentSort,
            options: SORT_OPTIONS,
            onChange: (value) => {
              const [sortBy, sortOrder] = value.split(':');
              query.set({ sortBy, sortOrder });
            },
          },
        ]}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => {
          setSearchInput('');
          query.clear();
        }}
        isPending={query.isPending}
      />

      <DataTable
        caption='All rental orders across every customer'
        columns={columns}
        rows={orders}
        getRowKey={(order) => order.id}
        loading={query.isPending && orders.length === 0}
        emptyIcon={ClipboardList}
        emptyTitle={
          hasActiveFilters ? 'No matching rental orders' : 'No rental orders yet'
        }
        emptyDescription={
          hasActiveFilters
            ? 'No orders match these filters. Try a different search, status, date range or amount.'
            : 'Rental orders placed by customers will appear here.'
        }
        footer={
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            pageSize={meta.limit}
            onPageChange={(page) => query.set({ page })}
            itemLabel='orders'
            isPending={query.isPending}
          />
        }
      />
    </div>
  );
}
