import { ArrowRight, Store, Users } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';

const AUDIENCES = [
  {
    icon: Users,
    tone: 'primary' as const,
    title: 'If you want to rent',
    intro:
      'Book equipment for exactly the days you need it, without owning any of it.',
    points: [
      'Filter the catalogue by category, price and availability',
      'See live stock and the real daily rate before you commit',
      'Pay only after the provider confirms your booking',
      'Track every order and payment from your dashboard',
    ],
    cta: { href: '/gears', label: 'Browse gear' },
  },
  {
    icon: Store,
    tone: 'secondary' as const,
    title: 'If you own the gear',
    intro:
      'Turn equipment that sits idle most of the year into steady rental income.',
    points: [
      'Publish listings with your own photos, stock and daily rate',
      'Approve or decline every incoming request yourself',
      'Move orders through confirm, pickup and return in one console',
      'Build a rating from customers who actually rented from you',
    ],
    cta: { href: '/register', label: 'Become a provider' },
  },
];

const TONE_CLASS = {
  primary: 'bg-primary-soft text-primary',
  secondary: 'bg-secondary-soft text-secondary',
} as const;

export function AboutAudience() {
  return (
    <Section tone='default'>
      <SectionHeading
        eyebrow='Two sides, one platform'
        title='Whichever side of the rental you are on'
        description='GearUp is the same marketplace for both — with a dashboard shaped around what each role actually needs to do.'
      />

      <RevealGroup className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {AUDIENCES.map((audience) => {
          const Icon = audience.icon;
          return (
            <RevealItem key={audience.title}>
              <div className='surface-card-interactive flex h-full flex-col p-7 sm:p-8'>
                <span
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${TONE_CLASS[audience.tone]}`}
                >
                  <Icon className='h-6 w-6' aria-hidden='true' />
                </span>

                <h3 className='text-xl font-bold text-foreground'>
                  {audience.title}
                </h3>
                <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                  {audience.intro}
                </p>

                <ul className='mt-6 space-y-3'>
                  {audience.points.map((point) => (
                    <li
                      key={point}
                      className='flex items-start gap-3 text-sm text-foreground'
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                          audience.tone === 'primary'
                            ? 'bg-primary'
                            : 'bg-secondary'
                        }`}
                        aria-hidden='true'
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className='mt-auto pt-8'>
                  <ButtonLink
                    href={audience.cta.href}
                    variant={
                      audience.tone === 'primary' ? 'primary' : 'secondary'
                    }
                    trailingIcon={<ArrowRight className='h-4 w-4' />}
                  >
                    {audience.cta.label}
                  </ButtonLink>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
