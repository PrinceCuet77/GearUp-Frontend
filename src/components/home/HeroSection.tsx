'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Compass,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';

import type { Category, GearItem } from '@/lib/types';
import { calcAvgRating, formatBDT, parseGearImages } from '@/lib/gear-utils';
import { cn } from '@/lib/cn';
import { ButtonLink } from '@/components/ui/Button';

const SLIDE_DURATION_MS = 5000;

export interface HeroSectionProps {
  /** Highest-rated listings, used for the rotating showcase. */
  slides: GearItem[];
  /** Shown as one-tap filters under the search box. */
  categories: Category[];
  totalListings: number;
}

export function HeroSection({
  slides,
  categories,
  totalListings,
}: HeroSectionProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState('');
  const timerRef = useRef<number | null>(null);

  const showcase = useMemo(() => slides.slice(0, 4), [slides]);
  const hasShowcase = showcase.length > 0;

  const goTo = useCallback(
    (next: number) => {
      if (!hasShowcase) return;
      setIndex(((next % showcase.length) + showcase.length) % showcase.length);
    },
    [hasShowcase, showcase.length],
  );

  // Auto-advance, paused on hover/focus and when the tab is hidden.
  useEffect(() => {
    if (!hasShowcase || paused || reduceMotion || showcase.length < 2) return;
    timerRef.current = window.setInterval(
      () => setIndex((i) => (i + 1) % showcase.length),
      SLIDE_DURATION_MS,
    );
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [hasShowcase, paused, reduceMotion, showcase.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed ? `/gears?search=${encodeURIComponent(trimmed)}` : '/gears',
    );
  };

  const active = hasShowcase ? showcase[index] : null;

  return (
    <section
      className='relative flex items-center overflow-hidden border-b border-border bg-background py-14 sm:py-16 lg:h-[68vh] lg:max-h-[780px] lg:min-h-[560px] lg:py-0'
      aria-label='Rent sports and outdoor gear'
    >
      {/* Ambient background - three brand colours only */}
      <div
        className='pointer-events-none absolute inset-0 -z-10'
        aria-hidden='true'
      >
        <div
          className='absolute inset-0'
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 15% 0%, color-mix(in srgb, var(--primary) 20%, transparent), transparent 70%)',
          }}
        />
        <div
          className='absolute inset-0'
          style={{
            background:
              'radial-gradient(ellipse 60% 55% at 95% 100%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)',
          }}
        />
        <motion.div
          className='absolute top-1/4 right-1/3 h-64 w-64 rounded-full blur-3xl'
          style={{
            backgroundColor:
              'color-mix(in srgb, var(--secondary) 14%, transparent)',
          }}
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -24, 0], opacity: [0.6, 1, 0.6] }
          }
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className='container-page'>
        <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-14'>
          {/* Copy */}
          <div className='max-w-xl'>
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className='eyebrow border-primary/25 bg-primary-soft text-primary-soft-foreground'
            >
              <Sparkles className='h-3.5 w-3.5' aria-hidden='true' />
              {totalListings > 0
                ? `${totalListings} listings ready to rent`
                : 'Sports & outdoor gear rental'}
            </motion.span>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className='mt-5 text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-foreground sm:text-5xl lg:text-[3.4rem]'
            >
              Rent the gear.{' '}
              <span className='text-gradient-brand'>Keep the adventure.</span>
            </motion.h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className='mt-5 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg'
            >
              Bikes, tents, kayaks and climbing kit from verified providers
              across Bangladesh - booked by the day, paid securely, reviewed by
              people who actually used them.
            </motion.p>

            {/* Search */}
            <motion.form
              onSubmit={handleSearch}
              role='search'
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className='mt-7 flex flex-col gap-2.5 sm:flex-row'
            >
              <label htmlFor='hero-search' className='sr-only'>
                Search gear
              </label>
              <div className='relative flex-1'>
                <Search
                  className='pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground'
                  aria-hidden='true'
                />
                <input
                  id='hero-search'
                  type='search'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Search mountain bikes, tents, kayaks…'
                  className='field-input h-12 pl-11 shadow-sm'
                />
              </div>
              <button
                type='submit'
                className='btn btn-primary h-12 px-6 text-sm'
              >
                Search gear
                <ArrowRight className='h-4 w-4' aria-hidden='true' />
              </button>
            </motion.form>

            {/* Quick category filters */}
            {categories.length > 0 && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.26 }}
                className='mt-4 flex flex-wrap items-center gap-2'
              >
                <span className='text-xs font-semibold text-muted-foreground'>
                  Popular:
                </span>
                {categories.slice(0, 4).map((category) => (
                  <Link
                    key={category.id}
                    href={`/gears?category=${encodeURIComponent(category.name)}`}
                    className='rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary'
                  >
                    {category.name}
                  </Link>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className='mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground'
            >
              <span className='flex items-center gap-2'>
                <ShieldCheck
                  className='h-4 w-4 text-secondary'
                  aria-hidden='true'
                />
                Secure SSLCommerz payments
              </span>
              <span className='flex items-center gap-2'>
                <Star className='h-4 w-4 text-warning' aria-hidden='true' />
                Reviews from verified rentals
              </span>
            </motion.div>
          </div>

          {/* Showcase */}
          {hasShowcase && active ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='relative hidden lg:block'
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocusCapture={() => setPaused(true)}
              onBlurCapture={() => setPaused(false)}
            >
              <div
                className='relative aspect-4/3 w-full overflow-hidden rounded-card border border-border shadow-xl'
                aria-live='polite'
              >
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={active.id}
                    initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className='absolute inset-0'
                  >
                    <Image
                      src={parseGearImages(active.images)[0]}
                      alt={active.name}
                      fill
                      priority
                      sizes='(max-width: 1024px) 0px, 50vw'
                      className='object-cover'
                    />
                  </motion.div>
                </AnimatePresence>

                <div
                  className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent'
                  aria-hidden='true'
                />

                {/* Slide caption */}
                <div className='absolute inset-x-0 bottom-0 p-6'>
                  <span className='inline-flex rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground'>
                    {active.category?.name ?? 'Featured'}
                  </span>
                  <Link
                    href={`/gears/${active.id}`}
                    className='mt-3 block text-xl font-bold text-white transition-opacity hover:opacity-85'
                  >
                    {active.name}
                  </Link>
                  <div className='mt-2 flex items-center gap-4 text-sm text-white/85'>
                    <span className='font-bold text-white'>
                      {formatBDT(active.price)}
                      <span className='font-medium text-white/70'> / day</span>
                    </span>
                    {(active.reviews?.length ?? 0) > 0 && (
                      <span className='flex items-center gap-1.5'>
                        <Star
                          className='h-3.5 w-3.5 text-warning'
                          fill='currentColor'
                          aria-hidden='true'
                        />
                        {calcAvgRating(active.reviews).toFixed(1)} (
                        {active.reviews?.length})
                      </span>
                    )}
                  </div>
                </div>

                {/* Slide controls */}
                {showcase.length > 1 && (
                  <div className='absolute top-4 right-4 flex gap-1.5'>
                    {showcase.map((slide, i) => (
                      <button
                        key={slide.id}
                        type='button'
                        onClick={() => goTo(i)}
                        aria-label={`Show ${slide.name}`}
                        aria-current={i === index}
                        className={cn(
                          'h-1.5 cursor-pointer rounded-full transition-all duration-300',
                          i === index
                            ? 'w-7 bg-white'
                            : 'w-1.5 bg-white/50 hover:bg-white/80',
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Floating stat card */}
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className='surface-card absolute -bottom-6 -left-6 flex items-center gap-3 px-4 py-3 shadow-lg'
              >
                <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-soft'>
                  <Compass
                    className='h-5 w-5 text-secondary'
                    aria-hidden='true'
                  />
                </span>
                <div>
                  <p className='text-sm font-extrabold text-foreground'>
                    {categories.length} categories
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    From trail to tide
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className='hidden lg:block'>
              <div className='surface-card flex aspect-4/3 flex-col items-center justify-center gap-4 p-10 text-center'>
                <span className='flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft'>
                  <Compass
                    className='h-7 w-7 text-primary'
                    aria-hidden='true'
                  />
                </span>
                <p className='text-base font-bold text-foreground'>
                  The catalogue is warming up
                </p>
                <p className='max-w-xs text-sm text-muted-foreground'>
                  New listings appear here as soon as providers publish them.
                </p>
                <ButtonLink href='/gears' variant='outline' size='sm'>
                  Open the catalogue
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
