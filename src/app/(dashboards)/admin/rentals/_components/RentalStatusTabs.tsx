'use client';

import { cn } from '@/lib/cn';
import { RENTAL_STATUS_META, RENTAL_STATUS_ORDER } from '@/lib/chart-data';
import type { RentalStatus } from '@/lib/types';

interface RentalStatusTabsProps {
  /** Empty string means "All". */
  activeStatus: string;
  totalRentals: number;
  statusCounts: Partial<Record<RentalStatus, number>>;
  onChange: (status: string) => void;
}

/**
 * Status filter rendered as counted tabs rather than a plain select, so the
 * per-status breakdown the API returns (unaffected by filters) is always
 * visible instead of hidden inside a dropdown.
 */
export function RentalStatusTabs({
  activeStatus,
  totalRentals,
  statusCounts,
  onChange,
}: RentalStatusTabsProps) {
  const tabs = [
    { value: '', label: 'All', count: totalRentals },
    ...RENTAL_STATUS_ORDER.map((status) => ({
      value: status,
      label: RENTAL_STATUS_META[status].label,
      count: statusCounts[status] ?? 0,
    })),
  ];

  return (
    <div
      role='tablist'
      aria-label='Filter rentals by status'
      className='mb-4 flex flex-wrap gap-2'
    >
      {tabs.map((tab) => {
        const active = activeStatus === tab.value;
        return (
          <button
            key={tab.value || 'all'}
            type='button'
            role='tab'
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
              active
                ? 'border-primary bg-primary-soft text-primary-soft-foreground'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {tab.label}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px]',
                active ? 'bg-primary/15' : 'bg-muted',
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
