'use client';

import { useId, type ReactNode } from 'react';
import { ChevronDown, Loader2, Search, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ToolbarSelect {
  /** Stable id — also the `<select>` name. */
  key: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

export interface TableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Accessible name for the search box — describe what it matches. */
  searchLabel?: string;
  selects?: ToolbarSelect[];
  /** True when any filter is applied; reveals "Clear all". */
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  /** Spinner next to the controls while results are refetching. */
  isPending?: boolean;
  /** Extra controls pinned to the right, e.g. a "New category" button. */
  action?: ReactNode;
  className?: string;
}

/**
 * Filter row above a table: search, dimension selects, and a reset.
 *
 * Every dashboard table gets one, so filtering lives in the same place with
 * the same controls no matter which table you are looking at.
 */
export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search…',
  searchLabel = 'Search table',
  selects = [],
  hasActiveFilters = false,
  onClearFilters,
  isPending = false,
  action,
  className,
}: TableToolbarProps) {
  const searchId = useId();

  return (
    <div
      className={cn(
        'mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end'>
        {onSearchChange && (
          <div className='sm:w-72'>
            <label htmlFor={searchId} className='field-label'>
              {searchLabel}
            </label>
            <div className='relative'>
              <Search
                className='pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground'
                aria-hidden='true'
              />
              <input
                id={searchId}
                type='search'
                value={searchValue ?? ''}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                className='field-input pr-9 pl-10'
              />
              {searchValue && (
                <button
                  type='button'
                  onClick={() => onSearchChange('')}
                  aria-label='Clear search'
                  className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground'
                >
                  <X className='h-4 w-4' aria-hidden='true' />
                </button>
              )}
            </div>
          </div>
        )}

        {selects.map((select) => (
          <ToolbarSelectField
            key={select.key}
            label={select.label}
            value={select.value}
            options={select.options}
            onChange={select.onChange}
          />
        ))}

        {hasActiveFilters && onClearFilters && (
          <button
            type='button'
            onClick={onClearFilters}
            className='h-11 cursor-pointer rounded-control px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft'
          >
            Clear all
          </button>
        )}

        {isPending && (
          <span className='flex h-11 items-center gap-2 text-xs text-muted-foreground'>
            <Loader2 className='h-3.5 w-3.5 animate-spin' aria-hidden='true' />
            Updating…
          </span>
        )}
      </div>

      {action && <div className='shrink-0'>{action}</div>}
    </div>
  );
}

function ToolbarSelectField({
  label,
  value,
  options,
  onChange,
}: Omit<ToolbarSelect, 'key'>) {
  const id = useId();
  return (
    <div className='sm:w-48'>
      <label htmlFor={id} className='field-label'>
        {label}
      </label>
      <div className='relative'>
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className='field-select h-11'
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className='pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground'
          aria-hidden='true'
        />
      </div>
    </div>
  );
}
