'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Package, PlusCircle } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { TableToolbar } from '@/components/dashboard/TableToolbar';
import { GearStatusBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/Button';
import { useDebouncedValue, useUrlQuery } from '@/lib/hooks';
import { formatBDT, parseGearImages } from '@/lib/gear-utils';
import type { ApiMeta, Category, GearItem } from '@/lib/types';
import { GearActions } from './GearActions';
import { useGearAdd, useGearEdit } from './ProviderGearsShell';

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'price:asc', label: 'Price: low to high' },
  { value: 'price:desc', label: 'Price: high to low' },
  { value: 'name:asc', label: 'Name: A to Z' },
  { value: 'name:desc', label: 'Name: Z to A' },
];

interface ProviderGearsTableProps {
  gears: GearItem[];
  categories: Category[];
  meta: ApiMeta;
}

/** The provider's inventory, filtered and paged through the URL. */
export function ProviderGearsTable({
  gears,
  categories,
  meta,
}: ProviderGearsTableProps) {
  const onEdit = useGearEdit();
  const onAdd = useGearAdd();
  const query = useUrlQuery();

  const urlSearch = query.get('search');
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== urlSearch) query.set({ search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, urlSearch]);

  const currentSort = `${query.get('sortBy', 'createdAt')}:${query.get('sortOrder', 'desc')}`;
  const hasActiveFilters = Boolean(
    searchInput || query.get('category') || query.get('sortBy'),
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
      id: 'status',
      header: 'Status',
      hideBelow: 'sm',
      cell: (gear) => <GearStatusBadge isActive={gear.isActive} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      srOnlyHeader: true,
      cell: (gear) => (
        <GearActions
          gearId={gear.id}
          gearName={gear.name}
          gear={gear}
          onEdit={() => onEdit?.(gear)}
        />
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchLabel='Find a listing'
        searchPlaceholder='Search your gear by name…'
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
        caption='Gear you have listed on GearUp'
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
            ? 'Try a different search term or category.'
            : 'Add your first listing to start receiving rental orders.'
        }
        emptyAction={
          !hasActiveFilters && (
            <Button
              size='sm'
              onClick={() => onAdd?.()}
              leadingIcon={
                <PlusCircle className='h-3.5 w-3.5' aria-hidden='true' />
              }
            >
              Add your first gear
            </Button>
          )
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
