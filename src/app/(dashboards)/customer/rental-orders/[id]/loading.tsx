import { Calendar, Package, CreditCard, Receipt } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function OrderDetailLoading() {
  return (
    <div className='mx-auto max-w-3xl'>
      {/* Back link skeleton */}
      <div className='mb-6 inline-flex items-center gap-1.5'>
        <Skeleton className='h-4 w-4 rounded' />
        <Skeleton className='h-4 w-28 rounded' />
      </div>

      {/* Header skeleton */}
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <Skeleton className='h-8 w-48 rounded' />
          <Skeleton className='mt-2 h-4 w-56 rounded' />
        </div>
        <Skeleton className='h-6 w-24 rounded-full' />
      </div>

      {/* Actions skeleton */}
      <div className='mb-6 flex flex-wrap justify-end gap-3'>
        <Skeleton className='h-10 w-28 rounded-lg' />
        <Skeleton className='h-10 w-32 rounded-lg' />
      </div>

      {/* Cards grid skeleton */}
      <div className='grid gap-4 sm:grid-cols-2'>
        {/* Rental period card */}
        <div className='surface-card p-5'>
          <div className='mb-3 flex items-center gap-2'>
            <Calendar className='h-4 w-4' style={{ color: 'var(--primary)' }} />
            <Skeleton className='h-4 w-28 rounded' />
          </div>
          <Skeleton className='h-4 w-full rounded' />
          <Skeleton className='mt-2 h-4 w-3/4 rounded' />
        </div>

        {/* Total amount card */}
        <div className='surface-card p-5'>
          <div className='mb-3 flex items-center gap-2'>
            <CreditCard className='h-4 w-4 text-accent' />
            <Skeleton className='h-4 w-28 rounded' />
          </div>
          <Skeleton className='h-8 w-24 rounded' />
          <Skeleton className='mt-2 h-4 w-20 rounded' />
        </div>
      </div>

      {/* Items list skeleton */}
      <div className='mt-4 surface-card'>
        <div
          className='flex items-center gap-2 border-b px-5 py-4'
          style={{ borderColor: 'var(--border)' }}
        >
          <Package className='h-4 w-4' style={{ color: 'var(--primary)' }} />
          <Skeleton className='h-4 w-28 rounded' />
        </div>
        {[1, 2].map((i) => (
          <div
            key={i}
            className='flex gap-4 px-5 py-4'
            style={{
              borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
            }}
          >
            {/* Thumbnail skeleton */}
            <div
              className='h-20 w-20 shrink-0 rounded-lg'
              style={{ backgroundColor: 'var(--muted)' }}
            />
            {/* Details skeleton */}
            <div className='flex flex-1 flex-col justify-between'>
              <div>
                <Skeleton className='h-4 w-40 rounded' />
                <Skeleton className='mt-1.5 h-3 w-56 rounded' />
              </div>
              <div className='mt-2 flex items-center gap-3'>
                <Skeleton className='h-3 w-16 rounded' />
                <Skeleton className='h-3 w-20 rounded' />
                <Skeleton className='h-3 w-12 rounded' />
              </div>
            </div>
            {/* Price skeleton */}
            <div className='flex flex-col items-end justify-between'>
              <Skeleton className='h-4 w-20 rounded' />
              <Skeleton className='h-3 w-12 rounded' />
            </div>
          </div>
        ))}
      </div>

      {/* Payment History skeleton */}
      <div className='mt-4 surface-card'>
        <div
          className='flex items-center gap-2 border-b px-5 py-4'
          style={{ borderColor: 'var(--border)' }}
        >
          <Receipt className='h-4 w-4 text-accent' />
          <Skeleton className='h-4 w-32 rounded' />
        </div>
        {[1].map((i) => (
          <div key={i} className='flex items-center justify-between px-5 py-4'>
            <div className='flex flex-col gap-1'>
              <Skeleton className='h-4 w-44 rounded' />
              <Skeleton className='h-3 w-36 rounded' />
            </div>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-5 w-20 rounded-full' />
              <Skeleton className='h-4 w-20 rounded' />
            </div>
          </div>
        ))}
      </div>

      {/* Reviews skeleton - mirrors the "No reviews yet" empty state */}
      <div className='mt-4 surface-card'>
        <div
          className='flex items-center gap-2 border-b px-5 py-4'
          style={{ borderColor: 'var(--border)' }}
        >
          <Receipt className='h-4 w-4' style={{ color: 'var(--primary)' }} />
          <Skeleton className='h-4 w-24 rounded' />
        </div>
        <div className='flex flex-col items-center justify-center px-5 py-10'>
          <Receipt
            className='mb-3 h-10 w-10'
            style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}
          />
          <Skeleton className='h-4 w-32 rounded' />
          <Skeleton className='mt-2 h-3 w-48 rounded' />
        </div>
      </div>
    </div>
  );
}
