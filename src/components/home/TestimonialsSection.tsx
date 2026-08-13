import Link from 'next/link';
import Image from 'next/image';
import { Quote } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Rating } from '@/components/ui/Rating';
import { formatShortDate } from '@/lib/gear-utils';
import type { Testimonial } from '@/lib/home-data';

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Renders real reviews pulled from the catalogue. Renders nothing at all when
 * there are none - an empty testimonial wall is better than an invented one.
 */
export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <Section id='testimonials' tone='default'>
      <SectionHeading
        eyebrow='Renter stories'
        eyebrowIcon={<Quote className='h-3.5 w-3.5' />}
        title='Reviews from completed rentals'
        description='Every quote below comes from a customer who finished a rental order on GearUp - the only people our platform lets review.'
      />

      <RevealGroup className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {testimonials.map((testimonial) => (
          <RevealItem key={testimonial.id}>
            <figure className='surface-card-interactive flex h-full flex-col p-6'>
              <Quote className='h-7 w-7 text-primary/35' aria-hidden='true' />

              <Rating
                value={testimonial.rating}
                size='sm'
                starsOnly
                className='mt-4'
              />

              <blockquote className='mt-3 line-clamp-5 flex-1 text-sm leading-relaxed text-foreground'>
                “{testimonial.comment}”
              </blockquote>

              <figcaption className='mt-5 flex items-center gap-3 border-t border-border pt-5'>
                {testimonial.authorAvatar ? (
                  <Image
                    src={testimonial.authorAvatar}
                    alt=''
                    width={40}
                    height={40}
                    unoptimized
                    className='h-10 w-10 shrink-0 rounded-full object-cover'
                  />
                ) : (
                  <span
                    className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent'
                    aria-hidden='true'
                  >
                    {initials(testimonial.authorName)}
                  </span>
                )}
                <div className='min-w-0'>
                  <p className='truncate text-sm font-bold text-foreground'>
                    {testimonial.authorName}
                  </p>
                  <p className='truncate text-xs text-muted-foreground'>
                    Rented{' '}
                    <Link
                      href={`/gears/${testimonial.gearId}`}
                      className='font-medium text-primary hover:underline'
                    >
                      {testimonial.gearName}
                    </Link>{' '}
                    · {formatShortDate(testimonial.createdAt)}
                  </p>
                </div>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
