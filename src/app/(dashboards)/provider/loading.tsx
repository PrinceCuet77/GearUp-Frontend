import { Skeleton, StatsCardSkeleton } from '@/components/ui/Skeleton';

export default function ProviderDashboardLoading() {
  return (
    <div>
      {/* Title */}
      <div className='mb-8'>
        <Skeleton className='mb-2 h-7 w-52' />
        <Skeleton className='h-4 w-72' />
      </div>

      {/* Stats grid — 4 columns */}
      <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Quick Actions heading */}
      <Skeleton className='mb-4 h-5 w-28' />

      {/* Quick action cards */}
      <div className='grid gap-4 sm:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='flex items-start gap-4 surface-card p-5'
          >
            <Skeleton className='mt-0.5 h-10 w-10 shrink-0 rounded-lg' />
            <div className='flex-1'>
              <Skeleton className='mb-2 h-4 w-32' />
              <Skeleton className='h-3.5 w-48' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
