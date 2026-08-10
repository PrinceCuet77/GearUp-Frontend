'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import { DataTable, type DataTableColumn } from './DataTable';
import { Pagination } from './Pagination';
import { TableToolbar } from './TableToolbar';
import { GearStatusBadge } from './StatusBadge';
import { useClientTable } from '@/lib/hooks';
import { formatBDT, parseGearImages } from '@/lib/gear-utils';
import type { GearItem } from '@/lib/types';

const PAGE_SIZE = 8;

const STATUS_OPTIONS = [
  { value: '', label: 'All listings' },
  { value: 'active', label: 'Active only' },
  { value: 'inactive', label: 'Inactive only' },
];

export interface GearListingsTableProps {
  gears: GearItem[];
  /** Adds the owning provider column — admin views only. */
  showProvider?: boolean;
  caption: string;
  emptyTitle: string;
  emptyDescription?: string;
}

/**
 * Client-side listings table used by the analytics pages, where the rows are
 * already loaded for the charts. Category and availability filters plus paging
 * come from the shared table controls.
 */
export function GearListingsTable({
  gears,
  showProvider = false,
  caption,
  emptyTitle,
  emptyDescription,
}: GearListingsTableProps) {
  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...[...new Set(gears.map((gear) => gear.category?.name ?? 'Uncategorised'))]
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ value: name, label: name })),
  ];

  const table = useClientTable(gears, {
    pageSize: PAGE_SIZE,
    searchAccessor: (gear) =>
      `${gear.name} ${gear.category?.name ?? ''} ${gear.provider?.name ?? ''}`,
    filters: [
      {
        key: 'category',
        label: 'Category',
        options: categoryOptions,
        accessor: (gear) => gear.category?.name ?? 'Uncategorised',
      },
      {
        key: 'availability',
        label: 'Availability',
        options: STATUS_OPTIONS,
        accessor: (gear) => (gear.isActive ? 'active' : 'inactive'),
      },
    ],
    sorters: {
      name: (gear) => gear.name,
      price: (gear) => Number(gear.price),
      stock: (gear) => gear.stock,
    },
    initialSort: { key: 'price', direction: 'desc' },
  });

  const columns: Array<DataTableColumn<GearItem>> = [
    {
      id: 'name',
      header: 'Gear',
      sortable: true,
      cell: (gear) => (
        <div className='flex items-center gap-3'>
          <Image
            src={parseGearImages(gear.images)[0]}
            alt=''
            width={40}
            height={40}
            unoptimized
            className='h-10 w-10 shrink-0 rounded-control object-cover'
          />
          <div className='min-w-0'>
            <p className='truncate font-medium text-foreground'>{gear.name}</p>
            <p className='truncate text-xs text-muted-foreground'>
              {gear.category?.name ?? 'Uncategorised'}
            </p>
          </div>
        </div>
      ),
    },
    ...(showProvider
      ? [
          {
            id: 'provider',
            header: 'Provider',
            hideBelow: 'lg' as const,
            cell: (gear: GearItem) => (
              <span className='block max-w-40 truncate text-muted-foreground'>
                {gear.provider?.name ?? gear.provider?.email ?? 'Unknown'}
              </span>
            ),
          },
        ]
      : []),
    {
      id: 'price',
      header: 'Price / day',
      align: 'right',
      sortable: true,
      cell: (gear) => (
        <span className='font-semibold'>{formatBDT(gear.price)}</span>
      ),
    },
    {
      id: 'stock',
      header: 'Stock',
      align: 'right',
      hideBelow: 'sm',
      sortable: true,
      cell: (gear) => <span>{gear.stock}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (gear) => <GearStatusBadge isActive={gear.isActive} />,
    },
  ];

  return (
    <div>
      <TableToolbar
        searchValue={table.search}
        onSearchChange={table.setSearch}
        searchLabel='Find a listing'
        searchPlaceholder='Search by gear, category or provider…'
        selects={[
          {
            key: 'category',
            label: 'Category',
            value: table.filterValues.category ?? '',
            options: categoryOptions,
            onChange: (value) => table.setFilter('category', value),
          },
          {
            key: 'availability',
            label: 'Availability',
            value: table.filterValues.availability ?? '',
            options: STATUS_OPTIONS,
            onChange: (value) => table.setFilter('availability', value),
          },
        ]}
        hasActiveFilters={table.hasActiveFilters}
        onClearFilters={table.clearFilters}
      />

      <DataTable
        caption={caption}
        columns={columns}
        rows={table.rows}
        getRowKey={(gear) => gear.id}
        emptyIcon={Package}
        emptyTitle={table.hasActiveFilters ? 'No matching listings' : emptyTitle}
        emptyDescription={
          table.hasActiveFilters
            ? 'Try a different search term, category or availability.'
            : emptyDescription
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
            itemLabel='listings'
          />
        }
      />
    </div>
  );
}
