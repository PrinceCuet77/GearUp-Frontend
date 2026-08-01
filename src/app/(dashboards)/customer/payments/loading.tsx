import { Skeleton } from '@/components/ui/Skeleton';

export default function PaymentsLoading() {
  return (
    <div>
      {/* PageHeader skeleton — matches PageHeader layout */}
      <div className='mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <Skeleton className='h-7 w-52' />
          <Skeleton className='mt-1 h-4 w-36' />
        </div>
      </div>

      {/* Status filter pills skeleton */}
      <div className='mb-6 flex flex-wrap gap-2'>
        {['w-12', 'w-18', 'w-22', 'w-14'].map((w, i) => (
          <Skeleton key={i} className={`h-8 ${w} rounded-full`} />
        ))}
      </div>

      {/* Table skeleton — matches PaymentsTable structure */}
      <div
        className='overflow-hidden rounded-xl border'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Table header */}
        <div
          className='flex items-center border-b px-6 py-3'
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--muted)',
          }}
        >
          <Skeleton className='h-3.5 w-[20%]' />
          <Skeleton className='ml-6 h-3.5 w-[15%]' />
          <Skeleton className='ml-6 h-3.5 w-[15%]' />
          <Skeleton className='ml-6 h-3.5 w-[12%]' />
          <Skeleton className='ml-6 h-3.5 w-[18%]' />
        </div>

        {/* Table rows */}
        <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className='flex items-center px-6 py-4'>
              <Skeleton className='h-4 w-[20%]' />
              <Skeleton className='ml-6 h-4 w-[15%]' />
              <Skeleton className='ml-6 h-4 w-[12%]' />
              <Skeleton className='ml-6 h-6 w-[18%] rounded-full' />
              <Skeleton className='ml-6 h-4 w-[18%]' />
            </li>
          ))}
        </ul>

        {/* Pagination skeleton */}
        <div
          className='flex items-center justify-between border-t px-6 py-4'
          style={{ borderColor: 'var(--border)' }}
        >
          <Skeleton className='h-4 w-28' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-8 w-8 rounded-lg' />
            <Skeleton className='h-8 w-8 rounded-lg' />
          </div>
        </div>
      </div>
    </div>
  );
}
