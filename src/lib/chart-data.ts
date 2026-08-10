/**
 * Turns API records into chart series.
 *
 * Every dashboard chart is derived here from data the app already fetches —
 * there is no sample or placeholder series anywhere in the dashboards. Pure
 * functions, so the derivation runs on the server alongside the fetch.
 */

import type { ChartPoint } from '@/components/charts/chart-utils';
import type { RentalStatus, PaymentStatus, UserRole } from '@/lib/types';

const TIME_ZONE = 'Asia/Dhaka';

export interface MonthBucket {
  /** `YYYY-MM` in Asia/Dhaka. */
  key: string;
  /** Axis tick, e.g. "Mar". */
  label: string;
  /** Tooltip / screen-reader label, e.g. "March 2026". */
  fullLabel: string;
}

function partsInDhaka(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(date);

  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  return { year, month };
}

/** `YYYY-MM` bucket key for an ISO timestamp, in the marketplace's timezone. */
export function monthKey(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const { year, month } = partsInDhaka(date);
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * The last `count` months ending with the current one, oldest first.
 * Buckets are generated rather than read off the data so a quiet month shows
 * as a zero instead of silently disappearing from the axis.
 */
export function lastMonths(count = 6, now = new Date()): MonthBucket[] {
  const { year, month } = partsInDhaka(now);
  const buckets: MonthBucket[] = [];

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    // Date.UTC normalises the month underflow (e.g. month 0 → December).
    const cursor = new Date(Date.UTC(year, month - 1 - offset, 1));
    const bucketYear = cursor.getUTCFullYear();
    const bucketMonth = cursor.getUTCMonth() + 1;

    buckets.push({
      key: `${bucketYear}-${String(bucketMonth).padStart(2, '0')}`,
      label: cursor.toLocaleDateString('en-US', {
        month: 'short',
        timeZone: 'UTC',
      }),
      fullLabel: cursor.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }),
    });
  }

  return buckets;
}

/**
 * Bucket records into the last `months` months.
 * `getValue` defaults to counting records; pass an amount accessor to sum.
 */
export function byMonth<T>(
  records: T[],
  getDate: (record: T) => string,
  options: { months?: number; getValue?: (record: T) => number; now?: Date } = {},
): ChartPoint[] {
  const { months = 6, getValue, now } = options;
  const buckets = lastMonths(months, now);
  const totals = new Map(buckets.map((bucket) => [bucket.key, 0]));

  for (const record of records) {
    const key = monthKey(getDate(record));
    if (!totals.has(key)) continue;
    totals.set(key, totals.get(key)! + (getValue ? getValue(record) : 1));
  }

  return buckets.map((bucket) => ({
    label: bucket.label,
    fullLabel: bucket.fullLabel,
    value: Math.round((totals.get(bucket.key) ?? 0) * 100) / 100,
  }));
}

/**
 * Running total across a series — turns "new per month" into "total to date".
 * `base` seeds the first point with everything that happened before the window.
 */
export function cumulative(points: ChartPoint[], base = 0): ChartPoint[] {
  let running = base;
  return points.map((point) => {
    running += point.value;
    return { ...point, value: Math.round(running * 100) / 100 };
  });
}

/**
 * Bucket numeric values into labelled bands, e.g. gear price tiers.
 * `edges` are the upper bounds; anything above the last edge lands in the
 * open-ended top band.
 */
export function distribute<T>(
  records: T[],
  getValue: (record: T) => number,
  edges: number[],
  formatEdge: (value: number) => string,
): Array<{ label: string; value: number }> {
  const bands = edges.map((edge, index) => ({
    label:
      index === 0
        ? `Under ${formatEdge(edge)}`
        : `${formatEdge(edges[index - 1])} – ${formatEdge(edge)}`,
    max: edge,
    value: 0,
  }));
  bands.push({
    label: `${formatEdge(edges[edges.length - 1])}+`,
    max: Infinity,
    value: 0,
  });

  for (const record of records) {
    const value = getValue(record);
    if (!Number.isFinite(value)) continue;
    const band = bands.find((candidate) => value < candidate.max) ?? bands[bands.length - 1];
    band.value += 1;
  }

  return bands.map(({ label, value }) => ({ label, value }));
}

/**
 * This month against last month, as a rounded percentage.
 *
 * Returns `undefined` when last month had nothing to compare against — a jump
 * from zero is not a percentage, and printing "+100%" there would be a claim
 * the data does not support.
 */
export function monthOverMonth<T>(
  records: T[],
  getDate: (record: T) => string,
  options: { getValue?: (record: T) => number; label?: string; now?: Date } = {},
): { percent: number; label: string } | undefined {
  const { getValue, label = 'vs last month', now } = options;
  const series = byMonth(records, getDate, { months: 2, getValue, now });
  const [previous, current] = [series[0]?.value ?? 0, series[1]?.value ?? 0];

  if (previous <= 0) return undefined;
  return {
    percent: Math.round(((current - previous) / previous) * 100),
    label,
  };
}

/** Count records per key, e.g. gear listings per category name. */
export function countBy<T>(
  records: T[],
  getKey: (record: T) => string,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const record of records) {
    const key = getKey(record);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/** Sum a measure per key, e.g. revenue per gear name. */
export function sumBy<T>(
  records: T[],
  getKey: (record: T) => string,
  getValue: (record: T) => number,
): Map<string, number> {
  const totals = new Map<string, number>();
  for (const record of records) {
    const key = getKey(record);
    totals.set(key, (totals.get(key) ?? 0) + getValue(record));
  }
  return totals;
}

/** Highest-first entries, capped at `limit` rows. */
export function topEntries(
  totals: Map<string, number>,
  limit = 6,
): Array<{ label: string; value: number }> {
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/* ------------------------------------------------------------------------ *
 * Status palettes
 *
 * These mirror `StatusBadge` exactly, so a status reads the same in a chart,
 * a badge and a table row. Status colours are reserved for state — they are
 * never handed out as an extra categorical series.
 * ------------------------------------------------------------------------ */

export const RENTAL_STATUS_META: Record<
  RentalStatus,
  { label: string; color: string }
> = {
  PLACED: { label: 'Placed', color: 'var(--warning)' },
  CONFIRMED: { label: 'Confirmed', color: 'var(--chart-3)' },
  PAID: { label: 'Paid', color: 'var(--chart-2)' },
  PICKED_UP: { label: 'Picked Up', color: 'var(--chart-1)' },
  RETURNED: { label: 'Returned', color: 'var(--muted-foreground)' },
  CANCELLED: { label: 'Cancelled', color: 'var(--danger)' },
};

export const RENTAL_STATUS_ORDER: RentalStatus[] = [
  'PLACED',
  'CONFIRMED',
  'PAID',
  'PICKED_UP',
  'RETURNED',
  'CANCELLED',
];

export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; color: string }
> = {
  COMPLETED: { label: 'Successful', color: 'var(--chart-2)' },
  PENDING: { label: 'Pending', color: 'var(--warning)' },
  FAILED: { label: 'Failed', color: 'var(--danger)' },
};

export const ROLE_META: Record<UserRole, { label: string; color: string }> = {
  ADMIN: { label: 'Admins', color: 'var(--chart-1)' },
  PROVIDER: { label: 'Providers', color: 'var(--chart-2)' },
  CUSTOMER: { label: 'Customers', color: 'var(--chart-3)' },
};

/** Rental orders grouped into the lifecycle order, zero buckets included. */
export function rentalStatusBreakdown(
  orders: Array<{ status: string }>,
): Array<{ label: string; value: number; color: string; status: RentalStatus }> {
  const counts = countBy(orders, (order) => order.status);
  return RENTAL_STATUS_ORDER.map((status) => ({
    status,
    label: RENTAL_STATUS_META[status].label,
    color: RENTAL_STATUS_META[status].color,
    value: counts.get(status) ?? 0,
  }));
}

/** Payments grouped by outcome, zero buckets included. */
export function paymentStatusBreakdown(
  payments: Array<{ status: string }>,
): Array<{ label: string; value: number; color: string }> {
  const counts = countBy(payments, (payment) => payment.status);
  return (['COMPLETED', 'PENDING', 'FAILED'] as PaymentStatus[]).map(
    (status) => ({
      label: PAYMENT_STATUS_META[status].label,
      color: PAYMENT_STATUS_META[status].color,
      value: counts.get(status) ?? 0,
    }),
  );
}

/** Users grouped by role, zero buckets included. */
export function roleBreakdown(
  users: Array<{ role: string }>,
): Array<{ label: string; value: number; color: string }> {
  const counts = countBy(users, (user) => user.role);
  return (['CUSTOMER', 'PROVIDER', 'ADMIN'] as UserRole[]).map((role) => ({
    label: ROLE_META[role].label,
    color: ROLE_META[role].color,
    value: counts.get(role) ?? 0,
  }));
}
