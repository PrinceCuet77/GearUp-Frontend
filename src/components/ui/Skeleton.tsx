/**
 * Skeleton — the single source of loading placeholders for the whole app.
 *
 * Every block is built from the same `Skeleton` primitive and uses design
 * tokens, so placeholders stay correct in both light and dark themes and match
 * the geometry of the real component they stand in for.
 */

import { cn } from '@/lib/cn';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded bg-muted', className)} />
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
      <div className='flex items-center gap-4 border-b border-border bg-muted px-5 py-3'>
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

export function DashboardOverviewSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div>
      {/* Title */}
      <div className='mb-8'>
        <Skeleton className='mb-2 h-7 w-48' />
        <Skeleton className='h-4 w-64' />
      </div>

      {/* Stats row */}
      <div
        className={`mb-8 grid gap-4 sm:grid-cols-2 ${cols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Recent items table */}
      <TableSkeleton rows={4} cols={4} />
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

export function GearFiltersSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Search */}
      <div>
        <Skeleton className='mb-2 h-3 w-16' />
        <Skeleton className='h-9 w-full rounded-lg' />
      </div>

      {/* Categories */}
      <div>
        <Skeleton className='mb-2 h-3 w-20' />
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center gap-2'>
              <Skeleton className='h-4 w-4 rounded' />
              <Skeleton className='h-4 w-24' />
            </div>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <Skeleton className='mb-2 h-3 w-24' />
        <div className='flex gap-2'>
          <Skeleton className='h-9 w-full rounded-lg' />
          <Skeleton className='h-9 w-full rounded-lg' />
        </div>
      </div>

      {/* Sort */}
      <div>
        <Skeleton className='mb-2 h-3 w-14' />
        <Skeleton className='h-9 w-full rounded-lg' />
      </div>

      {/* Reset */}
      <Skeleton className='h-9 w-full rounded-control' />
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
