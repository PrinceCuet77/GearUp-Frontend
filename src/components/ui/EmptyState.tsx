import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Usually a `ButtonLink` or `Button` that resolves the empty state. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'surface-card flex flex-col items-center justify-center gap-4 px-6 py-16 text-center',
        className,
      )}
    >
      <span className='flex h-14 w-14 items-center justify-center rounded-2xl bg-muted'>
        <Icon className='h-7 w-7 text-muted-foreground' aria-hidden='true' />
      </span>
      <div className='space-y-1.5'>
        <p className='text-base font-bold text-foreground'>{title}</p>
        {description && (
          <p className='mx-auto max-w-md text-sm text-muted-foreground'>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
