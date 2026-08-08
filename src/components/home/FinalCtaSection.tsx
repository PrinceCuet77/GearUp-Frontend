import { ArrowRight, Compass, UserPlus } from 'lucide-react';

import { Container } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';

export function FinalCtaSection({ totalListings }: { totalListings: number }) {
  return (
    <section className='section-y bg-card'>
      <Container>
        <Reveal>
          <div className='relative overflow-hidden rounded-card border border-border bg-background-subtle px-6 py-14 text-center sm:px-12 sm:py-16'>
            <div
              className='pointer-events-none absolute inset-0'
              style={{
                background:
                  'radial-gradient(ellipse 60% 80% at 50% 0%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 70%)',
              }}
              aria-hidden='true'
            />

            <div className='relative mx-auto max-w-2xl'>
              <span className='eyebrow border-primary/25 bg-primary-soft text-primary-soft-foreground'>
                <Compass className='h-3.5 w-3.5' aria-hidden='true' />
                Ready when you are
              </span>

              <h2 className='mt-6 text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl'>
                Your next trip does not need a bigger garage
              </h2>

              <p className='mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg'>
                {totalListings > 0
                  ? `Browse ${totalListings} listings from verified providers, book the dates you need, and pay only when your booking is confirmed.`
                  : 'Create a free account to book gear the moment providers publish it, or list your own kit and start earning.'}
              </p>

              <div className='mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row'>
                <ButtonLink
                  href='/gears'
                  size='lg'
                  trailingIcon={<ArrowRight className='h-4 w-4' />}
                >
                  Browse the catalogue
                </ButtonLink>
                <ButtonLink
                  href='/register'
                  size='lg'
                  variant='outline'
                  leadingIcon={<UserPlus className='h-4 w-4' />}
                >
                  Create a free account
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
