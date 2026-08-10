'use client';

import { useState } from 'react';
import { ChartTooltip } from './ChartTooltip';
import { ChartDataTable } from './ChartDataTable';
import { useChartWidth } from './useChartWidth';
import {
  formatTick,
  formatValue,
  niceScale,
  type ChartPoint,
  type ValueFormat,
} from './chart-utils';

const PADDING = { top: 12, right: 14, bottom: 26, left: 46 };
/** Surface gap between neighbouring bars — the spacer, not a colour change. */
const BAR_GAP = 2;
const MAX_BAR_WIDTH = 46;
const CORNER = 4;

export interface BarChartProps {
  data: ChartPoint[];
  seriesLabel: string;
  color?: string;
  height?: number;
  /** How to render the numbers. Serializable so Server Components can set it. */
  format?: ValueFormat;
}

/**
 * Vertical bars for magnitude across a small set of categories.
 *
 * Bars are one colour: they encode a single measure, so a second hue would
 * imply a distinction the data does not have.
 */
export function BarChart({
  data,
  seriesLabel,
  color = 'var(--chart-1)',
  height = 224,
  format = 'count',
}: BarChartProps) {
  const { ref, width } = useChartWidth<HTMLDivElement>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const plotWidth = Math.max(1, width - PADDING.left - PADDING.right);
  const plotHeight = Math.max(1, height - PADDING.top - PADDING.bottom);
  const baselineY = PADDING.top + plotHeight;

  const { max, ticks } = niceScale(Math.max(...data.map((d) => d.value), 0));

  const slot = plotWidth / Math.max(1, data.length);
  const barWidth = Math.min(MAX_BAR_WIDTH, Math.max(6, slot - BAR_GAP * 2));

  const xAt = (index: number) =>
    PADDING.left + slot * index + (slot - barWidth) / 2;
  const heightOf = (value: number) => (value / max) * plotHeight;

  const labelStride = width < 420 && data.length > 4 ? 2 : 1;
  const active = activeIndex === null ? null : data[activeIndex];

  return (
    <div ref={ref} className='relative w-full'>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role='img'
        aria-label={`${seriesLabel} across ${data.length} categories`}
        className='block overflow-visible'
        onPointerLeave={() => setActiveIndex(null)}
      >
        {ticks.map((tick) => {
          const y = baselineY - heightOf(tick);
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

        {data.map((point, index) => {
          const barHeight = heightOf(point.value);
          const x = xAt(index);
          const isActive = activeIndex === index;
          return (
            <g
              key={point.label}
              onPointerEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              tabIndex={0}
              role='listitem'
              aria-label={`${point.fullLabel ?? point.label}: ${formatValue(point.value, format)}`}
              className='outline-none'
            >
              {/* Hit target spans the whole slot, so the hover never "falls
                  between" two thin bars. */}
              <rect
                x={PADDING.left + slot * index}
                y={PADDING.top}
                width={slot}
                height={plotHeight}
                fill='transparent'
              />
              <rect
                x={x}
                y={baselineY - Math.max(barHeight, point.value > 0 ? 2 : 0)}
                width={barWidth}
                height={Math.max(barHeight, point.value > 0 ? 2 : 0)}
                rx={CORNER}
                fill={color}
                opacity={activeIndex === null || isActive ? 1 : 0.55}
              />
              {/* Square off the bottom corners so bars sit on the baseline
                  rather than float above it. */}
              {barHeight > CORNER && (
                <rect
                  x={x}
                  y={baselineY - CORNER}
                  width={barWidth}
                  height={CORNER}
                  fill={color}
                  opacity={activeIndex === null || isActive ? 1 : 0.55}
                />
              )}
            </g>
          );
        })}

        <line
          x1={PADDING.left}
          y1={baselineY}
          x2={width - PADDING.right}
          y2={baselineY}
          stroke='var(--chart-grid)'
          strokeWidth={1}
        />

        {data.map((point, index) =>
          index % labelStride === 0 ? (
            <text
              key={point.label}
              x={xAt(index) + barWidth / 2}
              y={height - 8}
              textAnchor='middle'
              fontSize={10}
              fill='var(--chart-axis)'
            >
              {point.label}
            </text>
          ) : null,
        )}
      </svg>

      {active && activeIndex !== null && (
        <ChartTooltip
          x={xAt(activeIndex) + barWidth / 2}
          containerWidth={width}
          title={active.fullLabel ?? active.label}
          color={color}
          value={formatValue(active.value, format)}
          hint={seriesLabel}
        />
      )}

      <ChartDataTable
        caption={`${seriesLabel} by category`}
        valueHeader={seriesLabel}
        rows={data.map((point) => ({
          label: point.fullLabel ?? point.label,
          value: formatValue(point.value, format),
        }))}
      />
    </div>
  );
}
