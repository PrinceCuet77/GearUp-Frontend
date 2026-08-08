import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface RatingProps {
  /** Average rating, 0–5. */
  value: number;
  /** Number of reviews behind the average. Hidden when undefined. */
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  /** Hide the numeric value and show stars only. */
  starsOnly?: boolean;
  className?: string;
}

const STAR_SIZE = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

const TEXT_SIZE = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
} as const;

/**
 * Read-only star rating. Renders partial stars via a clipped overlay so a 4.3
 * average is visually distinguishable from a 4.0.
 */
export function Rating({
  value,
  count,
  size = 'md',
  starsOnly = false,
  className,
}: RatingProps) {
  const clamped = Math.min(5, Math.max(0, value));
  const label =
    count === undefined
      ? `Rated ${clamped.toFixed(1)} out of 5`
      : `Rated ${clamped.toFixed(1)} out of 5 from ${count} review${count === 1 ? '' : 's'}`;

  return (
    <span
      className={cn('inline-flex items-center gap-1.5', className)}
      role='img'
      aria-label={label}
    >
      <span className='relative inline-flex' aria-hidden='true'>
        <span className='flex gap-0.5'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(STAR_SIZE[size], 'text-border-strong')}
              fill='currentColor'
            />
          ))}
        </span>
        <span
          className='absolute inset-0 overflow-hidden'
          style={{ width: `${(clamped / 5) * 100}%` }}
        >
          <span className='flex gap-0.5'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(STAR_SIZE[size], 'shrink-0 text-warning')}
                fill='currentColor'
              />
            ))}
          </span>
        </span>
      </span>

      {!starsOnly && (
        <span
          className={cn('font-semibold text-foreground', TEXT_SIZE[size])}
          aria-hidden='true'
        >
          {clamped.toFixed(1)}
        </span>
      )}
      {!starsOnly && count !== undefined && (
        <span
          className={cn('text-muted-foreground', TEXT_SIZE[size])}
          aria-hidden='true'
        >
          ({count})
        </span>
      )}
    </span>
  );
}
