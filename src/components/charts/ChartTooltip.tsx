'use client';

import { cn } from '@/lib/cn';

export interface ChartTooltipProps {
  /** Horizontal anchor, in pixels within the chart container. */
  x: number;
  /** Container width, used to flip the tooltip near the right edge. */
  containerWidth: number;
  /** Vertical offset in pixels. */
  y?: number;
  title: string;
  color?: string;
  value: string;
  hint?: string;
  className?: string;
}

/**
 * Hover readout shared by every chart. Positioned in the container's pixel
 * space and flipped near the edges so it never spills outside the card.
 */
export function ChartTooltip({
  x,
  containerWidth,
  y = 8,
  title,
  color,
  value,
  hint,
  className,
}: ChartTooltipProps) {
  const nearRightEdge = x > containerWidth - 110;
  const nearLeftEdge = x < 110;
  const alignment = nearRightEdge
    ? 'translateX(-100%)'
    : nearLeftEdge
      ? 'translateX(0)'
      : 'translateX(-50%)';

  return (
    <div
      role='status'
      aria-live='polite'
      className={cn(
        'pointer-events-none absolute z-10 min-w-32 rounded-control border border-border bg-card px-3 py-2 shadow-lg',
        className,
      )}
      style={{
        left: x,
        top: y,
        transform: alignment + (nearRightEdge ? ' translateX(-8px)' : ''),
      }}
    >
      <p className='flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground'>
        {color && (
          <span
            className='h-2 w-2 shrink-0 rounded-[2px]'
            style={{ backgroundColor: color }}
            aria-hidden='true'
          />
        )}
        {title}
      </p>
      <p className='mt-0.5 text-sm font-bold text-foreground'>{value}</p>
      {hint && (
        <p className='mt-0.5 text-[11px] text-muted-foreground'>{hint}</p>
      )}
    </div>
  );
}
