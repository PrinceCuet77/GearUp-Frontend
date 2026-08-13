import { Heart } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { ABOUT_VALUES } from '@/lib/site';

export function AboutValues() {
  return (
    <Section tone='card'>
      <SectionHeading
        eyebrow='What we stand for'
        eyebrowIcon={<Heart className='h-3.5 w-3.5' />}
        title='Four principles behind every product decision'
        description='They are not slogans - each one shows up somewhere concrete in how the platform behaves.'
      />

      <RevealGroup className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        {ABOUT_VALUES.map((value, index) => (
          <RevealItem key={value.title}>
            <div className='surface-card-interactive flex h-full gap-5 p-7'>
              <span
                className='text-3xl font-extrabold text-primary/25 tabular-nums'
                aria-hidden='true'
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className='text-base font-bold text-foreground'>
                  {value.title}
                </h3>
                <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                  {value.description}
                </p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
