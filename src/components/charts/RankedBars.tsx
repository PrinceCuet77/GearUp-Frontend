import { cn } from '@/lib/cn';
import { percentOf } from './chart-utils';

export interface RankedBar {
  label: string;
  value: number;
  /** Defaults to the first categorical slot. */
  color?: string;
  /** Replaces the plain count on the right, e.g. a formatted amount. */
  displayValue?: string;
}

export interface RankedBarsProps {
  data: RankedBar[];
  /** What the bar length means - announced to screen readers. */
  valueLabel: string;
  /**
   * Denominator for the bar lengths. Defaults to the largest value, which
   * compares categories; pass the sum to read them as shares of a whole.
   */
  scaleTo?: 'max' | 'total';
  /** Show each row's share of the total after its value. */
  showShare?: boolean;
  className?: string;
}

/**
 * Ranked horizontal bars - the readable form when categories are many, or
 * their names are long enough to collide on a vertical axis.
 *
 * Built from ordinary elements rather than SVG: the label and the figure are
 * real text, so the chart is legible to a screen reader as written.
 */
export function RankedBars({
  data,
  valueLabel,
  scaleTo = 'max',
  showShare = false,
  className,
}: RankedBarsProps) {
  const total = data.reduce((sum, row) => sum + row.value, 0);
  const denominator =
    scaleTo === 'total' ? total : Math.max(...data.map((row) => row.value), 0);

  return (
    <ul className={cn('space-y-3.5', className)}>
      {data.map((row) => {
        const width = denominator > 0 ? (row.value / denominator) * 100 : 0;
        return (
          <li key={row.label}>
            <div className='mb-1.5 flex items-baseline justify-between gap-3'>
              <span className='truncate text-xs font-medium text-foreground'>
                {row.label}
              </span>
              <span className='shrink-0 text-xs font-semibold text-foreground'>
                {row.displayValue ?? row.value.toLocaleString('en-US')}
                {showShare && (
                  <span className='ml-1.5 font-medium text-muted-foreground'>
                    {percentOf(row.value, total).toFixed(0)}%
                  </span>
                )}
              </span>
            </div>
            <div
              className='h-2 w-full overflow-hidden rounded-full bg-muted'
              role='img'
              aria-label={`${row.label}: ${row.displayValue ?? row.value} ${valueLabel}`}
            >
              <div
                className='h-full rounded-full transition-[width] duration-500 ease-out'
                style={{
                  width: `${Math.max(width, row.value > 0 ? 2 : 0)}%`,
                  backgroundColor: row.color ?? 'var(--chart-1)',
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
