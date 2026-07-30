'use client';

/**
 * GearBrowseContent
 *
 * Client component for the /gear browse page.
 * All filter + sort state lives in the URL (useSearchParams + router.push),
 * so links are shareable and the browser back button works naturally.
 */

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import {
  SlidersHorizontal,
  Filter,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from 'lucide-react';
import type { GearItem, Category } from '@/lib/api';
import { type SortBy, type SortOrder, SORT_OPTIONS } from '@/lib/gear-utils';
import { getAllGearsAction } from '../_actions/getAllGears';
import { getAllCategoriesAction } from '../_actions/getAllCategories';
import GearFilters from '../_components/GearFilters';
import GearCard from '../_components/GearCard';
import { toast } from 'sonner';

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (n: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Show at most 5 page buttons centred around current page
  const range: number[] = [];
  const delta = 2;
  for (
    let i = Math.max(1, page - delta);
    i <= Math.min(totalPages, page + delta);
    i++
  ) {
    range.push(i);
  }

  const btnBase =
    'flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors';

  return (
    <nav
      className='mt-10 flex items-center justify-center gap-1.5'
      aria-label='Pagination'
    >
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className={`${btnBase} disabled:opacity-40`}
        style={{
          borderColor: 'var(--border)',
          color: 'var(--foreground)',
          backgroundColor: 'var(--card)',
        }}
        aria-label='Previous page'
      >
        <ChevronLeft className='h-4 w-4' />
      </button>

      {range[0] > 1 && (
        <>
          <button
            onClick={() => onPage(1)}
            className={btnBase}
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'var(--card)',
            }}
          >
            1
          </button>
          {range[0] > 2 && (
            <span
              className='flex h-9 w-6 items-center justify-center text-sm'
              style={{ color: 'var(--muted-foreground)' }}
            >
              …
            </span>
          )}
        </>
      )}

      {range.map((n) => (
        <button
          key={n}
          onClick={() => onPage(n)}
          className={btnBase}
          style={
            n === page
              ? {
                  backgroundColor: 'var(--primary)',
                  borderColor: 'var(--primary)',
                  color: '#fff',
                }
              : {
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--card)',
                }
          }
          aria-current={n === page ? 'page' : undefined}
        >
          {n}
        </button>
      ))}

      {range[range.length - 1] < totalPages && (
        <>
          {range[range.length - 1] < totalPages - 1 && (
            <span
              className='flex h-9 w-6 items-center justify-center text-sm'
              style={{ color: 'var(--muted-foreground)' }}
            >
              …
            </span>
          )}
          <button
            onClick={() => onPage(totalPages)}
            className={btnBase}
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'var(--card)',
            }}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} disabled:opacity-40`}
        style={{
          borderColor: 'var(--border)',
          color: 'var(--foreground)',
          backgroundColor: 'var(--card)',
        }}
        aria-label='Next page'
      >
        <ChevronRight className='h-4 w-4' />
      </button>
    </nav>
  );
}

function EmptyState({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean;
  onReset: () => void;
}) {
  return (
    <div
      className='flex flex-col items-center justify-center rounded-2xl border py-20 text-center'
      style={{ borderColor: 'var(--border)' }}
    >
      <Package
        className='mb-3 h-12 w-12 opacity-25'
        style={{ color: 'var(--muted-foreground)' }}
      />
      <p
        className='text-base font-semibold'
        style={{ color: 'var(--foreground)' }}
      >
        No gear found
      </p>
      <p className='mt-1 text-sm' style={{ color: 'var(--muted-foreground)' }}>
        {hasFilters
          ? 'Try adjusting your filters or search query.'
          : 'No gear is currently available.'}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className='mt-5 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors'
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default function GearBrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gears, setGears] = useState<GearItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const sortBy = (searchParams.get('sortBy') ?? 'createdAt') as SortBy;
  const sortOrder = (searchParams.get('sortOrder') ?? 'desc') as SortOrder;
  const page = Math.max(Number(searchParams.get('page') ?? '1'), 1);

  useEffect(() => {
    const fetchGears = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAllGearsAction({
          category: category || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          search: search || undefined,
          page,
          limit: 9,
          sortBy,
          sortOrder,
        });

        if (result?.success) {
          setGears(result.data || []);
          setTotalPages(result.meta?.totalPages || 1);
          setTotal(result.meta?.total || 0);
        } else {
          setGears([]);
        }
      } catch {
        setError('An error occurred');
        toast.error('Failed to fetch gears');
        setGears([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGears();
  }, [category, minPrice, maxPrice, search, page, sortBy, sortOrder]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getAllCategoriesAction();
        if (result?.success) {
          setCategories(result.data || []);
        }
      } catch {
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const updateParams = useCallback(
    (updates: Record<string, string>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) {
          params.set(k, v);
        } else {
          params.delete(k);
        }
      });
      if (resetPage) params.delete('page');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const setPage = useCallback(
    (n: number) => {
      updateParams({ page: n === 1 ? '' : String(n) }, false);
    },
    [updateParams],
  );

  const hasFilters = Boolean(search || category || minPrice || maxPrice);
  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.sortBy === sortBy && o.sortOrder === sortOrder)
      ?.label ?? 'Newest First';

  const activeChips: Array<{ label: string; clear: () => void }> = [];
  if (search)
    activeChips.push({
      label: `"${search}"`,
      clear: () => updateParams({ search: '' }),
    });
  if (category)
    activeChips.push({
      label: category,
      clear: () => updateParams({ category: '' }),
    });
  if (minPrice)
    activeChips.push({
      label: `Min ৳${minPrice}`,
      clear: () => updateParams({ minPrice: '' }),
    });
  if (maxPrice)
    activeChips.push({
      label: `Max ৳${maxPrice}`,
      clear: () => updateParams({ maxPrice: '' }),
    });

  const filterProps = {
    categories,
    search,
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    hasFilters,
    onSearch: (v: string) => updateParams({ search: v }),
    onCategory: (v: string) => updateParams({ category: v }),
    onMinPrice: (v: string) => updateParams({ minPrice: v }),
    onMaxPrice: (v: string) => updateParams({ maxPrice: v }),
    onSort: (by: SortBy, order: SortOrder) =>
      updateParams({ sortBy: by, sortOrder: order }),
    onReset: resetFilters,
  };

  return (
    <div
      className='min-h-screen'
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Page header */}
      <div
        className='border-b'
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
      >
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <h1
            className='text-3xl font-extrabold tracking-tight'
            style={{ color: 'var(--foreground)' }}
          >
            Browse Gear
          </h1>
          <p
            className='mt-1.5 text-sm'
            style={{ color: 'var(--muted-foreground)' }}
          >
            Rent premium sports &amp; outdoor equipment — from mountain bikes to
            camping kits
          </p>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex gap-8'>
          {/* Desktop filter sidebar */}
          <aside className='hidden w-64 shrink-0 lg:block'>
            <div
              className='sticky top-24 rounded-2xl border p-5'
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              <div className='mb-5 flex items-center gap-2'>
                <SlidersHorizontal
                  className='h-4 w-4'
                  style={{ color: 'var(--primary)' }}
                />
                <h2
                  className='text-sm font-bold'
                  style={{ color: 'var(--foreground)' }}
                >
                  Filters
                </h2>
              </div>
              <GearFilters {...filterProps} />
            </div>
          </aside>

          {/* Main content */}
          <div className='min-w-0 flex-1'>
            {/* Top bar: results count + sort + mobile filter btn */}
            <div className='mb-5 flex flex-wrap items-center gap-3'>
              {/* Results count */}
              <p
                className='text-sm'
                style={{ color: 'var(--muted-foreground)' }}
              >
                <span
                  className='font-semibold'
                  style={{ color: 'var(--foreground)' }}
                >
                  {total}
                </span>{' '}
                item{total !== 1 ? 's' : ''} found
              </p>

              <div className='ml-auto flex items-center gap-2'>
                {/* Sort dropdown (desktop, visible always) */}
                <div className='hidden sm:block'>
                  <select
                    value={`${sortBy}:${sortOrder}`}
                    onChange={(e) => {
                      const [by, order] = e.target.value.split(':') as [
                        SortBy,
                        SortOrder,
                      ];
                      updateParams({ sortBy: by, sortOrder: order });
                    }}
                    className='h-9 cursor-pointer rounded-lg border px-3 text-sm outline-none transition-colors appearance-none pr-8'
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                    }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className='inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors lg:hidden'
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                    backgroundColor: 'var(--card)',
                  }}
                >
                  <Filter className='h-4 w-4' />
                  Filters
                  {hasFilters && (
                    <span
                      className='flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white'
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      {activeChips.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className='mb-4 flex flex-wrap gap-2'>
                {activeChips.map((chip) => (
                  <span
                    key={chip.label}
                    className='inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium'
                    style={{
                      borderColor:
                        'color-mix(in srgb, var(--primary) 40%, transparent)',
                      backgroundColor:
                        'color-mix(in srgb, var(--primary) 8%, transparent)',
                      color: 'var(--primary)',
                    }}
                  >
                    {chip.label}
                    <button
                      onClick={chip.clear}
                      aria-label={`Remove ${chip.label} filter`}
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </span>
                ))}
                <button
                  onClick={resetFilters}
                  className='rounded-full px-3 py-1 text-xs font-medium transition-colors'
                  style={{
                    color: 'var(--muted-foreground)',
                    backgroundColor: 'var(--muted)',
                  }}
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Mobile sort row */}
            <div className='mb-4 block sm:hidden'>
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split(':') as [
                    SortBy,
                    SortOrder,
                  ];
                  updateParams({ sortBy: by, sortOrder: order });
                }}
                className='h-9 w-full cursor-pointer rounded-lg border px-3 text-sm outline-none transition-colors'
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
                aria-label='Sort gear'
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Gear grid / empty state */}
            {loading ? (
              <div className='flex items-center justify-center py-20'>
                <Loader2
                  className='h-8 w-8 animate-spin'
                  style={{ color: 'var(--primary)' }}
                />
                <span
                  className='ml-3 text-sm font-medium'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Loading gear...
                </span>
              </div>
            ) : error ? (
              <EmptyState hasFilters={hasFilters} onReset={resetFilters} />
            ) : gears.length === 0 ? (
              <EmptyState hasFilters={hasFilters} onReset={resetFilters} />
            ) : (
              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
                {gears.map((gear) => (
                  <GearCard key={gear.id} gear={gear} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-40 lg:hidden'
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Sheet */}
          <div
            className='fixed bottom-0 left-0 right-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-2xl p-6 lg:hidden'
            style={{
              backgroundColor: 'var(--card)',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div className='mb-5 flex items-center justify-between'>
              <h2
                className='text-base font-bold'
                style={{ color: 'var(--foreground)' }}
              >
                Filters &amp; Sort
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className='rounded-lg p-1.5 transition-colors'
                style={{ color: 'var(--muted-foreground)' }}
                aria-label='Close filters'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <GearFilters {...filterProps} />

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className='mt-6 h-11 w-full rounded-xl text-sm font-bold text-white transition-colors'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Show {total} Result{total !== 1 ? 's' : ''}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
