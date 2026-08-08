import { Route } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { HOW_IT_WORKS } from '@/lib/site';

const TONE_CLASS = {
  primary: 'bg-primary-soft text-primary',
  secondary: 'bg-secondary-soft text-secondary',
  accent: 'bg-accent-soft text-accent',
} as const;

const STEP_BADGE_CLASS = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
} as const;

export function HowItWorksSection() {
  return (
    <Section id='how-it-works' tone='default'>
      <SectionHeading
        eyebrow='How it works'
        eyebrowIcon={<Route className='h-3.5 w-3.5' />}
        title='Four steps from browsing to riding'
        description='The same flow every rental follows, tracked end to end in your dashboard.'
      />

      <div className='relative'>
        {/* Connector line behind the cards on wide screens */}
        <div
          className='absolute top-16 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block'
          aria-hidden='true'
        />

        <RevealGroup
          className='relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
          stagger={0.1}
        >
          {HOW_IT_WORKS.map((step) => {
            const Icon = step.icon;
            return (
              <RevealItem key={step.step}>
                <div className='surface-card-interactive flex h-full flex-col p-6'>
                  <div className='mb-5 flex items-center justify-between'>
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${TONE_CLASS[step.tone]}`}
                    >
                      <Icon className='h-6 w-6' aria-hidden='true' />
                    </span>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${STEP_BADGE_CLASS[step.tone]}`}
                      aria-hidden='true'
                    >
                      {step.step}
                    </span>
                  </div>
                  <h3 className='text-base font-bold text-foreground'>
                    {step.title}
                  </h3>
                  <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                    {step.description}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}
