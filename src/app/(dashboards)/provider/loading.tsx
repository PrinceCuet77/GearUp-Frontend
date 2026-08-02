import { Skeleton, StatsCardSkeleton } from '@/components/ui/Skeleton';

export default function ProviderDashboardLoading() {
  return (
    <div>
      {/* Title */}
      <div className='mb-8'>
        <Skeleton className='mb-2 h-7 w-52' />
        <Skeleton className='h-4 w-72' />
      </div>

      {/* Add New Gear button */}
      <Skeleton className='mb-6 h-10 w-40 rounded-lg' />

      {/* Stats grid — 3 columns */}
      <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Recent Orders table */}
      <div
        className='rounded-xl border'
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {/* Table header bar */}
        <div
          className='flex items-center justify-between border-b px-6 py-4'
          style={{ borderColor: 'var(--border)' }}
        >
          <Skeleton className='h-5 w-36' />
          <Skeleton className='h-4 w-20' />
        </div>

        {/* Table header row */}
        <div
          className='border-b px-6 py-3'
          style={{ borderColor: 'var(--border)' }}
        >
          <div className='flex gap-6'>
            <Skeleton className='h-3 w-16' />
            <Skeleton className='h-3 w-20' />
            <Skeleton className='h-3 w-28' />
            <Skeleton className='h-3 w-14' />
            <Skeleton className='h-3 w-16' />
            <Skeleton className='h-3 w-14' />
          </div>
        </div>

        {/* Table rows */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='flex items-center gap-6 border-b px-6 py-4'
            style={{ borderColor: 'var(--border)' }}
          >
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-36' />
            <Skeleton className='h-4 w-14' />
            <Skeleton className='h-5 w-16 rounded-full' />
            <Skeleton className='h-4 w-14' />
          </div>
        ))}
      </div>
    </div>
  );
}
