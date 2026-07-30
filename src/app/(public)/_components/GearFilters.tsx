'use client';

import { Search, X } from 'lucide-react';
import type { Category } from '@/lib/types';
import { type SortBy, type SortOrder, SORT_OPTIONS } from '@/lib/gear-utils';
import { formatBDT } from '@/lib/gear-utils';

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

const inputBase =
  'h-9 w-full rounded-lg border px-3 text-sm outline-none focus:ring-1 transition-colors';

function getInputStyle() {
  return {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    color: 'var(--foreground)',
  };
}

/**
 * Reusable filter panel — rendered in the desktop sidebar and
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
  const inputStyle = getInputStyle();
  const currentSortValue = `${sortBy}:${sortOrder}`;

  return (
    <div className='space-y-6'>
      {/* Search */}
      <div>
        <label
          className='mb-2 block text-xs font-semibold uppercase tracking-wide'
          style={{ color: 'var(--muted-foreground)' }}
        >
          Search
        </label>
        <div className='relative'>
          <Search
            className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2'
            style={{ color: 'var(--muted-foreground)' }}
          />
          <input
            type='text'
            placeholder='Search gear…'
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className={`${inputBase} pl-9 pr-8`}
            style={inputStyle}
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className='absolute right-2.5 top-1/2 -translate-y-1/2'
              style={{ color: 'var(--muted-foreground)' }}
              aria-label='Clear search'
            >
              <X className='h-3.5 w-3.5' />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label
          className='mb-2 block text-xs font-semibold uppercase tracking-wide'
          style={{ color: 'var(--muted-foreground)' }}
        >
          Category
        </label>
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => onCategory('')}
            className='rounded-full px-3 py-1 text-xs font-semibold transition-colors'
            style={
              category === ''
                ? { backgroundColor: 'var(--primary)', color: '#fff' }
                : {
                    backgroundColor: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                  }
            }
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategory(cat.name)}
              className='rounded-full px-3 py-1 text-xs font-semibold transition-colors'
              style={
                category === cat.name
                  ? { backgroundColor: 'var(--primary)', color: '#fff' }
                  : {
                      backgroundColor: 'var(--muted)',
                      color: 'var(--muted-foreground)',
                    }
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label
          className='mb-2 block text-xs font-semibold uppercase tracking-wide'
          style={{ color: 'var(--muted-foreground)' }}
        >
          Price per Day (৳)
        </label>
        <div className='flex items-center gap-2'>
          <input
            type='number'
            placeholder='Min'
            value={minPrice}
            min='0'
            onChange={(e) => onMinPrice(e.target.value)}
            className={inputBase}
            style={inputStyle}
          />
          <span style={{ color: 'var(--muted-foreground)', flexShrink: 0 }}>
            –
          </span>
          <input
            type='number'
            placeholder='Max'
            value={maxPrice}
            min='0'
            onChange={(e) => onMaxPrice(e.target.value)}
            className={inputBase}
            style={inputStyle}
          />
        </div>
        {(minPrice || maxPrice) && (
          <p
            className='mt-1.5 text-xs'
            style={{ color: 'var(--muted-foreground)' }}
          >
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
        <label
          className='mb-2 block text-xs font-semibold uppercase tracking-wide'
          style={{ color: 'var(--muted-foreground)' }}
        >
          Sort By
        </label>
        <select
          value={currentSortValue}
          onChange={(e) => {
            const [by, order] = e.target.value.split(':') as [
              SortBy,
              SortOrder,
            ];
            onSort(by, order);
          }}
          className='h-9 w-full cursor-pointer rounded-lg border px-3 text-sm outline-none transition-colors appearance-none'
          style={{
            backgroundColor: 'var(--input-bg)',
            borderColor: 'var(--input-border)',
            color: 'var(--foreground)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
            paddingRight: '28px',
          }}
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
        <button
          onClick={onReset}
          className='flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors'
          style={{
            color: 'var(--muted-foreground)',
            backgroundColor: 'var(--muted)',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = 'var(--foreground)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'var(--muted-foreground)')
          }
        >
          <X className='h-3.5 w-3.5' />
          Clear all filters
        </button>
      )}
    </div>
  );
}
