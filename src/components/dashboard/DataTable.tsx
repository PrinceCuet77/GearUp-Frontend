'use client';

import type { ReactNode } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  type LucideIcon,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/cn';

export interface DataTableColumn<T> {
  /** Stable id; matches the `useClientTable` sorter key when sortable. */
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  align?: 'left' | 'right';
  /** Hide this column below the given breakpoint to keep narrow screens readable. */
  hideBelow?: 'sm' | 'md' | 'lg';
  sortable?: boolean;
  /** Header text is decorative for action columns - announce it instead. */
  srOnlyHeader?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  getRowKey: (row: T) => string;
  /** Describes the table for screen readers. */
  caption: string;
  loading?: boolean;
  loadingRows?: number;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  /** Usually a `<Pagination>`; rendered inside the card, under the rows. */
  footer?: ReactNode;
  sortKey?: string | null;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnId: string) => void;
  className?: string;
}

const HIDE_BELOW: Record<
  NonNullable<DataTableColumn<unknown>['hideBelow']>,
  string
> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
};

/**
 * The dashboard's one table.
 *
 * Owns the surface, header, row rhythm, loading skeleton, empty state and
 * footer slot, so every table in every role looks and behaves identically -
 * callers supply only columns and rows.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  caption,
  loading = false,
  loadingRows = 5,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  footer,
  sortKey = null,
  sortDirection = 'asc',
  onSort,
  className,
}: DataTableProps<T>) {
  if (!loading && rows.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        className={className}
      />
    );
  }

  return (
    <div className={cn('surface-card overflow-hidden', className)}>
      <div className='w-full overflow-x-auto'>
        <table className='w-full border-collapse'>
          <caption className='sr-only'>{caption}</caption>
          <thead>
            <tr className='bg-muted/40'>
              {columns.map((column) => {
                const isSorted = sortKey === column.id;
                const sortable = column.sortable && onSort;

                return (
                  <th
                    key={column.id}
                    scope='col'
                    style={column.width ? { width: column.width } : undefined}
                    aria-sort={
                      isSorted
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : undefined
                    }
                    className={cn(
                      'table-th',
                      column.align === 'right' && 'text-right',
                      column.hideBelow && HIDE_BELOW[column.hideBelow],
                    )}
                  >
                    {sortable ? (
                      <button
                        type='button'
                        onClick={() => onSort(column.id)}
                        className={cn(
                          'inline-flex cursor-pointer items-center gap-1.5 rounded-sm transition-colors hover:text-foreground',
                          isSorted && 'text-foreground',
                        )}
                      >
                        <span className={cn(column.srOnlyHeader && 'sr-only')}>
                          {column.header}
                        </span>
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className='h-3 w-3' aria-hidden='true' />
                          ) : (
                            <ArrowDown className='h-3 w-3' aria-hidden='true' />
                          )
                        ) : (
                          <ChevronsUpDown
                            className='h-3 w-3 opacity-50'
                            aria-hidden='true'
                          />
                        )}
                      </button>
                    ) : (
                      <span className={cn(column.srOnlyHeader && 'sr-only')}>
                        {column.header}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: loadingRows }, (_, rowIndex) => (
                  <tr key={rowIndex} className='table-row'>
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          'table-td',
                          column.hideBelow && HIDE_BELOW[column.hideBelow],
                        )}
                      >
                        <Skeleton className='h-4 w-full max-w-32' />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr key={getRowKey(row)} className='table-row'>
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          'table-td',
                          column.align === 'right' && 'text-right',
                          column.hideBelow && HIDE_BELOW[column.hideBelow],
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {footer}
    </div>
  );
}
