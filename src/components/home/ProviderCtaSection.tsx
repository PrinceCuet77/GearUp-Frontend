import { ArrowRight, BarChart3, CalendarCheck2, Wallet } from 'lucide-react';

import { Container } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';

const PROVIDER_PERKS = [
  {
    icon: Wallet,
    title: 'Set your own daily rate',
    description:
      'Price each listing yourself in Taka and change it whenever demand shifts.',
  },
  {
    icon: CalendarCheck2,
    title: 'Approve every booking',
    description:
      'Orders arrive as Placed. Nothing is charged until you confirm the request.',
  },
  {
    icon: BarChart3,
    title: 'Track it in one dashboard',
    description:
      'Listings, incoming orders, pickups and returns — all in the provider console.',
  },
];

export function ProviderCtaSection() {
  return (
    <section className='section-y bg-background-subtle'>
      <Container>
        <Reveal>
          <div className='relative overflow-hidden rounded-card border border-border shadow-lg'>
            {/* Brand gradient built from the three palette colours only */}
            <div
              className='absolute inset-0'
              style={{
                background:
                  'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 45%, var(--accent)) 55%, var(--accent) 100%)',
              }}
              aria-hidden='true'
            />
            <div
              className='absolute -top-24 -right-16 h-72 w-72 rounded-full opacity-40 blur-3xl'
              style={{ backgroundColor: 'var(--secondary)' }}
              aria-hidden='true'
            />

            <div className='relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:gap-14'>
              <div>
                <span className='inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold tracking-wide text-white uppercase backdrop-blur-sm'>
                  For providers
                </span>
                <h2 className='mt-5 text-3xl font-extrabold tracking-tight text-balance text-white sm:text-4xl'>
                  Your gear is worth more than storage space
                </h2>
                <p className='mt-4 max-w-lg text-base leading-relaxed text-white/85'>
                  List the bike, tent or kayak you use a handful of weekends a
                  year and let it earn the rest of the time. Registering as a
                  provider takes a minute and costs nothing.
                </p>
                <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                  <ButtonLink
                    href='/register'
                    size='lg'
                    className='!bg-white !text-primary hover:!bg-white/90'
                    trailingIcon={<ArrowRight className='h-4 w-4' />}
                  >
                    Become a provider
                  </ButtonLink>
                  <ButtonLink
                    href='/about'
                    size='lg'
                    variant='outline'
                    className='!border-white/40 !text-white hover:!bg-white/10 hover:!text-white'
                  >
                    How GearUp works
                  </ButtonLink>
                </div>
              </div>

              <ul className='flex flex-col gap-3'>
                {PROVIDER_PERKS.map((perk) => {
                  const Icon = perk.icon;
                  return (
                    <li
                      key={perk.title}
                      className='flex items-start gap-4 rounded-card bg-white/12 p-5 backdrop-blur-sm'
                    >
                      <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20'>
                        <Icon className='h-5 w-5 text-white' aria-hidden='true' />
                      </span>
                      <div>
                        <p className='text-sm font-bold text-white'>
                          {perk.title}
                        </p>
                        <p className='mt-1 text-sm leading-relaxed text-white/80'>
                          {perk.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
