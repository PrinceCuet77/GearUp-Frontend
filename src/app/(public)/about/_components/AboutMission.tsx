import Image from 'next/image';
import { Target } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { parseGearImages } from '@/lib/gear-utils';
import type { GearItem } from '@/lib/types';

const MISSION_POINTS = [
  {
    heading: 'The problem we started with',
    body: 'Good outdoor equipment is expensive, bulky and used a handful of times a year. Most people either overspend on kit they barely touch, or skip the trip entirely.',
  },
  {
    heading: 'What we built instead',
    body: 'A marketplace where owners list what they already have and renters book it by the day. Providers are approved before their listings go live, and every order is tracked from request to return.',
  },
  {
    heading: 'How we keep it honest',
    body: 'Only customers who completed a rental can leave a review, payments are only taken after a provider confirms, and an admin team can suspend accounts that break trust.',
  },
];

/**
 * Mission narrative paired with a real listing photo — no stock imagery, so
 * the page always reflects gear that genuinely exists on the platform.
 */
export function AboutMission({ showcase }: { showcase: GearItem | null }) {
  const image = showcase ? parseGearImages(showcase.images)[0] : null;

  return (
    <Section tone='card'>
      <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-16'>
        <Reveal direction='right'>
          <SectionHeading
            align='left'
            eyebrow='Our mission'
            eyebrowIcon={<Target className='h-3.5 w-3.5' />}
            title='Put more gear in use and less of it in storage'
            className='mb-8 sm:mb-8'
          />

          <ol className='space-y-6'>
            {MISSION_POINTS.map((point, index) => (
              <li key={point.heading} className='flex gap-4'>
                <span
                  className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-extrabold text-primary'
                  aria-hidden='true'
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className='text-base font-bold text-foreground'>
                    {point.heading}
                  </h3>
                  <p className='mt-1.5 text-sm leading-relaxed text-muted-foreground'>
                    {point.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        {image && showcase && (
          <Reveal direction='left'>
            <div className='relative aspect-4/3 overflow-hidden rounded-card border border-border shadow-lg'>
              <Image
                src={image}
                alt={showcase.name}
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                className='object-cover'
              />
              <div
                className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent'
                aria-hidden='true'
              />
              <p className='absolute inset-x-0 bottom-0 p-6 text-sm font-semibold text-white'>
                {showcase.name}
                <span className='mt-1 block text-xs font-medium text-white/70'>
                  Listed by {showcase.provider?.name ?? 'a GearUp provider'}
                </span>
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
