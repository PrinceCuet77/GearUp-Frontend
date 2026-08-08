import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Layers, Package } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatBDT, parseGearImages } from '@/lib/gear-utils';
import type { CategoryHighlight } from '@/lib/home-data';

export function CategoriesSection({
  categories,
}: {
  categories: CategoryHighlight[];
}) {
  const visible = categories.slice(0, 8);

  return (
    <Section id='categories' tone='default'>
      <SectionHeading
        align='left'
        eyebrow='Categories'
        eyebrowIcon={<Layers className='h-3.5 w-3.5' />}
        title='Start with what you need'
        description='Every category is curated by our admin team, so listings stay where renters expect to find them.'
        action={
          <ButtonLink
            href='/gears'
            variant='outline'
            trailingIcon={<ArrowRight className='h-4 w-4' />}
          >
            Browse all gear
          </ButtonLink>
        }
      />

      {visible.length === 0 ? (
        <EmptyState
          icon={Layers}
          title='Categories are on their way'
          description='Once the admin team publishes categories they will appear here with live listing counts.'
          action={
            <ButtonLink href='/gears' variant='outline' size='sm'>
              Open the catalogue
            </ButtonLink>
          }
        />
      ) : (
        <RevealGroup className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {visible.map((category) => {
            const image = category.image
              ? parseGearImages(category.image)[0]
              : null;

            return (
              <RevealItem key={category.id}>
                <Link
                  href={`/gears?category=${encodeURIComponent(category.name)}`}
                  className='surface-card-interactive group flex h-full flex-col overflow-hidden'
                >
                  <div className='relative aspect-16/10 w-full overflow-hidden bg-muted'>
                    {image ? (
                      <Image
                        src={image}
                        alt=''
                        fill
                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    ) : (
                      <span className='flex h-full w-full items-center justify-center'>
                        <Package
                          className='h-8 w-8 text-muted-foreground'
                          aria-hidden='true'
                        />
                      </span>
                    )}
                    <div
                      className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'
                      aria-hidden='true'
                    />
                    <span className='absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-900'>
                      {category.listingCount} listing
                      {category.listingCount === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className='flex flex-1 flex-col p-5'>
                    <h3 className='line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary'>
                      {category.name}
                    </h3>
                    <p className='mt-1.5 line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground'>
                      {category.description ??
                        `Browse every ${category.name.toLowerCase()} listing available to rent right now.`}
                    </p>
                    <p className='mt-auto flex items-center gap-1.5 pt-4 text-sm font-bold text-primary'>
                      {category.fromPrice !== null ? (
                        <>From {formatBDT(category.fromPrice)}/day</>
                      ) : (
                        <>Explore category</>
                      )}
                      <ArrowRight
                        className='h-3.5 w-3.5 transition-transform group-hover:translate-x-1'
                        aria-hidden='true'
                      />
                    </p>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      )}
    </Section>
  );
}
