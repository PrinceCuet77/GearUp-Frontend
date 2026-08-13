'use client';

import { useId } from 'react';
import { Search, X } from 'lucide-react';
import type { Category } from '@/lib/types';
import { type SortBy, type SortOrder, SORT_OPTIONS } from '@/lib/gear-utils';
import { formatBDT } from '@/lib/gear-utils';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';

export interface GearFiltersProps {
  /** All available categories for the filter chips. */
  categories: Category[];
  search: string;
  /** Active category name (matches the `category` query param). */
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  hasFilters: boolean;
  onSearch: (value: string) => void;
  onCategory: (name: string) => void;
  onMinPrice: (value: string) => void;
  onMaxPrice: (value: string) => void;
  onSort: (sortBy: SortBy, sortOrder: SortOrder) => void;
  onReset: () => void;
}

const GROUP_LABEL =
  'mb-2 block text-xs font-bold tracking-wide text-muted-foreground uppercase';

/**
 * Reusable filter panel - rendered in the desktop sidebar and
 * the mobile bottom-sheet drawer.
 */
export default function GearFilters({
  categories,
  search,
  category,
  minPrice,
  maxPrice,
  sortBy,
  sortOrder,
  hasFilters,
  onSearch,
  onCategory,
  onMinPrice,
  onMaxPrice,
  onSort,
  onReset,
}: GearFiltersProps) {
  const searchId = useId();
  const minId = useId();
  const maxId = useId();
  const sortId = useId();
  const categoryGroupId = useId();

  const currentSortValue = `${sortBy}:${sortOrder}`;

  const chipClass = (active: boolean) =>
    cn(
      'cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors',
      active
        ? 'bg-primary text-primary-foreground'
        : 'bg-muted text-muted-foreground hover:text-foreground',
    );

  return (
    <div className='space-y-6'>
      {/* Search */}
      <div>
        <label htmlFor={searchId} className={GROUP_LABEL}>
          Search
        </label>
        <div className='relative'>
          <Search
            className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground'
            aria-hidden='true'
          />
          <input
            id={searchId}
            type='search'
            placeholder='Search gear…'
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className='field-input h-10 py-0 pr-9 pl-9'
          />
          {search && (
            <button
              type='button'
              onClick={() => onSearch('')}
              className='absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground'
              aria-label='Clear search'
            >
              <X className='h-3.5 w-3.5' />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <span id={categoryGroupId} className={GROUP_LABEL}>
          Category
        </span>
        <div
          className='flex flex-wrap gap-2'
          role='group'
          aria-labelledby={categoryGroupId}
        >
          <button
            type='button'
            onClick={() => onCategory('')}
            aria-pressed={category === ''}
            className={chipClass(category === '')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type='button'
              onClick={() => onCategory(cat.name)}
              aria-pressed={category === cat.name}
              className={chipClass(category === cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <span className={GROUP_LABEL}>Price per day (৳)</span>
        <div className='flex items-center gap-2'>
          <div className='flex-1'>
            <label htmlFor={minId} className='sr-only'>
              Minimum price per day in Taka
            </label>
            <input
              id={minId}
              type='number'
              inputMode='numeric'
              placeholder='Min'
              value={minPrice}
              min='0'
              onChange={(e) => onMinPrice(e.target.value)}
              className='field-input h-10 py-0'
            />
          </div>
          <span className='shrink-0 text-muted-foreground' aria-hidden='true'>
            –
          </span>
          <div className='flex-1'>
            <label htmlFor={maxId} className='sr-only'>
              Maximum price per day in Taka
            </label>
            <input
              id={maxId}
              type='number'
              inputMode='numeric'
              placeholder='Max'
              value={maxPrice}
              min='0'
              onChange={(e) => onMaxPrice(e.target.value)}
              className='field-input h-10 py-0'
            />
          </div>
        </div>
        {(minPrice || maxPrice) && (
          <p className='field-hint'>
            {minPrice && maxPrice
              ? `${formatBDT(minPrice)} – ${formatBDT(maxPrice)}`
              : minPrice
                ? `From ${formatBDT(minPrice)}`
                : `Up to ${formatBDT(maxPrice)}`}
          </p>
        )}
      </div>

      {/* Sort */}
      <div>
        <label htmlFor={sortId} className={GROUP_LABEL}>
          Sort by
        </label>
        <select
          id={sortId}
          value={currentSortValue}
          onChange={(e) => {
            const [by, order] = e.target.value.split(':') as [
              SortBy,
              SortOrder,
            ];
            onSort(by, order);
          }}
          className='field-input h-10 cursor-pointer py-0'
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <Button
          variant='ghost'
          size='sm'
          fullWidth
          onClick={onReset}
          leadingIcon={<X className='h-3.5 w-3.5' />}
          className='bg-muted'
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
}
