import { ShieldCheck } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { VALUE_PROPS } from '@/lib/site';

const TONE_CLASS = {
  primary: 'bg-primary-soft text-primary',
  secondary: 'bg-secondary-soft text-secondary',
  accent: 'bg-accent-soft text-accent',
} as const;

export function WhyGearUpSection() {
  return (
    <Section id='why-gearup' tone='card'>
      <SectionHeading
        eyebrow='Why GearUp'
        eyebrowIcon={<ShieldCheck className='h-3.5 w-3.5' />}
        title='Built so both sides of the rental can relax'
        description='Renters get gear they can trust. Providers get orders they can manage. Everything else is plumbing we handle for you.'
      />

      <RevealGroup className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {VALUE_PROPS.map((prop) => {
          const Icon = prop.icon;
          return (
            <RevealItem key={prop.title}>
              <div className='surface-card-interactive flex h-full flex-col p-6'>
                <span
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${TONE_CLASS[prop.tone]}`}
                >
                  <Icon className='h-6 w-6' aria-hidden='true' />
                </span>
                <h3 className='text-base font-bold text-foreground'>
                  {prop.title}
                </h3>
                <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                  {prop.description}
                </p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
