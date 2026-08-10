import { Skeleton } from '@/components/ui/Skeleton';

function HeaderSkeleton() {
  return (
    <div className='mb-6 space-y-2'>
      <Skeleton className='h-8 w-48' />
      <Skeleton className='h-4 w-72' />
    </div>
  );
}

/** Mirrors the two-column profile layout so nothing shifts on hydrate. */
export function ProfileSkeleton() {
  return (
    <div>
      <HeaderSkeleton />
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='surface-card h-fit p-6'>
          <div className='flex flex-col items-center gap-3'>
            <Skeleton className='h-22 w-22 rounded-card' />
            <Skeleton className='h-5 w-40' />
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-5 w-28 rounded-full' />
          </div>
          <div className='mt-6 space-y-4 border-t border-border pt-5'>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className='flex items-center gap-3'>
                <Skeleton className='h-8 w-8 rounded-control' />
                <div className='flex-1 space-y-1.5'>
                  <Skeleton className='h-3 w-24' />
                  <Skeleton className='h-4 w-40' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='surface-card p-6 lg:col-span-2'>
          <Skeleton className='mb-5 h-5 w-48' />
          <div className='space-y-5'>
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-11 w-full rounded-control' />
              </div>
            ))}
            <div className='flex justify-end gap-3 border-t border-border pt-5'>
              <Skeleton className='h-11 w-24 rounded-control' />
              <Skeleton className='h-11 w-36 rounded-control' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Settings page: security form on the left, account summary on the right. */
export function SettingsSkeleton() {
  return (
    <div>
      <HeaderSkeleton />
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='surface-card p-6 lg:col-span-2'>
          <Skeleton className='mb-2 h-5 w-48' />
          <Skeleton className='mb-5 h-4 w-full max-w-md' />
          <div className='space-y-4'>
            <Skeleton className='h-11 w-full rounded-control' />
            <div className='grid gap-4 sm:grid-cols-2'>
              <Skeleton className='h-11 w-full rounded-control' />
              <Skeleton className='h-11 w-full rounded-control' />
            </div>
            <div className='flex justify-end'>
              <Skeleton className='h-11 w-40 rounded-control' />
            </div>
          </div>
        </div>

        <div className='surface-card h-fit space-y-4 p-6'>
          <Skeleton className='h-5 w-40' />
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className='space-y-1.5'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-4 w-40' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
