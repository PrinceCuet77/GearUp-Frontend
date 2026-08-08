import { CategorySkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function AdminCategoriesLoading() {
  return (
    <div>
      {/* PageHeader skeleton */}
      <div className='mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <Skeleton className='h-8 w-36' />
          <Skeleton className='mt-1 h-4 w-28' />
        </div>
      </div>

      {/* Add button skeleton */}
      <div className='mb-4 flex justify-end'>
        <Skeleton className='h-10 w-36 rounded-lg' />
      </div>

      {/* Categories list skeleton */}
      <CategorySkeleton rows={5} />
    </div>
  );
}
