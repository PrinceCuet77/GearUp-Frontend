import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Title block at the top of every dashboard page. */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
      <div className='min-w-0'>
        <h1 className='text-2xl font-bold tracking-tight text-foreground'>
          {title}
        </h1>
        {description && (
          <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
        )}
      </div>
      {action && <div className='shrink-0'>{action}</div>}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  /** Optional "see everything" link, rendered on the right. */
  linkHref?: string;
  linkLabel?: string;
}

/** Heading for a block within a page - charts, tables, quick actions. */
export function SectionHeader({
  title,
  description,
  linkHref,
  linkLabel = 'View all',
}: SectionHeaderProps) {
  return (
    <div className='mb-4 flex items-end justify-between gap-4'>
      <div className='min-w-0'>
        <h2 className='text-base font-bold text-foreground'>{title}</h2>
        {description && (
          <p className='mt-0.5 text-sm text-muted-foreground'>{description}</p>
        )}
      </div>
      {linkHref && (
        <Link
          href={linkHref}
          className='flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-opacity hover:opacity-80'
        >
          {linkLabel}
          <ArrowRight className='h-3.5 w-3.5' aria-hidden='true' />
        </Link>
      )}
    </div>
  );
}
