import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Accent tones are restricted to the three brand colours so dashboards can
 * differentiate their tiles without introducing new colours into the palette.
 */
export type StatsTone = 'primary' | 'secondary' | 'accent';

const TONE_CLASS: Record<StatsTone, string> = {
  primary: 'bg-primary-soft text-primary-soft-foreground',
  secondary: 'bg-secondary-soft text-secondary-soft-foreground',
  accent: 'bg-accent-soft text-accent-soft-foreground',
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  tone?: StatsTone;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  tone = 'primary',
}: StatsCardProps) {
  return (
    <div className='surface-card h-full p-5 transition-shadow hover:shadow-md'>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0 flex-1'>
          <p className='text-sm font-medium text-muted-foreground'>{title}</p>
          <p className='mt-1 text-2xl font-bold tracking-tight text-foreground'>
            {value}
          </p>
          {description && (
            <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
          )}
        </div>

        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-control',
            TONE_CLASS[tone],
          )}
        >
          <Icon className='h-5 w-5' aria-hidden='true' />
        </div>
      </div>
    </div>
  );
}
