import { Skeleton, TableSkeleton } from '@/components/ui/Skeleton';

/**
 * Mirrors AdminRentalsClient: title, status tabs, a date-range filter row,
 * the search/select toolbar row, then the 7-column orders table.
 */
export default function AdminRentalsLoading() {
  return (
    <div>
      <div className='mb-6 space-y-2'>
        <Skeleton className='h-8 w-52' />
        <Skeleton className='h-4 w-64' />
      </div>

      <div className='mb-4 flex flex-wrap gap-2'>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className='h-7 w-20 rounded-full' />
        ))}
      </div>

      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end'>
        <div className='space-y-1.5 sm:w-44'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-11 w-full rounded-control' />
        </div>
        <div className='space-y-1.5 sm:w-44'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-11 w-full rounded-control' />
        </div>
      </div>

      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-end'>
        <div className='space-y-1.5 sm:w-72'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-11 w-full rounded-control' />
        </div>
        <div className='space-y-1.5 sm:w-48'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-11 w-full rounded-control' />
        </div>
        <div className='space-y-1.5 sm:w-48'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-11 w-full rounded-control' />
        </div>
      </div>

      <TableSkeleton rows={6} cols={7} />
    </div>
  );
}
