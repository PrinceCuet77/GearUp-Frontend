import { Skeleton, TableSkeleton } from '@/components/ui/Skeleton';

export default function ProviderGearsLoading() {
  return (
    <div>
      {/* PageHeader Skeleton */}
      <div className='mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <Skeleton className='mb-2 h-8 w-32' />
          <Skeleton className='h-4 w-48' />
        </div>
        <Skeleton className='h-10 w-32 rounded-lg' />
      </div>

      {/* Table Skeleton */}
      <div
        className='surface-card'
      >
        <TableSkeleton rows={5} cols={5} />

        {/* Pagination Skeleton */}
        <div
          className='flex items-center justify-between border-t px-5 py-3'
          style={{ borderColor: 'var(--border)' }}
        >
          <Skeleton className='h-4 w-24' />
          <div className='flex gap-2'>
            <Skeleton className='h-8 w-8 rounded-lg' />
            <Skeleton className='h-8 w-8 rounded-lg' />
          </div>
        </div>
      </div>
    </div>
  );
}
