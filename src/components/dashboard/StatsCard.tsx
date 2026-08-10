import Link from 'next/link';
import { ArrowRight, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
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

export interface StatsTrend {
  /** Percentage change. Negative renders as a fall. */
  percent: number;
  /** What the change is measured against, e.g. "vs last month". */
  label: string;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  tone?: StatsTone;
  /** Period-over-period movement, computed from real records. */
  trend?: StatsTrend;
  /** Turns the whole tile into a link to the matching detail page. */
  href?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  tone = 'primary',
  trend,
  href,
}: StatsCardProps) {
  const body = (
    <>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0 flex-1'>
          <p className='text-sm font-medium text-muted-foreground'>{title}</p>
          <p className='mt-1.5 text-2xl font-bold tracking-tight text-foreground'>
            {value}
          </p>
        </div>

        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-control',
            TONE_CLASS[tone],
          )}
        >
          <Icon className='h-5 w-5' aria-hidden='true' />
        </span>
      </div>

      <div className='mt-3 flex flex-wrap items-center gap-x-2 gap-y-1'>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold',
              trend.percent < 0 ? 'text-danger' : 'text-secondary',
            )}
          >
            {trend.percent < 0 ? (
              <TrendingDown className='h-3.5 w-3.5' aria-hidden='true' />
            ) : (
              <TrendingUp className='h-3.5 w-3.5' aria-hidden='true' />
            )}
            {trend.percent > 0 ? '+' : ''}
            {trend.percent}%
          </span>
        )}
        {(trend?.label ?? description) && (
          <span className='text-xs text-muted-foreground'>
            {trend?.label ?? description}
          </span>
        )}
        {href && (
          <ArrowRight
            className='ml-auto h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100'
            aria-hidden='true'
          />
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className='surface-card-interactive group block h-full p-5'>
        {body}
      </Link>
    );
  }

  return (
    <div className='surface-card h-full p-5 transition-shadow hover:shadow-md'>
      {body}
    </div>
  );
}
