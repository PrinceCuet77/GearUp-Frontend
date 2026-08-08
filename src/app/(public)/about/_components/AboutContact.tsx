import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { SOCIAL_LINKS, SITE } from '@/lib/site';

const CHANNELS = [
  {
    icon: Mail,
    label: 'Email us',
    value: SITE.contact.email,
    href: `mailto:${SITE.contact.email}`,
    tone: 'primary' as const,
  },
  {
    icon: Phone,
    label: 'Call the support line',
    value: SITE.contact.phone,
    href: SITE.contact.phoneHref,
    tone: 'secondary' as const,
  },
  {
    icon: MapPin,
    label: 'Visit the office',
    value: SITE.contact.address,
    href: null,
    tone: 'accent' as const,
  },
  {
    icon: Clock,
    label: 'Support hours',
    value: SITE.contact.hours,
    href: null,
    tone: 'primary' as const,
  },
];

const TONE_CLASS = {
  primary: 'bg-primary-soft text-primary',
  secondary: 'bg-secondary-soft text-secondary',
  accent: 'bg-accent-soft text-accent',
} as const;

export function AboutContact() {
  return (
    <Section id='contact' tone='default'>
      <SectionHeading
        eyebrow='Get in touch'
        eyebrowIcon={<MessageCircle className='h-3.5 w-3.5' />}
        title='Talk to a person, not a ticket queue'
        description='Questions about a booking, a listing or an account? Any of these reach the same small team.'
      />

      <RevealGroup className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {CHANNELS.map((channel) => {
          const Icon = channel.icon;
          const content = (
            <div className='surface-card-interactive flex h-full flex-col gap-4 p-6'>
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${TONE_CLASS[channel.tone]}`}
              >
                <Icon className='h-5 w-5' aria-hidden='true' />
              </span>
              <div>
                <p className='text-xs font-bold tracking-wide text-muted-foreground uppercase'>
                  {channel.label}
                </p>
                <p className='mt-1.5 text-sm leading-relaxed font-semibold text-foreground'>
                  {channel.value}
                </p>
              </div>
            </div>
          );

          return (
            <RevealItem key={channel.label}>
              {channel.href ? (
                <a href={channel.href} className='block h-full'>
                  {content}
                </a>
              ) : (
                content
              )}
            </RevealItem>
          );
        })}
      </RevealGroup>

      <div className='mt-10 flex flex-col items-center gap-4 border-t border-border pt-10 sm:flex-row sm:justify-between'>
        <p className='text-sm text-muted-foreground'>
          Prefer social? {SITE.name} is on these platforms too.
        </p>
        <ul className='flex items-center gap-2'>
          {SOCIAL_LINKS.map((social) => {
            const Icon = social.icon;
            return (
              <li key={social.label}>
                <a
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={`${SITE.name} on ${social.label}`}
                  className='flex h-10 w-10 items-center justify-center rounded-control border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary'
                >
                  <Icon className='h-4 w-4' />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
