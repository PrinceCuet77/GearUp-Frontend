/**
 * Skeleton — reusable loading placeholder components.
 * All use CSS custom-properties so they respect both light and dark themes.
 */

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: 'var(--muted)' }}
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
  const colWidths = ['w-1/4', 'w-1/5', 'w-1/5', 'w-1/6', 'w-1/6'];

  return (
    <div
      className='overflow-hidden rounded-xl border'
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
    >
      {/* Fake header */}
      <div
        className='flex items-center gap-4 border-b px-5 py-3'
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--muted)',
        }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className={`h-3.5 ${colWidths[i] ?? 'w-1/6'}`} />
        ))}
      </div>

      {/* Fake rows */}
      <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
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
    <div
      className='rounded-xl border p-5'
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
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
    <div
      className='overflow-hidden rounded-xl border'
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
    >
      <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
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
    <div
      className='overflow-hidden rounded-xl border'
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
    >
      <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
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
