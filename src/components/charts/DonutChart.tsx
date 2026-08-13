'use client';

import { useState } from 'react';
import { ChartDataTable } from './ChartDataTable';
import {
  donutArc,
  formatValue,
  percentOf,
  type ValueFormat,
} from './chart-utils';

const SIZE = 176;
const OUTER = 84;
const INNER = 56;
/** Surface gap between segments, in pixels of arc length. */
const GAP_PX = 2;

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: DonutSlice[];
  /** Noun for the centre figure, e.g. "orders". */
  totalLabel: string;
  /** How to render the numbers. Serializable so Server Components can set it. */
  format?: ValueFormat;
}

/**
 * Part-to-whole for a handful of categories.
 *
 * Every slice is named and numbered in the legend, so identity never rests on
 * colour alone - which also covers the pairs that sit close under tritanopia.
 */
export function DonutChart({
  data,
  totalLabel,
  format = 'count',
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visible = data.filter((slice) => slice.value > 0);
  const total = visible.reduce((sum, slice) => sum + slice.value, 0);
  const gapDegrees = (GAP_PX * 180) / (Math.PI * OUTER);

  // A lone 100% slice must keep its full ring - there is no seam to carve out.
  const inset = visible.length > 1 ? gapDegrees / 2 : 0;
  const sweeps = visible.map((slice) => (slice.value / total) * 360);

  const segments = visible.map((slice, index) => {
    const start = sweeps.slice(0, index).reduce((sum, sweep) => sum + sweep, 0);
    const end = start + sweeps[index];
    return {
      slice,
      path: donutArc(
        SIZE / 2,
        SIZE / 2,
        OUTER,
        INNER,
        start + inset,
        Math.max(start + inset, end - inset),
      ),
    };
  });

  const active = activeIndex === null ? null : visible[activeIndex];
  const centreValue = active ? active.value : total;
  const centreLabel = active ? active.label : totalLabel;

  return (
    <div className='flex flex-col items-center gap-5'>
      <div className='relative' style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role='img'
          aria-label={`${totalLabel} split across ${visible.length} categories`}
          onPointerLeave={() => setActiveIndex(null)}
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={(OUTER + INNER) / 2}
            fill='none'
            stroke='var(--chart-grid)'
            strokeWidth={OUTER - INNER}
          />
          {segments.map((segment, index) => (
            <path
              key={segment.slice.label}
              d={segment.path}
              fill={segment.slice.color}
              opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
              onPointerEnter={() => setActiveIndex(index)}
              className='transition-opacity duration-150'
            />
          ))}
        </svg>

        <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center'>
          <span className='text-xl font-bold tracking-tight text-foreground'>
            {formatValue(centreValue, format)}
          </span>
          <span className='mt-0.5 max-w-24 text-[11px] leading-tight text-muted-foreground'>
            {centreLabel}
          </span>
        </div>
      </div>

      <ul className='grid w-full grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2'>
        {visible.map((slice, index) => (
          <li
            key={slice.label}
            onPointerEnter={() => setActiveIndex(index)}
            onPointerLeave={() => setActiveIndex(null)}
            className='flex items-center justify-between gap-3 text-xs'
          >
            <span className='flex min-w-0 items-center gap-2'>
              <span
                className='h-2.5 w-2.5 shrink-0 rounded-[3px]'
                style={{ backgroundColor: slice.color }}
                aria-hidden='true'
              />
              <span className='truncate text-muted-foreground'>
                {slice.label}
              </span>
            </span>
            <span className='shrink-0 font-semibold text-foreground'>
              {formatValue(slice.value, format)}
              <span className='ml-1.5 font-medium text-muted-foreground'>
                {percentOf(slice.value, total).toFixed(0)}%
              </span>
            </span>
          </li>
        ))}
      </ul>

      <ChartDataTable
        caption={`${totalLabel} by category`}
        valueHeader='Count'
        rows={visible.map((slice) => ({
          label: slice.label,
          value: `${formatValue(slice.value, format)} (${percentOf(slice.value, total).toFixed(0)}%)`,
        }))}
      />
    </div>
  );
}
