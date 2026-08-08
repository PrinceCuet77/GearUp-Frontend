'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Compass, Mountain } from 'lucide-react';

import { Container } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { SITE } from '@/lib/site';

export function AboutHero({ totalListings }: { totalListings: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className='relative overflow-hidden border-b border-border bg-background py-16 sm:py-20 lg:py-24'>
      <div
        className='pointer-events-none absolute inset-0 -z-10'
        aria-hidden='true'
      >
        <div
          className='absolute inset-0'
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 20% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)',
          }}
        />
        <div
          className='absolute inset-0'
          style={{
            background:
              'radial-gradient(ellipse 55% 50% at 90% 90%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 70%)',
          }}
        />
      </div>

      <Container>
        <div className='mx-auto max-w-3xl text-center'>
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='eyebrow border-accent/25 bg-accent-soft text-accent-soft-foreground'
          >
            <Compass className='h-3.5 w-3.5' aria-hidden='true' />
            About {SITE.name}
          </motion.span>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className='mt-6 text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]'
          >
            Great gear should be{' '}
            <span className='text-gradient-brand'>borrowed, not hoarded</span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className='mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg'
          >
            {SITE.name} connects people who want to get outdoors with people who
            already own the equipment. One marketplace, verified on both sides,
            built for how renting actually works in Bangladesh.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row'
          >
            <ButtonLink
              href='/gears'
              size='lg'
              trailingIcon={<ArrowRight className='h-4 w-4' />}
            >
              {totalListings > 0
                ? `Explore ${totalListings} listings`
                : 'Explore the catalogue'}
            </ButtonLink>
            <ButtonLink
              href='/register'
              size='lg'
              variant='outline'
              leadingIcon={<Mountain className='h-4 w-4' />}
            >
              Join {SITE.name}
            </ButtonLink>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
