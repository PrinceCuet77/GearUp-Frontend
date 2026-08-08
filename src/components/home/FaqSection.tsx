import { HelpCircle, Mail } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { FAQ_ITEMS, SITE } from '@/lib/site';

export function FaqSection() {
  return (
    <Section id='faq' tone='card'>
      <div className='grid gap-10 lg:grid-cols-12 lg:gap-16'>
        <div className='lg:col-span-5'>
          <SectionHeading
            align='left'
            as='h2'
            eyebrow='FAQ'
            eyebrowIcon={<HelpCircle className='h-3.5 w-3.5' />}
            title='Questions renters ask us most'
            description='Everything below reflects how GearUp actually behaves — order states, payment timing, review rules and all.'
            className='mb-8 sm:mb-8'
          />

          <Reveal>
            <div className='surface-card flex items-start gap-4 p-5'>
              <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft'>
                <Mail className='h-5 w-5 text-primary' aria-hidden='true' />
              </span>
              <div>
                <p className='text-sm font-bold text-foreground'>
                  Still stuck on something?
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Email us at{' '}
                  <a
                    href={`mailto:${SITE.contact.email}`}
                    className='font-semibold text-primary hover:underline'
                  >
                    {SITE.contact.email}
                  </a>{' '}
                  — we reply {SITE.contact.hours.toLowerCase()}.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className='lg:col-span-7'>
          <Reveal direction='left'>
            <Accordion items={FAQ_ITEMS} defaultOpenId={FAQ_ITEMS[0]?.id} />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
