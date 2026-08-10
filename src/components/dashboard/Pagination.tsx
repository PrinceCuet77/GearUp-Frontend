'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface PaginationProps {
  page: number;
  totalPages: number;
  /** Total rows across all pages, for the "showing x–y of z" summary. */
  total?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  /** Noun for the summary line, e.g. "orders". */
  itemLabel?: string;
  /** Dims the control while the next page is loading. */
  isPending?: boolean;
  className?: string;
}

/**
 * Page numbers around the current page, with `null` marking an ellipsis.
 * Always the same shape (7 slots max) so the control never changes width as
 * the user pages through.
 */
function pageWindow(page: number, totalPages: number): Array<number | null> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const window: Array<number | null> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) window.push(null);
  for (let current = start; current <= end; current += 1) window.push(current);
  if (end < totalPages - 1) window.push(null);
  window.push(totalPages);

  return window;
}

/**
 * The one pagination control used by every dashboard table — numbered pages on
 * desktop, a compact "page x of y" on mobile.
 */
export function Pagination({
  page,
  totalPages,
  total,
  pageSize = 10,
  onPageChange,
  itemLabel = 'results',
  isPending = false,
  className,
}: PaginationProps) {
  if (totalPages <= 1 && !total) return null;

  const firstRow = total ? (page - 1) * pageSize + 1 : 0;
  const lastRow = total ? Math.min(page * pageSize, total) : 0;

  const arrowClass =
    'flex h-9 w-9 items-center justify-center rounded-control border border-border text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40';

  return (
    <nav
      aria-label='Pagination'
      className={cn(
        'flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-4 sm:flex-row',
        isPending && 'opacity-60',
        className,
      )}
    >
      <p className='text-xs text-muted-foreground'>
        {total ? (
          <>
            Showing{' '}
            <span className='font-semibold text-foreground'>
              {firstRow}–{lastRow}
            </span>{' '}
            of <span className='font-semibold text-foreground'>{total}</span>{' '}
            {itemLabel}
          </>
        ) : (
          <>
            Page <span className='font-semibold text-foreground'>{page}</span> of{' '}
            {totalPages}
          </>
        )}
      </p>

      {totalPages > 1 && (
        <div className='flex items-center gap-1.5'>
          <button
            type='button'
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label='Go to previous page'
            className={cn(arrowClass, 'cursor-pointer')}
          >
            <ChevronLeft className='h-4 w-4' aria-hidden='true' />
          </button>

          <div className='hidden items-center gap-1 sm:flex'>
            {pageWindow(page, totalPages).map((slot, index) =>
              slot === null ? (
                <span
                  key={`gap-${index}`}
                  className='px-1 text-xs text-muted-foreground'
                  aria-hidden='true'
                >
                  …
                </span>
              ) : (
                <button
                  key={slot}
                  type='button'
                  onClick={() => onPageChange(slot)}
                  aria-label={`Go to page ${slot}`}
                  aria-current={slot === page ? 'page' : undefined}
                  className={cn(
                    'h-9 min-w-9 cursor-pointer rounded-control px-2.5 text-xs font-semibold transition-colors',
                    slot === page
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {slot}
                </button>
              ),
            )}
          </div>

          <span className='text-xs font-medium text-muted-foreground sm:hidden'>
            {page} / {totalPages}
          </span>

          <button
            type='button'
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label='Go to next page'
            className={cn(arrowClass, 'cursor-pointer')}
          >
            <ChevronRight className='h-4 w-4' aria-hidden='true' />
          </button>
        </div>
      )}
    </nav>
  );
}
