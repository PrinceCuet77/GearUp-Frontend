import type { ReactNode } from 'react';
import { ChartColumn, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ChartCardProps {
  title: string;
  description?: string;
  /** Rendered top-right — usually a headline figure or a range control. */
  action?: ReactNode;
  /** Legend row, shown under the plot. Required whenever ≥ 2 series. */
  legend?: ReactNode;
  /** Swaps the plot for an explanatory empty state. */
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  className?: string;
  children: ReactNode;
}

/**
 * The single chart container used across every dashboard: same surface,
 * radius, padding and header rhythm as `StatsCard`, so a grid of tiles and a
 * grid of charts read as one system.
 */
export function ChartCard({
  title,
  description,
  action,
  legend,
  isEmpty = false,
  emptyTitle = 'Nothing to chart yet',
  emptyDescription,
  emptyIcon: EmptyIcon = ChartColumn,
  className,
  children,
}: ChartCardProps) {
  return (
    <section className={cn('surface-card flex h-full min-w-0 flex-col p-5', className)}>
      <header className='mb-4 flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <h3 className='text-sm font-bold text-foreground'>{title}</h3>
          {description && (
            <p className='mt-0.5 text-xs text-muted-foreground'>{description}</p>
          )}
        </div>
        {action && <div className='shrink-0 text-right'>{action}</div>}
      </header>

      {isEmpty ? (
        <div className='flex flex-1 flex-col items-center justify-center gap-3 rounded-control border border-dashed border-border px-4 py-10 text-center'>
          <EmptyIcon
            className='h-7 w-7 text-muted-foreground opacity-60'
            aria-hidden='true'
          />
          <div>
            <p className='text-sm font-semibold text-foreground'>
              {emptyTitle}
            </p>
            {emptyDescription && (
              <p className='mx-auto mt-1 max-w-xs text-xs text-muted-foreground'>
                {emptyDescription}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className='min-w-0 flex-1'>{children}</div>
          {legend && <div className='mt-4'>{legend}</div>}
        </>
      )}
    </section>
  );
}
