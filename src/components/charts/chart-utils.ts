/**
 * Geometry and formatting helpers shared by every chart.
 *
 * Pure functions only - safe to import from Server Components that pre-compute
 * chart data, and from the `'use client'` chart components that draw it.
 */

/** A single plotted observation. `label` is the category / x-axis tick. */
export interface ChartPoint {
  label: string;
  value: number;
  /** Optional longer label for the tooltip (e.g. "March 2026" vs "Mar"). */
  fullLabel?: string;
}

/**
 * Series colours resolve to CSS custom properties so light/dark are two steps
 * of one system rather than two hard-coded palettes. Slots are assigned in
 * fixed order - a series keeps its colour when siblings are filtered away.
 */
export const CHART_SLOTS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
] as const;

export type ChartSlot = (typeof CHART_SLOTS)[number];

/** Compact number for axis ticks: 1200 → "1.2k", 3_400_000 → "3.4M". */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${trimZero(value / 1_000_000)}M`;
  if (abs >= 1_000) return `${trimZero(value / 1_000)}k`;
  return String(Math.round(value * 100) / 100);
}

function trimZero(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** Compact Taka for value axes: 12500 → "৳12.5k". */
export function formatCompactBDT(value: number): string {
  return `৳${formatCompact(value)}`;
}

/**
 * How a chart renders its numbers.
 *
 * A plain string rather than a formatter function, because the pages that
 * derive chart data are Server Components - a function prop cannot cross the
 * server/client boundary, so the choice is passed by name and resolved here.
 */
export type ValueFormat = 'count' | 'currency';

/** Full-precision value for tooltips, legends and the accessible table. */
export function formatValue(value: number, format: ValueFormat): string {
  return format === 'currency'
    ? `৳${Math.round(value).toLocaleString('en-US')}`
    : Math.round(value).toLocaleString('en-US');
}

/** Compact value for axis ticks, where space is tight. */
export function formatTick(value: number, format: ValueFormat): string {
  return format === 'currency' ? formatCompactBDT(value) : formatCompact(value);
}

/**
 * A "nice" axis maximum at or above `max`, plus evenly spaced ticks.
 * Falls back to a 0–4 axis for an all-zero series so an empty chart still
 * draws a readable grid instead of collapsing to a single line.
 */
export function niceScale(
  max: number,
  tickCount = 4,
): { max: number; ticks: number[] } {
  if (!Number.isFinite(max) || max <= 0) {
    return { max: 4, ticks: [0, 1, 2, 3, 4] };
  }

  const rawStep = max / tickCount;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalised = rawStep / magnitude;
  const niceStep =
    (normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 5 ? 5 : 10) *
    magnitude;

  const niceMax = Math.ceil(max / niceStep) * niceStep;
  const ticks: number[] = [];
  for (let tick = 0; tick <= niceMax + niceStep / 2; tick += niceStep) {
    ticks.push(Math.round(tick * 1000) / 1000);
  }
  return { max: niceMax, ticks };
}

/** Straight-segment path through already-projected pixel coordinates. */
export function linePath(coords: Array<{ x: number; y: number }>): string {
  if (coords.length === 0) return '';
  return coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${round(c.x)} ${round(c.y)}`)
    .join(' ');
}

/** The same path closed down to the baseline, for the area fill under a line. */
export function areaPath(
  coords: Array<{ x: number; y: number }>,
  baselineY: number,
): string {
  if (coords.length === 0) return '';
  const first = coords[0];
  const last = coords[coords.length - 1];
  return `${linePath(coords)} L${round(last.x)} ${round(baselineY)} L${round(first.x)} ${round(baselineY)} Z`;
}

/**
 * Donut segment as an SVG arc.
 * Angles are clockwise from 12 o'clock, in degrees.
 */
export function donutArc(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  // A full circle can't be expressed as a single arc (start === end), so trim a
  // hair off the sweep; the 2px segment gap hides the seam anyway.
  const sweep = Math.min(endAngle - startAngle, 359.99);
  const end = startAngle + sweep;

  const outerStart = polar(cx, cy, outerRadius, startAngle);
  const outerEnd = polar(cx, cy, outerRadius, end);
  const innerEnd = polar(cx, cy, innerRadius, end);
  const innerStart = polar(cx, cy, innerRadius, startAngle);
  const largeArc = sweep > 180 ? 1 : 0;

  return [
    `M${round(outerStart.x)} ${round(outerStart.y)}`,
    `A${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${round(outerEnd.x)} ${round(outerEnd.y)}`,
    `L${round(innerEnd.x)} ${round(innerEnd.y)}`,
    `A${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${round(innerStart.x)} ${round(innerStart.y)}`,
    'Z',
  ].join(' ');
}

function polar(cx: number, cy: number, radius: number, angleDeg: number) {
  const radians = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Percentage of a total, guarding the empty-dataset divide-by-zero. */
export function percentOf(value: number, total: number): number {
  return total > 0 ? (value / total) * 100 : 0;
}
