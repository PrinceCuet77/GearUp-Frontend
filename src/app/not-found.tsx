import Link from 'next/link';
import { Compass, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main
      className='flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center'
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Big 404 */}
      <div className='relative mb-8 select-none'>
        <span
          className='text-[9rem] font-black leading-none tracking-tighter sm:text-[12rem]'
          style={{ color: 'var(--muted-foreground)', opacity: 0.15 }}
        >
          404
        </span>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-lg'>
            <Compass
              className='h-10 w-10 text-primary-foreground'
              aria-hidden='true'
            />
          </div>
        </div>
      </div>

      {/* Message */}
      <h1
        className='mb-3 text-3xl font-bold tracking-tight sm:text-4xl'
        style={{ color: 'var(--foreground)' }}
      >
        Page not found
      </h1>
      <p
        className='mb-10 max-w-md text-base leading-relaxed'
        style={{ color: 'var(--muted-foreground)' }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Double-check the URL or use one of the links below to get back on track.
      </p>

      {/* Actions */}
      <div className='flex flex-wrap items-center justify-center gap-3'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 rounded-control bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Home
        </Link>
        <Link
          href='/gears'
          className='inline-flex items-center gap-2 surface-card px-6 py-3 text-sm font-semibold transition-colors hover:opacity-80'
        >
          <Search className='h-4 w-4' />
          Browse Gear
        </Link>
      </div>

      {/* Decorative divider */}
      <div className='mt-8 flex items-center gap-3'>
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className='h-1.5 w-1.5 rounded-full'
            style={{ backgroundColor: 'var(--border)' }}
          />
        ))}
      </div>
      <p
        className='mt-4 text-xs'
        style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}
      >
        If you think this is a mistake, please contact support.
      </p>
    </main>
  );
}
