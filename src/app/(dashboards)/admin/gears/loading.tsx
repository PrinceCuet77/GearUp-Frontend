import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminUsersLoading() {
  return (
    <div>
      {/* PageHeader skeleton */}
      <div className='mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='mt-1 h-4 w-32' />
        </div>
        <Skeleton className='h-10 w-28 rounded-lg' />
      </div>

      {/* Search / filters bar skeleton */}
      <div
        className='mb-4 flex flex-wrap items-center gap-3 rounded-xl border p-4'
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
      >
        <Skeleton className='h-10 w-64 rounded-lg' />
        <Skeleton className='h-10 w-32 rounded-lg' />
        <Skeleton className='h-10 w-32 rounded-lg' />
      </div>

      {/* Table skeleton */}
      <div
        className='overflow-hidden rounded-xl border'
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card)',
        }}
      >
        {/* Header row */}
        <div
          className='flex items-center gap-4 border-b px-5 py-3'
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--muted)',
          }}
        >
          <Skeleton className='h-3.5 w-[5%]' />
          <Skeleton className='h-3.5 w-[20%]' />
          <Skeleton className='h-3.5 w-[20%]' />
          <Skeleton className='h-3.5 w-[15%]' />
          <Skeleton className='h-3.5 w-[15%]' />
          <Skeleton className='h-3.5 w-[10%]' />
          <Skeleton className='h-3.5 w-[15%]' />
        </div>

        {/* Body rows */}
        <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className='flex items-center gap-4 px-5 py-4'>
              <Skeleton className='h-5 w-[5%] rounded-full' />
              <Skeleton className='h-5 w-[20%]' />
              <Skeleton className='h-5 w-[20%]' />
              <Skeleton className='h-5 w-[15%]' />
              <Skeleton className='h-5 w-[15%]' />
              <Skeleton className='h-6 w-[10%] rounded-full' />
              <Skeleton className='h-5 w-[15%]' />
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination skeleton */}
      <div className='mt-4 flex items-center justify-between'>
        <Skeleton className='h-4 w-40' />
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 w-9 rounded-lg' />
          <Skeleton className='h-9 w-9 rounded-lg' />
          <Skeleton className='h-9 w-9 rounded-lg' />
          <Skeleton className='h-9 w-9 rounded-lg' />
        </div>
      </div>
    </div>
  );
}
