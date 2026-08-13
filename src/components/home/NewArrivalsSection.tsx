import { ArrowRight, Clock3 } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import GearCard from '@/app/(public)/_components/GearCard';
import type { GearItem } from '@/lib/types';

/**
 * The most recently published listings. Hidden entirely when the catalogue is
 * too small for this to differ meaningfully from the featured grid.
 */
export function NewArrivalsSection({ gears }: { gears: GearItem[] }) {
  const visible = gears.slice(0, 3);
  if (visible.length < 3) return null;

  return (
    <Section id='new-arrivals' tone='subtle'>
      <SectionHeading
        align='left'
        eyebrow='Just listed'
        eyebrowIcon={<Clock3 className='h-3.5 w-3.5' />}
        title='Fresh out of the garage'
        description='The newest gear published by providers - usually the first to get booked for the weekend.'
        action={
          <ButtonLink
            href='/gears?sortBy=createdAt&sortOrder=desc'
            variant='outline'
            trailingIcon={<ArrowRight className='h-4 w-4' />}
          >
            See newest first
          </ButtonLink>
        }
      />

      <RevealGroup className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {visible.map((gear) => (
          <RevealItem key={gear.id}>
            <GearCard gear={gear} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
