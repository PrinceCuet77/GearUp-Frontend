import { Skeleton } from '@/components/ui/Skeleton';

export default function CustomerOrdersLoading() {
  return (
    <div>
      {/* PageHeader skeleton */}
      <div className='mb-6'>
        <Skeleton className='h-8 w-48 mb-2' />
        <Skeleton className='h-4 w-32' />
      </div>

      {/* Filter pills skeleton */}
      <div className='mb-6 flex flex-wrap gap-2'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='h-9 w-20 rounded-full' />
        ))}
      </div>

      {/* Table skeleton */}
      <div className='rounded-xl p-4'>
        <Skeleton className='h-10 w-full mb-3' />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-12 w-full mb-3' />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className='mt-4 flex items-center justify-between'>
        <Skeleton className='h-4 w-40' />
        <div className='flex gap-2'>
          <Skeleton className='h-9 w-20 rounded-lg' />
          <Skeleton className='h-9 w-20 rounded-lg' />
        </div>
      </div>
    </div>
  );
}
