import { ArrowLeft, Calendar, Package, CreditCard } from 'lucide-react';
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

      {/* Cards grid skeleton */}
      <div className='grid gap-4 sm:grid-cols-2'>
        {/* Rental period card */}
        <div
          className='rounded-xl border p-5'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <div className='mb-3 flex items-center gap-2'>
            <Calendar className='h-4 w-4' style={{ color: 'var(--primary)' }} />
            <Skeleton className='h-4 w-28 rounded' />
          </div>
          <Skeleton className='h-4 w-full rounded' />
          <Skeleton className='mt-2 h-4 w-3/4 rounded' />
        </div>

        {/* Payment card */}
        <div
          className='rounded-xl border p-5'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <div className='mb-3 flex items-center gap-2'>
            <CreditCard className='h-4 w-4' style={{ color: '#7c3aed' }} />
            <Skeleton className='h-4 w-20 rounded' />
          </div>
          <Skeleton className='h-8 w-24 rounded' />
          <Skeleton className='mt-2 h-4 w-32 rounded' />
        </div>
      </div>

      {/* Items list skeleton */}
      <div
        className='mt-4 rounded-xl border'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className='flex items-center gap-2 border-b px-5 py-4'
          style={{ borderColor: 'var(--border)' }}
        >
          <Package className='h-4 w-4' style={{ color: 'var(--primary)' }} />
          <Skeleton className='h-4 w-28 rounded' />
        </div>
        {[1].map((i) => (
          <div
            key={i}
            className='flex items-center justify-between px-5 py-4'
            style={{ borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}
          >
            <div>
              <Skeleton className='h-4 w-40 rounded' />
              <Skeleton className='mt-1 h-3 w-16 rounded' />
            </div>
            <Skeleton className='h-4 w-20 rounded' />
          </div>
        ))}
      </div>

      {/* Actions skeleton */}
      <div className='mt-6 flex flex-wrap gap-3'>
        <Skeleton className='h-10 w-28 rounded-lg' />
        <Skeleton className='h-10 w-32 rounded-lg' />
      </div>
    </div>
  );
}
