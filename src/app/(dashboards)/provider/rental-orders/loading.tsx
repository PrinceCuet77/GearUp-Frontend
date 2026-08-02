import { Skeleton, TableSkeleton } from '@/components/ui/Skeleton';

export default function ProviderOrdersLoading() {
  return (
    <div>
      {/* PageHeader Skeleton */}
      <div className='mb-8'>
        <Skeleton className='mb-2 h-8 w-64' />
        <Skeleton className='h-4 w-48' />
      </div>

      {/* Filter Pills Skeleton */}
      <div className='mb-6 flex flex-wrap gap-2'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='h-8 w-20 rounded-full' />
        ))}
      </div>

      {/* Table Skeleton */}
      <TableSkeleton rows={5} cols={6} />

      {/* Pagination Skeleton */}
      <div className='mt-4 flex items-center justify-end gap-2'>
        <Skeleton className='h-8 w-8 rounded-lg' />
        <Skeleton className='h-8 w-8 rounded-lg' />
      </div>
    </div>
  );
}
