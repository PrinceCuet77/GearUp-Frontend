'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Package,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { TableSkeleton } from '@/components/Skeleton';
import { formatBDT, parseGearImages } from '@/lib/gear-utils';
import type { GearItem, Category } from '@/lib/types';
import { getAllGearsForAdmin } from './_actions/getAllGearsForAdmin';
import { getAllCategoriesAction } from '@/app/(public)/_actions/getAllCategories';

const LIMIT = 10;

type SortOption = {
  label: string;
  value: string;
  order: 'asc' | 'desc';
};

const SORT_OPTIONS: SortOption[] = [
  { label: 'Newest First', value: 'createdAt', order: 'desc' },
  { label: 'Oldest First', value: 'createdAt', order: 'asc' },
  { label: 'Price: Low → High', value: 'price', order: 'asc' },
  { label: 'Price: High → Low', value: 'price', order: 'desc' },
  { label: 'Name: A → Z', value: 'name', order: 'asc' },
  { label: 'Name: Z → A', value: 'name', order: 'desc' },
];

export default function AdminGearsPage() {
  const [gears, setGears] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Search
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Filters
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Error
  const [error, setError] = useState<string | null>(null);

  // Draft filter state (edited in panel, applied on "Apply Filters" click)
  const [draftCategory, setDraftCategory] = useState('');
  const [draftMinPrice, setDraftMinPrice] = useState('');
  const [draftMaxPrice, setDraftMaxPrice] = useState('');
  const [draftSortBy, setDraftSortBy] = useState('');
  const [draftSortOrder, setDraftSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch categories once
  useEffect(() => {
    getAllCategoriesAction().then((res) => {
      if (res.success && res.data) {
        setCategories(res.data);
      } else {
        toast.error(res.error ?? 'Failed to load categories.');
      }
    });
  }, []);

  const fetchGears = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllGearsForAdmin({
        page,
        limit: LIMIT,
        search: search || undefined,
        category: category || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortBy ? sortOrder : undefined,
      });
      if (result.success && result.data) {
        setGears(result.data);
        setTotalPages(result.meta?.totalPages ?? 1);
        setTotal(result.meta?.total ?? 0);
      } else {
        const msg = result.error ?? 'Failed to load gear listings.';
        setError(msg);
        setGears([]);
        setTotalPages(1);
        setTotal(0);
      }
    } catch (err) {
      const msg = 'An unexpected error occurred. Please try again.';
      setError(msg);
      setGears([]);
      setTotalPages(1);
      setTotal(0);
    }
    setLoading(false);
  }, [page, search, category, minPrice, maxPrice, sortBy, sortOrder]);

  useEffect(() => {
    void fetchGears();
  }, [fetchGears]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSortOrder('desc');
    setDraftCategory('');
    setDraftMinPrice('');
    setDraftMaxPrice('');
    setDraftSortBy('');
    setDraftSortOrder('desc');
    setPage(1);
  };

  const hasActiveFilters = search || category || minPrice || maxPrice || sortBy;

  const applyFilters = () => {
    setPage(1);
    setSearch(searchInput.trim());
    setCategory(draftCategory);
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    setSortBy(draftSortBy);
    setSortOrder(draftSortOrder);
  };

  const handleSortSelect = (opt: SortOption) => {
    setDraftSortBy(opt.value);
    setDraftSortOrder(opt.order);
  };

  return (
    <div>
      <PageHeader
        title='All Gear Listings'
        description={`${total} item${total !== 1 ? 's' : ''} across all providers`}
      />

      {/* Search + Filter Toggle */}
      <div className='mb-4 flex gap-2'>
        <form onSubmit={handleSearch} className='flex flex-1 gap-2'>
          <div
            className='flex flex-1 items-center gap-2 rounded-lg border px-3'
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
            }}
          >
            <Search
              className='h-4 w-4 shrink-0'
              style={{ color: 'var(--muted-foreground)' }}
            />
            <input
              type='text'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='Search by name, category or provider…'
              className='h-10 flex-1 bg-transparent text-sm outline-none'
              style={{ color: 'var(--foreground)' }}
            />
            {searchInput && (
              <button
                type='button'
                onClick={clearSearch}
                className='cursor-pointer'
              >
                <X
                  className='h-4 w-4'
                  style={{ color: 'var(--muted-foreground)' }}
                />
              </button>
            )}
          </div>
          <button
            type='submit'
            className='cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors'
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            Search
          </button>
        </form>

        <button
          onClick={() => {
            if (!showFilters) {
              // Sync draft with applied when opening panel
              setDraftCategory(category);
              setDraftMinPrice(minPrice);
              setDraftMaxPrice(maxPrice);
              setDraftSortBy(sortBy);
              setDraftSortOrder(sortOrder);
            }
            setShowFilters(!showFilters);
          }}
          className='cursor-pointer flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors'
          style={{
            backgroundColor: showFilters ? 'var(--primary)' : 'var(--card)',
            borderColor: showFilters ? 'var(--primary)' : 'var(--border)',
            color: showFilters
              ? 'var(--primary-foreground)'
              : 'var(--foreground)',
          }}
        >
          <SlidersHorizontal className='h-4 w-4' />
          Filters
          {hasActiveFilters && (
            <span
              className='ml-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold'
              style={{
                backgroundColor: showFilters
                  ? 'var(--primary-foreground)'
                  : 'var(--primary)',
                color: showFilters
                  ? 'var(--primary)'
                  : 'var(--primary-foreground)',
              }}
            >
              {
                [category, minPrice, maxPrice, sortBy, search].filter(Boolean)
                  .length
              }
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div
          className='mb-6 rounded-xl border p-5'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {/* Category */}
            <div>
              <label
                className='mb-1.5 block text-xs font-semibold uppercase tracking-wide'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Category
              </label>
              <div className='relative'>
                <select
                  value={draftCategory}
                  onChange={(e) => {
                    setDraftCategory(e.target.value);
                  }}
                  className='w-full appearance-none rounded-lg border px-3 py-2 pr-8 text-sm outline-none cursor-pointer'
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: draftCategory
                      ? 'var(--foreground)'
                      : 'var(--muted-foreground)',
                  }}
                >
                  <option value=''>All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className='pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2'
                  style={{ color: 'var(--muted-foreground)' }}
                />
              </div>
            </div>

            {/* Min Price */}
            <div>
              <label
                className='mb-1.5 block text-xs font-semibold uppercase tracking-wide'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Min Price (৳)
              </label>
              <input
                type='number'
                value={draftMinPrice}
                onChange={(e) => setDraftMinPrice(e.target.value)}
                placeholder='0'
                min='0'
                className='w-full rounded-lg border px-3 py-2 text-sm outline-none'
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            {/* Max Price */}
            <div>
              <label
                className='mb-1.5 block text-xs font-semibold uppercase tracking-wide'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Max Price (৳)
              </label>
              <input
                type='number'
                value={draftMaxPrice}
                onChange={(e) => setDraftMaxPrice(e.target.value)}
                placeholder='No limit'
                min='0'
                className='w-full rounded-lg border px-3 py-2 text-sm outline-none'
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            {/* Sort */}
            <div>
              <label
                className='mb-1.5 block text-xs font-semibold uppercase tracking-wide'
                style={{ color: 'var(--muted-foreground)' }}
              >
                Sort By
              </label>
              <div className='relative'>
                <select
                  value={draftSortBy ? `${draftSortBy}-${draftSortOrder}` : ''}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setDraftSortBy('');
                      setDraftSortOrder('desc');
                    } else {
                      const [field, order] = e.target.value.split('-');
                      setDraftSortBy(field);
                      setDraftSortOrder(order as 'asc' | 'desc');
                    }
                  }}
                  className='w-full appearance-none rounded-lg border px-3 py-2 pr-8 text-sm outline-none cursor-pointer'
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: draftSortBy
                      ? 'var(--foreground)'
                      : 'var(--muted-foreground)',
                  }}
                >
                  <option value=''>Default</option>
                  {SORT_OPTIONS.map((opt) => (
                    <option
                      key={`${opt.value}-${opt.order}`}
                      value={`${opt.value}-${opt.order}`}
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ArrowUpDown
                  className='pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2'
                  style={{ color: 'var(--muted-foreground)' }}
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className='mt-4 flex items-center gap-3'>
            <button
              onClick={applyFilters}
              className='cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors'
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              }}
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className='cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors'
                style={{
                  backgroundColor: 'var(--muted)',
                  color: 'var(--muted-foreground)',
                }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && !showFilters && (
        <div className='mb-4 flex flex-wrap items-center gap-2'>
          <span
            className='text-xs font-medium'
            style={{ color: 'var(--muted-foreground)' }}
          >
            Active:
          </span>
          {search && (
            <Chip
              label={`Search: "${search}"`}
              onRemove={() => {
                setSearch('');
                setSearchInput('');
                setPage(1);
              }}
            />
          )}
          {category && (
            <Chip
              label={`Category: ${categories.find((c) => c.id === category)?.name ?? category}`}
              onRemove={() => {
                setCategory('');
                setPage(1);
              }}
            />
          )}
          {minPrice && (
            <Chip
              label={`Min: ${formatBDT(minPrice)}`}
              onRemove={() => {
                setMinPrice('');
                setPage(1);
              }}
            />
          )}
          {maxPrice && (
            <Chip
              label={`Max: ${formatBDT(maxPrice)}`}
              onRemove={() => {
                setMaxPrice('');
                setPage(1);
              }}
            />
          )}
          {sortBy && (
            <Chip
              label={`Sort: ${SORT_OPTIONS.find((o) => o.value === sortBy && o.order === sortOrder)?.label ?? `${sortBy} ${sortOrder}`}`}
              onRemove={() => {
                setSortBy('');
                setSortOrder('desc');
                setPage(1);
              }}
            />
          )}
        </div>
      )}

      {error && (
        <ErrorBanner
          message={error}
          title='Could not load gear listings'
          showToast={true}
        />
      )}

      <div
        className='rounded-xl border'
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {loading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : gears.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <Package
              className='mb-3 h-10 w-10 opacity-30'
              style={{ color: 'var(--muted-foreground)' }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--muted-foreground)' }}
            >
              No gear listings found
            </p>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr
                    className='border-b text-left text-xs font-semibold uppercase tracking-wide'
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    <th className='px-6 py-3'>Image</th>
                    <th className='px-6 py-3'>Gear</th>
                    <th className='px-6 py-3'>Provider</th>
                    <th className='px-6 py-3'>Category</th>
                    <th className='px-6 py-3'>Price/Day</th>
                    <th className='px-6 py-3'>Stock</th>
                    <th className='px-6 py-3'>Status</th>
                  </tr>
                </thead>
                <tbody
                  className='divide-y'
                  style={{ borderColor: 'var(--border)' }}
                >
                  {gears.map((gear) => {
                    const gearImages = parseGearImages(gear.images);
                    return (
                      <tr
                        key={gear.id}
                        className='transition-colors'
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            'var(--muted)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td className='px-6 py-4'>
                          <img
                            src={gearImages[0]}
                            alt={gear.name}
                            className='h-12 w-12 rounded-lg object-cover'
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <p
                            className='text-sm font-medium'
                            style={{ color: 'var(--foreground)' }}
                          >
                            {gear.name}
                          </p>
                          <p
                            className='mt-0.5 max-w-50 truncate text-xs'
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            {gear.description}
                          </p>
                        </td>
                        <td
                          className='px-6 py-4 text-sm'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {gear.provider?.name ?? gear.provider?.email ?? '—'}
                        </td>
                        <td
                          className='px-6 py-4 text-sm'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {gear.category?.name ?? '—'}
                        </td>
                        <td
                          className='px-6 py-4 text-sm font-semibold'
                          style={{ color: 'var(--foreground)' }}
                        >
                          {formatBDT(gear.price)}
                        </td>
                        <td
                          className='px-6 py-4 text-sm'
                          style={{ color: 'var(--foreground)' }}
                        >
                          {gear.stock}
                        </td>
                        <td className='px-6 py-4'>
                          <span
                            className='inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold'
                            style={
                              gear.isActive
                                ? {
                                    backgroundColor: 'rgba(34,197,94,0.12)',
                                    color: '#16a34a',
                                  }
                                : {
                                    backgroundColor: 'var(--muted)',
                                    color: 'var(--muted-foreground)',
                                  }
                            }
                          >
                            {gear.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div
                className='flex items-center justify-between border-t px-6 py-4'
                style={{ borderColor: 'var(--border)' }}
              >
                <p
                  className='text-sm'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Page {page} of {totalPages}
                </p>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── tiny helper component ─── */
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className='inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium'
      style={{
        backgroundColor: 'var(--muted)',
        color: 'var(--foreground)',
      }}
    >
      {label}
      <button
        onClick={onRemove}
        className='cursor-pointer rounded-full p-0.5 transition-colors hover:bg-black/10'
      >
        <X className='h-3 w-3' />
      </button>
    </span>
  );
}
