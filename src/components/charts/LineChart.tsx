'use client';

import { useId, useState } from 'react';
import { ChartTooltip } from './ChartTooltip';
import { ChartDataTable } from './ChartDataTable';
import { useChartWidth } from './useChartWidth';
import {
  areaPath,
  formatTick,
  formatValue,
  linePath,
  niceScale,
  type ChartPoint,
  type ValueFormat,
} from './chart-utils';

const PADDING = { top: 12, right: 14, bottom: 26, left: 46 };

export interface LineChartProps {
  data: ChartPoint[];
  /** Series name — used by the tooltip and the screen-reader table. */
  seriesLabel: string;
  /** CSS colour for the line and its area fill. */
  color?: string;
  height?: number;
  /** How to render the numbers. Serializable so Server Components can set it. */
  format?: ValueFormat;
}

/**
 * Single-series trend line with an area fill and a crosshair readout.
 *
 * One series by design: the card title names it, so no legend box is needed
 * and there is never a second y-scale to misread.
 */
export function LineChart({
  data,
  seriesLabel,
  color = 'var(--chart-1)',
  height = 224,
  format = 'count',
}: LineChartProps) {
  const gradientId = useId().replace(/:/g, '');
  const { ref, width } = useChartWidth<HTMLDivElement>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const plotWidth = Math.max(1, width - PADDING.left - PADDING.right);
  const plotHeight = Math.max(1, height - PADDING.top - PADDING.bottom);

  const { max, ticks } = niceScale(Math.max(...data.map((d) => d.value), 0));
  const baselineY = PADDING.top + plotHeight;

  const xAt = (index: number) =>
    data.length === 1
      ? PADDING.left + plotWidth / 2
      : PADDING.left + (index / (data.length - 1)) * plotWidth;
  const yAt = (value: number) => baselineY - (value / max) * plotHeight;

  const coords = data.map((point, index) => ({
    x: xAt(index),
    y: yAt(point.value),
  }));

  // Labels crowd on narrow screens; drop every other tick rather than let them
  // overlap into an unreadable smear.
  const labelStride = width < 420 && data.length > 4 ? 2 : 1;

  const handlePointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const ratio = (offsetX - PADDING.left) / plotWidth;
    const index = Math.round(ratio * Math.max(1, data.length - 1));
    setActiveIndex(Math.min(data.length - 1, Math.max(0, index)));
  };

  const active = activeIndex === null ? null : data[activeIndex];

  return (
    <div ref={ref} className='relative w-full'>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role='img'
        aria-label={`${seriesLabel} trend across ${data.length} periods`}
        className='block touch-pan-y overflow-visible'
        onPointerMove={handlePointer}
        onPointerLeave={() => setActiveIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor={color} stopOpacity='0.26' />
            <stop offset='100%' stopColor={color} stopOpacity='0.02' />
          </linearGradient>
        </defs>

        {/* Value grid — recessive, behind every mark */}
        {ticks.map((tick) => {
          const y = yAt(tick);
          return (
            <g key={tick}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={width - PADDING.right}
                y2={y}
                stroke='var(--chart-grid)'
                strokeWidth={1}
              />
              <text
                x={PADDING.left - 10}
                y={y + 3.5}
                textAnchor='end'
                fontSize={10}
                fill='var(--chart-axis)'
              >
                {formatTick(tick, format)}
              </text>
            </g>
          );
        })}

        {/* Category axis */}
        {data.map((point, index) =>
          index % labelStride === 0 ? (
            <text
              key={point.label}
              x={xAt(index)}
              y={height - 8}
              textAnchor='middle'
              fontSize={10}
              fill='var(--chart-axis)'
            >
              {point.label}
            </text>
          ) : null,
        )}

        <path d={areaPath(coords, baselineY)} fill={`url(#${gradientId})`} />
        <path
          d={linePath(coords)}
          fill='none'
          stroke={color}
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
        />

        {/* Resting markers stay small so the trend, not the dots, reads first */}
        {coords.map((coord, index) => (
          <circle
            key={data[index].label}
            cx={coord.x}
            cy={coord.y}
            r={activeIndex === index ? 5 : 3}
            fill={color}
            stroke='var(--card)'
            strokeWidth={2}
          />
        ))}

        {activeIndex !== null && (
          <line
            x1={coords[activeIndex].x}
            y1={PADDING.top}
            x2={coords[activeIndex].x}
            y2={baselineY}
            stroke='var(--chart-axis)'
            strokeWidth={1}
            strokeDasharray='3 3'
          />
        )}
      </svg>

      {active && activeIndex !== null && (
        <ChartTooltip
          x={coords[activeIndex].x}
          containerWidth={width}
          title={active.fullLabel ?? active.label}
          color={color}
          value={formatValue(active.value, format)}
          hint={seriesLabel}
        />
      )}

      <ChartDataTable
        caption={`${seriesLabel} by period`}
        categoryHeader='Period'
        valueHeader={seriesLabel}
        rows={data.map((point) => ({
          label: point.fullLabel ?? point.label,
          value: formatValue(point.value, format),
        }))}
      />
    </div>
  );
}
