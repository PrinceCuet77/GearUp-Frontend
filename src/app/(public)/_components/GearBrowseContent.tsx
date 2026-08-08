'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Package,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import type { GearItem, Category } from '@/lib/types';
import { type SortBy, type SortOrder, SORT_OPTIONS } from '@/lib/gear-utils';
import { cn } from '@/lib/cn';
import { getAllGearsAction } from '../_actions/getAllGears';
import { getAllCategoriesAction } from '../_actions/getAllCategories';
import GearFilters from './GearFilters';
import GearCard from './GearCard';
import { GearGridSkeleton, GearFiltersSkeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

const PAGE_SIZE = 9;

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

  // At most 5 page buttons, centred on the current page.
  const delta = 2;
  const range: number[] = [];
  for (
    let i = Math.max(1, page - delta);
    i <= Math.min(totalPages, page + delta);
    i++
  ) {
    range.push(i);
  }

  const base =
    'flex h-10 w-10 cursor-pointer items-center justify-center rounded-control border border-border bg-card text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40';

  return (
    <nav
      className='mt-12 flex items-center justify-center gap-1.5'
      aria-label='Pagination'
    >
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className={base}
        aria-label='Previous page'
      >
        <ChevronLeft className='h-4 w-4' />
      </button>

      {range[0] > 1 && (
        <>
          <button onClick={() => onPage(1)} className={base}>
            1
          </button>
          {range[0] > 2 && (
            <span className='flex h-10 w-6 items-center justify-center text-sm text-muted-foreground'>
              …
            </span>
          )}
        </>
      )}

      {range.map((n) => (
        <button
          key={n}
          onClick={() => onPage(n)}
          aria-current={n === page ? 'page' : undefined}
          className={cn(
            base,
            n === page &&
              '!border-primary !bg-primary !text-primary-foreground hover:!text-primary-foreground',
          )}
        >
          {n}
        </button>
      ))}

      {range[range.length - 1] < totalPages && (
        <>
          {range[range.length - 1] < totalPages - 1 && (
            <span className='flex h-10 w-6 items-center justify-center text-sm text-muted-foreground'>
              …
            </span>
          )}
          <button onClick={() => onPage(totalPages)} className={base}>
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className={base}
        aria-label='Next page'
      >
        <ChevronRight className='h-4 w-4' />
      </button>
    </nav>
  );
}

function SortSelect({
  sortBy,
  sortOrder,
  onChange,
  className,
}: {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onChange: (by: SortBy, order: SortOrder) => void;
  className?: string;
}) {
  return (
    <select
      aria-label='Sort gear'
      value={`${sortBy}:${sortOrder}`}
      onChange={(e) => {
        const [by, order] = e.target.value.split(':') as [SortBy, SortOrder];
        onChange(by, order);
      }}
      className={cn('field-input h-10 cursor-pointer py-0', className)}
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
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
          limit: PAGE_SIZE,
          sortBy,
          sortOrder,
        });

        if (result?.success) {
          setGears(result.data ?? []);
          setTotalPages(result.meta?.totalPages || 1);
          setTotal(result.meta?.total || 0);
          setError(null);
        } else {
          setError(result.error || 'Failed to load gears');
          setGears([]);
        }
      } catch {
        setError('An unexpected error occurred');
        setGears([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGears();
  }, [category, minPrice, maxPrice, search, page, sortBy, sortOrder]);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const result = await getAllCategoriesAction();
        if (result.success && result.data) {
          setCategories(result.data);
        } else if (result.error) {
          setCategoriesError(result.error);
        }
      } catch {
        setCategoriesError('Failed to fetch categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Lock scroll behind the mobile filter sheet.
  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  const updateParams = useCallback(
    (updates: Record<string, string>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
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
    (n: number) => updateParams({ page: n === 1 ? '' : String(n) }, false),
    [updateParams],
  );

  const hasFilters = Boolean(search || category || minPrice || maxPrice);

  const activeChips: Array<{ label: string; clear: () => void }> = [];
  if (search)
    activeChips.push({
      label: `“${search}”`,
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
    <div className='min-h-screen bg-background'>
      {/* Page header */}
      <div className='border-b border-border bg-card'>
        <div className='container-page py-10 sm:py-12'>
          <h1 className='text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl'>
            Browse gear
          </h1>
          <p className='mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base'>
            Rent premium sports and outdoor equipment from verified providers —
            filter by category, price and rating, then book the days you need.
          </p>
        </div>
      </div>

      <div className='container-page py-8 lg:py-10'>
        <div className='flex gap-8'>
          {/* Desktop filter sidebar */}
          <aside className='hidden w-64 shrink-0 lg:block'>
            <div className='surface-card sticky top-24 p-5'>
              <div className='mb-5 flex items-center gap-2'>
                <SlidersHorizontal
                  className='h-4 w-4 text-primary'
                  aria-hidden='true'
                />
                <h2 className='text-sm font-bold text-foreground'>Filters</h2>
              </div>

              {categoriesLoading ? (
                <GearFiltersSkeleton />
              ) : categoriesError ? (
                <ErrorBanner
                  message={categoriesError}
                  title='Could not load categories'
                  showToast={false}
                />
              ) : (
                <GearFilters {...filterProps} />
              )}
            </div>
          </aside>

          {/* Results */}
          <div className='min-w-0 flex-1'>
            <div className='mb-5 flex flex-wrap items-center gap-3'>
              <p className='text-sm text-muted-foreground'>
                {loading ? (
                  'Loading listings…'
                ) : (
                  <>
                    <span className='font-bold text-foreground'>{total}</span>{' '}
                    item{total === 1 ? '' : 's'} found
                  </>
                )}
              </p>

              <div className='ml-auto flex items-center gap-2'>
                <SortSelect
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onChange={(by, order) =>
                    updateParams({ sortBy: by, sortOrder: order })
                  }
                  className='hidden w-48 sm:block'
                />

                <Button
                  variant='outline'
                  size='sm'
                  className='h-10 lg:hidden'
                  leadingIcon={<Filter className='h-4 w-4' />}
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  Filters
                  {hasFilters && (
                    <span className='flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground'>
                      {activeChips.length}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Active filters */}
            {activeChips.length > 0 && (
              <div className='mb-5 flex flex-wrap gap-2'>
                {activeChips.map((chip) => (
                  <span
                    key={chip.label}
                    className='inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-foreground'
                  >
                    {chip.label}
                    <button
                      onClick={chip.clear}
                      aria-label={`Remove ${chip.label} filter`}
                      className='cursor-pointer transition-opacity hover:opacity-70'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </span>
                ))}
                <button
                  onClick={resetFilters}
                  className='cursor-pointer rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground'
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Mobile sort */}
            <div className='mb-5 sm:hidden'>
              <SortSelect
                sortBy={sortBy}
                sortOrder={sortOrder}
                onChange={(by, order) =>
                  updateParams({ sortBy: by, sortOrder: order })
                }
                className='w-full'
              />
            </div>

            {loading ? (
              <GearGridSkeleton count={PAGE_SIZE} />
            ) : error ? (
              <div className='space-y-5'>
                <ErrorBanner message={error} title='Could not load gears' />
                <EmptyState
                  icon={Package}
                  title='Nothing to show right now'
                  description='We could not reach the catalogue. Check your connection and try again.'
                  action={
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => router.refresh()}
                    >
                      Retry
                    </Button>
                  }
                />
              </div>
            ) : gears.length === 0 ? (
              <EmptyState
                icon={Package}
                title='No gear matches those filters'
                description={
                  hasFilters
                    ? 'Try widening your price range, clearing the search term, or picking another category.'
                    : 'No gear is available right now. Check back soon — providers add listings regularly.'
                }
                action={
                  hasFilters ? (
                    <Button size='sm' onClick={resetFilters}>
                      Clear all filters
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {gears.map((gear, index) => (
                  <GearCard
                    key={gear.id}
                    gear={gear}
                    priority={index < 3}
                    imageSizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw'
                  />
                ))}
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className='fixed inset-0 z-50 lg:hidden'
              style={{ backgroundColor: 'var(--overlay)' }}
            />

            <motion.div
              role='dialog'
              aria-modal='true'
              aria-label='Filters and sort'
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className='fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-card border-t border-border bg-card p-6 lg:hidden'
            >
              <div className='mb-5 flex items-center justify-between'>
                <h2 className='text-base font-bold text-foreground'>
                  Filters &amp; sort
                </h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label='Close filters'
                  className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <GearFilters {...filterProps} />

              <Button
                fullWidth
                size='lg'
                className='mt-6'
                onClick={() => setMobileFiltersOpen(false)}
              >
                Show {total} result{total === 1 ? '' : 's'}
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
