import { Skeleton } from '@/components/ui/Skeleton';

export function ProfileSkeleton() {
  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      {/* Page Header Skeleton */}
      <div className='mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-64' />
        </div>
      </div>

      {/* Profile info card */}
      <div
        className='mx-auto max-w-2xl rounded-xl border p-6'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <div className='mb-5 flex items-center gap-2'>
          <Skeleton className='h-4 w-4 rounded' />
          <Skeleton className='h-5 w-40' />
        </div>

        <div className='space-y-4'>
          {/* Avatar */}
          <div className='flex items-center gap-4'>
            <Skeleton className='h-16 w-16 rounded-xl' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-48' />
              <Skeleton className='h-5 w-16 rounded-full' />
            </div>
          </div>

          {/* Read-only fields */}
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-12' />
              <Skeleton className='h-10 w-full rounded-lg' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-10 w-full rounded-lg' />
            </div>
          </div>

          <div className='flex justify-end'>
            <Skeleton className='h-10 w-36 rounded-lg' />
          </div>
        </div>
      </div>
    </div>
  );
}
