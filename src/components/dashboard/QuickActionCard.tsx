import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { StatsTone } from './StatsCard';

const TONE_CLASS: Record<StatsTone, string> = {
  primary: 'bg-primary-soft text-primary-soft-foreground',
  secondary: 'bg-secondary-soft text-secondary-soft-foreground',
  accent: 'bg-accent-soft text-accent-soft-foreground',
};

export interface QuickAction {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  tone?: StatsTone;
}

/**
 * The "Quick Actions" tile shared by all three dashboard overviews, so the
 * admin, provider and customer shells stay pixel-identical.
 */
export function QuickActionCard({
  href,
  label,
  description,
  icon: Icon,
  tone = 'primary',
}: QuickAction) {
  return (
    <Link
      href={href}
      className='surface-card-interactive group flex h-full items-start gap-4 p-5'
    >
      <span
        className={cn(
          'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-control',
          TONE_CLASS[tone],
        )}
      >
        <Icon className='h-5 w-5' aria-hidden='true' />
      </span>
      <span className='min-w-0 flex-1'>
        <span className='flex items-center justify-between gap-2'>
          <span className='text-sm font-semibold text-foreground'>{label}</span>
          <ArrowRight
            className='h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100'
            aria-hidden='true'
          />
        </span>
        <span className='mt-0.5 block text-sm text-muted-foreground'>
          {description}
        </span>
      </span>
    </Link>
  );
}

export function QuickActionGrid({ actions }: { actions: QuickAction[] }) {
  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {actions.map((action) => (
        <QuickActionCard key={action.href} {...action} />
      ))}
    </div>
  );
}
