'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { TableToolbar } from '@/components/dashboard/TableToolbar';
import { GearStatusBadge } from '@/components/dashboard/StatusBadge';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { useDebouncedValue, useUrlQuery } from '@/lib/hooks';
import { formatBDT, formatShortDate, parseGearImages } from '@/lib/gear-utils';
import type { ApiMeta, Category, GearItem } from '@/lib/types';

/** Preset bands, so price filtering is one control instead of two number inputs. */
const PRICE_BANDS = [
  { value: '', label: 'Any price', min: '', max: '' },
  { value: '0-500', label: 'Under ৳500', min: '', max: '500' },
  { value: '500-1500', label: '৳500 – ৳1,500', min: '500', max: '1500' },
  { value: '1500-3000', label: '৳1,500 – ৳3,000', min: '1500', max: '3000' },
  { value: '3000-', label: '৳3,000 and above', min: '3000', max: '' },
];

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'price:asc', label: 'Price: low to high' },
  { value: 'price:desc', label: 'Price: high to low' },
  { value: 'name:asc', label: 'Name: A to Z' },
  { value: 'name:desc', label: 'Name: Z to A' },
];

interface AdminGearsClientProps {
  gears: GearItem[];
  categories: Category[];
  meta: ApiMeta;
  error: string | null;
}

/**
 * Every listing on the platform. Filters and paging are URL-driven and applied
 * by the backend, so the view stays shareable and never loads more than a page.
 */
export function AdminGearsClient({
  gears,
  categories,
  meta,
  error,
}: AdminGearsClientProps) {
  const query = useUrlQuery();
  const urlSearch = query.get('search');
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== urlSearch) query.set({ search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, urlSearch]);

  const activeBand =
    PRICE_BANDS.find(
      (band) =>
        band.min === query.get('minPrice') && band.max === query.get('maxPrice'),
    )?.value ?? '';

  const currentSort = `${query.get('sortBy', 'createdAt')}:${query.get('sortOrder', 'desc')}`;

  const hasActiveFilters = Boolean(
    searchInput || query.get('category') || activeBand || query.get('sortBy'),
  );

  const columns: Array<DataTableColumn<GearItem>> = [
    {
      id: 'gear',
      header: 'Gear',
      cell: (gear) => (
        <div className='flex items-center gap-3'>
          <Image
            src={parseGearImages(gear.images)[0]}
            alt=''
            width={44}
            height={44}
            unoptimized
            className='h-11 w-11 shrink-0 rounded-control object-cover'
          />
          <div className='min-w-0'>
            <p className='truncate font-medium text-foreground'>{gear.name}</p>
            <p className='max-w-56 truncate text-xs text-muted-foreground'>
              {gear.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'provider',
      header: 'Provider',
      hideBelow: 'lg',
      cell: (gear) => (
        <span className='block max-w-40 truncate text-muted-foreground'>
          {gear.provider?.name ?? gear.provider?.email ?? 'Unknown'}
        </span>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      hideBelow: 'md',
      cell: (gear) => (
        <span className='text-muted-foreground'>
          {gear.category?.name ?? 'Uncategorised'}
        </span>
      ),
    },
    {
      id: 'price',
      header: 'Price / day',
      align: 'right',
      cell: (gear) => (
        <span className='font-semibold'>{formatBDT(gear.price)}</span>
      ),
    },
    {
      id: 'stock',
      header: 'Stock',
      align: 'right',
      hideBelow: 'sm',
      cell: (gear) => <span>{gear.stock}</span>,
    },
    {
      id: 'listed',
      header: 'Listed',
      hideBelow: 'lg',
      cell: (gear) => (
        <span className='whitespace-nowrap text-muted-foreground'>
          {formatShortDate(gear.createdAt)}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (gear) => <GearStatusBadge isActive={gear.isActive} />,
    },
  ];

  return (
    <div>
      {error && (
        <ErrorBanner message={error} title='Could not load gear listings' />
      )}

      <TableToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchLabel='Find a listing'
        searchPlaceholder='Search by gear, category or provider…'
        selects={[
          {
            key: 'category',
            label: 'Category',
            value: query.get('category'),
            options: [
              { value: '', label: 'All categories' },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ],
            onChange: (value) => query.set({ category: value }),
          },
          {
            key: 'price',
            label: 'Price range',
            value: activeBand,
            options: PRICE_BANDS.map(({ value, label }) => ({ value, label })),
            onChange: (value) => {
              const band = PRICE_BANDS.find((entry) => entry.value === value);
              query.set({ minPrice: band?.min ?? '', maxPrice: band?.max ?? '' });
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
        caption='All gear listings across every provider'
        columns={columns}
        rows={gears}
        getRowKey={(gear) => gear.id}
        loading={query.isPending && gears.length === 0}
        emptyIcon={Package}
        emptyTitle={
          hasActiveFilters ? 'No matching listings' : 'No gear listed yet'
        }
        emptyDescription={
          hasActiveFilters
            ? 'No listings match these filters. Try a different search, category or price range.'
            : 'Listings created by providers will appear here.'
        }
        footer={
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            pageSize={meta.limit}
            onPageChange={(page) => query.set({ page })}
            itemLabel='listings'
            isPending={query.isPending}
          />
        }
      />
    </div>
  );
}
