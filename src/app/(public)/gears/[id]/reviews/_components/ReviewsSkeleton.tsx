'use client';

import { Skeleton } from '@/components/ui/Skeleton';

function SummarySkeleton() {
  return (
    <div
      className='mb-8 surface-card p-6'
    >
      <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
        <div className='flex flex-col items-center gap-2 sm:w-32 sm:shrink-0'>
          <Skeleton className='h-12 w-16' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-3 w-20' />
        </div>
        <div className='flex-1 space-y-3'>
          {[5, 4, 3, 2, 1].map((n) => (
            <div key={n} className='flex items-center gap-3'>
              <Skeleton className='h-3 w-12' />
              <Skeleton className='h-2 flex-1' />
              <Skeleton className='h-3 w-6' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewCardSkeleton() {
  return (
    <div
      className='surface-card p-5'
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='space-y-1.5'>
            <Skeleton className='h-4 w-28' />
            <Skeleton className='h-3 w-36' />
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-5 w-9 rounded-full' />
        </div>
      </div>
      <Skeleton className='mt-3 h-4 w-full' />
      <Skeleton className='mt-1.5 h-4 w-3/4' />
    </div>
  );
}

export function ReviewsSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      <SummarySkeleton />
      <div className='space-y-4'>
        {Array.from({ length: count }).map((_, i) => (
          <ReviewCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
