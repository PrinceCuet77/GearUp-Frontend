import { ArrowRight, PackageSearch, Sparkles } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import GearCard from '@/app/(public)/_components/GearCard';
import type { GearItem } from '@/lib/types';

export function FeaturedGearSection({ gears }: { gears: GearItem[] }) {
  return (
    <Section id='featured' tone='card'>
      <SectionHeading
        align='left'
        eyebrow='Featured'
        eyebrowIcon={<Sparkles className='h-3.5 w-3.5' />}
        title='Top-rated gear this season'
        description='Ranked by verified renter reviews - the kit people actually came back and recommended.'
        action={
          <ButtonLink
            href='/gears'
            variant='outline'
            trailingIcon={<ArrowRight className='h-4 w-4' />}
          >
            See everything
          </ButtonLink>
        }
      />

      {gears.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title='No listings to feature yet'
          description='As soon as providers publish gear it will show up here, ranked by renter reviews.'
          action={
            <ButtonLink href='/register' size='sm'>
              List your gear
            </ButtonLink>
          }
        />
      ) : (
        <>
          <RevealGroup className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {gears.map((gear) => (
              <RevealItem key={gear.id}>
                <GearCard gear={gear} />
              </RevealItem>
            ))}
          </RevealGroup>

          <div className='mt-10 flex justify-center sm:hidden'>
            <ButtonLink
              href='/gears'
              fullWidth
              trailingIcon={<ArrowRight className='h-4 w-4' />}
            >
              Browse all gear
            </ButtonLink>
          </div>
        </>
      )}
    </Section>
  );
}
