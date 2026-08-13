'use client';

import { Skeleton } from '@/components/ui/Skeleton';

const LIMIT = 10;

export function ReviewSkeleton({ rows = LIMIT }: { rows?: number }) {
  return (
    <div>
      {/* PageHeader skeleton - matches PageHeader with title + description */}
      <div className='mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          {/* h1 text-2xl font-bold tracking-tight */}
          <Skeleton className='mb-2 h-7 w-48' />
          {/* p mt-1 text-sm */}
          <Skeleton className='mt-1 h-4 w-36' />
        </div>
      </div>

      {/* Reviews card */}
      <div className='surface-card'>
        <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
          {Array.from({ length: rows }).map((_, i) => (
            <li key={i} className='p-5'>
              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0 flex-1'>
                  <div className='mb-1 flex flex-wrap items-center gap-2'>
                    {/* Star rating placeholders */}
                    <div className='flex items-center gap-0.5'>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Skeleton key={j} className='h-3.5 w-3.5 rounded-sm' />
                      ))}
                    </div>
                    {/* Date placeholder - text-xs ≈ h-3 */}
                    <Skeleton className='h-3 w-20' />
                  </div>
                  {/* Gear name placeholder - text-sm font-medium ≈ h-4 */}
                  <Skeleton className='h-4 w-3/5' />
                  {/* Comment placeholder - mt-1 text-sm ≈ mt-1 h-4 */}
                  <Skeleton className='mt-1 h-4 w-full max-w-md' />
                </div>
                {/* Delete button placeholder */}
                <Skeleton className='h-8 w-8 shrink-0 rounded-lg' />
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination skeleton */}
        <div
          className='flex items-center justify-between border-t px-6 py-4'
          style={{ borderColor: 'var(--border)' }}
        >
          {/* p text-sm */}
          <Skeleton className='h-4 w-24' />
          <div className='flex items-center gap-2'>
            {/* button h-8 w-8 rounded-lg border */}
            <div
              className='flex h-8 w-8 items-center justify-center rounded-lg border'
              style={{ borderColor: 'var(--border)' }}
            >
              <Skeleton className='h-4 w-4' />
            </div>
            <div
              className='flex h-8 w-8 items-center justify-center rounded-lg border'
              style={{ borderColor: 'var(--border)' }}
            >
              <Skeleton className='h-4 w-4' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
