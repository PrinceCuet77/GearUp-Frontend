/**
 * Skeleton — the single source of loading placeholders for the whole app.
 *
 * Every block is built from the same `Skeleton` primitive and uses design
 * tokens, so placeholders stay correct in both light and dark themes and match
 * the geometry of the real component they stand in for.
 */

import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

export function Skeleton({
  className = '',
  style,
}: {
  className?: string;
  /** For dimensions that have no utility class, e.g. a chart's exact height. */
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn('animate-pulse rounded bg-muted', className)}
      style={style}
    />
  );
}

export function TableSkeleton({
  rows = 5,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  // col width distribution: first col wide, rest even
  const colWidths = ['w-1/4', 'w-1/5', 'w-1/5', 'w-1/6', 'w-1/6'];

  return (
    <div className='surface-card overflow-hidden'>
      {/* Fake header */}
      <div className='flex items-center gap-4 border-b border-border bg-muted/40 px-5 py-3.5'>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className={`h-3.5 ${colWidths[i] ?? 'w-1/6'}`} />
        ))}
      </div>

      {/* Fake rows */}
      <ul className='divide-y divide-border'>
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className='flex items-center gap-4 px-5 py-4'>
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className={`h-4 ${colWidths[j] ?? 'w-1/6'}`} />
            ))}
          </li>
        ))}
      </ul>

      {/* Fake pagination */}
      <div className='flex items-center justify-between gap-4 border-t border-border px-5 py-4'>
        <Skeleton className='h-3.5 w-40' />
        <div className='flex gap-1.5'>
          <Skeleton className='h-9 w-9 rounded-control' />
          <Skeleton className='h-9 w-9 rounded-control' />
          <Skeleton className='h-9 w-9 rounded-control' />
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className='surface-card p-5'>
      <div className='mb-3 flex items-center justify-between'>
        <Skeleton className='h-3.5 w-24' />
        <Skeleton className='h-8 w-8 rounded-lg' />
      </div>
      <Skeleton className='mb-1.5 h-7 w-16' />
      <Skeleton className='h-3 w-20' />
    </div>
  );
}

export function ReviewSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className='surface-card overflow-hidden'>
      <ul className='divide-y divide-border'>
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className='p-5'>
            <div className='mb-2 flex items-center gap-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-3.5 w-20' />
            </div>
            <Skeleton className='mb-1.5 h-3.5 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategorySkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className='surface-card overflow-hidden'>
      <ul className='divide-y divide-border'>
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className='flex items-center justify-between px-5 py-4'>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-8 w-8 rounded-lg' />
              <Skeleton className='h-4 w-32' />
            </div>
            <div className='flex gap-2'>
              <Skeleton className='h-7 w-14 rounded-lg' />
              <Skeleton className='h-7 w-14 rounded-lg' />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A whole table page: title, filter row, table and pagination — matching the
 * `PageHeader` + `TableToolbar` + `DataTable` composition every list page uses.
 */
export function TablePageSkeleton({
  rows = 6,
  cols = 5,
  filters = 2,
}: {
  rows?: number;
  cols?: number;
  filters?: number;
}) {
  return (
    <div>
      <div className='mb-6 space-y-2'>
        <Skeleton className='h-8 w-52' />
        <Skeleton className='h-4 w-64' />
      </div>

      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-end'>
        <div className='space-y-1.5 sm:w-72'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-11 w-full rounded-control' />
        </div>
        {Array.from({ length: filters }).map((_, i) => (
          <div key={i} className='space-y-1.5 sm:w-48'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-11 w-full rounded-control' />
          </div>
        ))}
      </div>

      <TableSkeleton rows={rows} cols={cols} />
    </div>
  );
}

/** Placeholder for a `ChartCard`: header, plot area, legend row. */
export function ChartCardSkeleton({ height = 224 }: { height?: number }) {
  return (
    <div className='surface-card p-5'>
      <div className='mb-5 flex items-start justify-between gap-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-40' />
          <Skeleton className='h-3 w-56' />
        </div>
        <Skeleton className='h-8 w-20' />
      </div>
      <Skeleton
        className='w-full rounded-control'
        style={{ height }}
      />
      <div className='mt-4 flex gap-4'>
        <Skeleton className='h-3 w-24' />
        <Skeleton className='h-3 w-24' />
      </div>
    </div>
  );
}

/**
 * The overview layout: stat tiles, a wide chart beside a narrow one, then the
 * activity table — the same grid the real page renders.
 */
export function DashboardOverviewSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div>
      {/* Title */}
      <div className='mb-6'>
        <Skeleton className='mb-2 h-7 w-48' />
        <Skeleton className='h-4 w-64' />
      </div>

      {/* Stats row */}
      <div
        className={`mb-8 grid gap-4 sm:grid-cols-2 ${cols === 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-4'}`}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className='mb-8 grid gap-4 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <ChartCardSkeleton />
        </div>
        <ChartCardSkeleton height={280} />
      </div>

      {/* Recent items table */}
      <Skeleton className='mb-4 h-5 w-44' />
      <TableSkeleton rows={5} cols={5} />
    </div>
  );
}

/**
 * Mirrors `GearCard` exactly — same aspect ratio, same body rhythm, same
 * footer — so the grid does not reflow when real data arrives.
 */
export function GearCardSkeleton() {
  return (
    <article className='surface-card flex h-full flex-col overflow-hidden'>
      {/* Image */}
      <Skeleton className='aspect-4/3 w-full rounded-none' />

      {/* Body */}
      <div className='flex flex-1 flex-col p-5'>
        <Skeleton className='h-5 w-4/5' />

        <div className='mt-2 space-y-1.5'>
          <Skeleton className='h-3.5 w-full' />
          <Skeleton className='h-3.5 w-3/5' />
        </div>

        <div className='mt-4 flex items-center justify-between gap-2'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-4 w-20' />
        </div>

        <div className='mt-3 flex items-center justify-between gap-2'>
          <Skeleton className='h-3.5 w-24' />
          <Skeleton className='h-3.5 w-20' />
        </div>

        <div className='mt-auto flex items-center justify-between gap-3 border-t border-border pt-4'>
          <Skeleton className='h-7 w-24' />
          <div className='flex gap-2'>
            <Skeleton className='h-9 w-24 rounded-control' />
            <Skeleton className='h-9 w-9 rounded-control' />
          </div>
        </div>
      </div>
    </article>
  );
}

export function GearGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: count }).map((_, i) => (
        <GearCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Mirrors `GearFilters` group-for-group, including the category chip row. */
export function GearFiltersSkeleton() {
  const chipWidths = ['w-12', 'w-20', 'w-16', 'w-24', 'w-14'];

  return (
    <div className='space-y-6'>
      {/* Search */}
      <div>
        <Skeleton className='mb-2 h-3 w-16' />
        <Skeleton className='h-10 w-full rounded-control' />
      </div>

      {/* Categories — chips, matching the real filter */}
      <div>
        <Skeleton className='mb-2 h-3 w-20' />
        <div className='flex flex-wrap gap-2'>
          {chipWidths.map((width, i) => (
            <Skeleton key={i} className={`h-6 rounded-full ${width}`} />
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <Skeleton className='mb-2 h-3 w-28' />
        <div className='flex items-center gap-2'>
          <Skeleton className='h-10 flex-1 rounded-control' />
          <Skeleton className='h-3 w-2' />
          <Skeleton className='h-10 flex-1 rounded-control' />
        </div>
      </div>

      {/* Sort */}
      <div>
        <Skeleton className='mb-2 h-3 w-14' />
        <Skeleton className='h-10 w-full rounded-control' />
      </div>
    </div>
  );
}

export function GearDetailSkeleton() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container-page py-8'>
        {/* Back link */}
        <Skeleton className='mb-6 h-4 w-32 rounded' />

        <div className='grid gap-8 lg:grid-cols-2'>
          {/* Images column */}
          <div className='space-y-3'>
            <Skeleton className='aspect-4/3 w-full rounded-card' />

            <div className='flex gap-2'>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className='h-16 w-16 shrink-0 rounded-xl' />
              ))}
            </div>

            <div className='surface-card flex items-center gap-4 p-4'>
              <Skeleton className='h-14 w-14 shrink-0 rounded-xl' />
              <div className='flex-1'>
                <Skeleton className='mb-2 h-5 w-28' />
                <Skeleton className='h-3.5 w-20' />
              </div>
            </div>
          </div>

          {/* Info column */}
          <div className='flex flex-col gap-5'>
            <Skeleton className='h-6 w-28 rounded-full' />

            <div>
              <Skeleton className='mb-3 h-8 w-3/4' />
              <Skeleton className='h-7 w-24' />
            </div>

            <div className='flex gap-4'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-5 w-36' />
              <Skeleton className='h-5 w-32' />
            </div>

            <div className='surface-card p-4'>
              <Skeleton className='mb-3 h-3 w-24' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='mt-1.5 h-4 w-full' />
              <Skeleton className='mt-1.5 h-4 w-2/3' />
            </div>

            <Skeleton className='h-12 w-full rounded-control' />
          </div>
        </div>

        {/* Reviews */}
        <section className='mt-12'>
          <div className='mb-6 flex items-center justify-between'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-4 w-20' />
          </div>
          <ReviewSkeleton rows={1} />
        </section>
      </div>
    </div>
  );
}
