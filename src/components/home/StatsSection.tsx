import type { LucideIcon } from 'lucide-react';
import { Layers, Package, Star, Store } from 'lucide-react';

import { Section } from '@/components/ui/Section';
import { CountUp } from '@/components/ui/CountUp';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import type { PlatformStats } from '@/lib/home-data';

interface StatDefinition {
  key: keyof PlatformStats;
  label: string;
  caption: string;
  icon: LucideIcon;
  tone: 'primary' | 'secondary' | 'accent';
  decimals?: number;
  suffix?: string;
}

const TONE_CLASS: Record<StatDefinition['tone'], string> = {
  primary: 'bg-primary-soft text-primary',
  secondary: 'bg-secondary-soft text-secondary',
  accent: 'bg-accent-soft text-accent',
};

const STATS: StatDefinition[] = [
  {
    key: 'totalListings',
    label: 'Gear listings live',
    caption: 'Published and bookable right now',
    icon: Package,
    tone: 'primary',
  },
  {
    key: 'totalCategories',
    label: 'Rental categories',
    caption: 'From cycling to water sports',
    icon: Layers,
    tone: 'accent',
  },
  {
    key: 'totalProviders',
    label: 'Verified providers',
    caption: 'Approved before listings go live',
    icon: Store,
    tone: 'secondary',
  },
  {
    key: 'averageRating',
    label: 'Average rating',
    caption: 'From completed rentals only',
    icon: Star,
    tone: 'primary',
    decimals: 1,
    suffix: ' / 5',
  },
];

export function StatsSection({ stats }: { stats: PlatformStats }) {
  return (
    <Section tone='card' className='!py-12 lg:!py-14'>
      <RevealGroup className='grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6'>
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const value = stats[stat.key];

          return (
            <RevealItem key={stat.key}>
              <div className='surface-card flex h-full flex-col gap-3 p-5 lg:p-6'>
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${TONE_CLASS[stat.tone]}`}
                >
                  <Icon className='h-5 w-5' aria-hidden='true' />
                </span>
                <p className='text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl'>
                  <CountUp
                    value={value}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                  />
                </p>
                <div>
                  <p className='text-sm font-bold text-foreground'>
                    {stat.label}
                  </p>
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    {stat.caption}
                  </p>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
