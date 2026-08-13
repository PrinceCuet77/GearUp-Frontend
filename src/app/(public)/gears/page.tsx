import { Suspense } from 'react';
import type { Metadata } from 'next';

import GearBrowseContent from '../_components/GearBrowseContent';
import {
  GearFiltersSkeleton,
  GearGridSkeleton,
  Skeleton,
} from '@/components/ui/Skeleton';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: `Browse Gear - ${SITE.name}`,
  description:
    'Browse sports and outdoor equipment available to rent by the day. Filter by category, price and rating.',
};

function GearBrowseSkeleton() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='border-b border-border bg-card'>
        <div className='container-page py-10 sm:py-12'>
          <Skeleton className='h-9 w-56' />
          <Skeleton className='mt-3 h-4 w-full max-w-xl' />
        </div>
      </div>

      <div className='container-page py-8 lg:py-10'>
        <div className='flex gap-8'>
          <aside className='hidden w-64 shrink-0 lg:block'>
            <div className='surface-card p-5'>
              <GearFiltersSkeleton />
            </div>
          </aside>

          <div className='min-w-0 flex-1'>
            <div className='mb-5 flex items-center justify-between'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-10 w-48 rounded-control' />
            </div>
            <GearGridSkeleton count={9} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GearBrowsePage() {
  return (
    <Suspense fallback={<GearBrowseSkeleton />}>
      <GearBrowseContent />
    </Suspense>
  );
}
