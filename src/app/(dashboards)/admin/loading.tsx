import { StatsCardSkeleton, Skeleton } from '@/components/Skeleton';

export default function AdminDashboardLoading() {
  const quickLinkPlaceholders = Array.from({ length: 4 });

  return (
    <div>
      {/* Header */}
      <div className='mb-8'>
        <Skeleton className='mb-2 h-7 w-48' />
        <Skeleton className='h-4 w-64' />
      </div>

      {/* Stats row */}
      <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Quick Actions heading */}
      <Skeleton className='mb-4 h-5 w-32' />

      {/* Quick Actions grid */}
      <div className='grid gap-4 sm:grid-cols-2'>
        {quickLinkPlaceholders.map((_, i) => (
          <div
            key={i}
            className='flex items-start gap-4 rounded-xl border p-5'
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
            }}
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
