import { Suspense } from 'react';
import GearBrowseContent from './GearBrowseContent';

// ── Loading skeleton ──────────────────────────────────────────────────────────

function GearBrowseSkeleton() {
  return (
    <div className='min-h-screen' style={{ backgroundColor: 'var(--background)' }}>
      {/* Header skeleton */}
      <div
        className='border-b'
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
      >
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div
            className='h-8 w-40 animate-pulse rounded-lg'
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <div
            className='mt-2 h-4 w-72 animate-pulse rounded'
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex gap-8'>
          {/* Sidebar skeleton */}
          <aside className='hidden w-64 shrink-0 lg:block'>
            <div
              className='rounded-2xl border p-5'
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className='mb-4 h-8 animate-pulse rounded-lg'
                  style={{ backgroundColor: 'var(--muted)' }}
                />
              ))}
            </div>
          </aside>

          {/* Grid skeleton */}
          <div className='min-w-0 flex-1'>
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className='animate-pulse overflow-hidden rounded-2xl border'
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div
                    className='aspect-[4/3]'
                    style={{ backgroundColor: 'var(--muted)' }}
                  />
                  <div className='p-4 space-y-2'>
                    <div className='h-4 w-3/4 rounded' style={{ backgroundColor: 'var(--muted)' }} />
                    <div className='h-3 w-full rounded' style={{ backgroundColor: 'var(--muted)' }} />
                    <div className='h-3 w-2/3 rounded' style={{ backgroundColor: 'var(--muted)' }} />
                    <div className='flex justify-between pt-2'>
                      <div className='h-6 w-16 rounded' style={{ backgroundColor: 'var(--muted)' }} />
                      <div className='h-8 w-16 rounded-xl' style={{ backgroundColor: 'var(--muted)' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GearBrowsePage() {
  return (
    <Suspense fallback={<GearBrowseSkeleton />}>
      <GearBrowseContent />
    </Suspense>
  );
}
