/**
 * Shared utilities for gear-related display logic.
 * Pure functions — safe to use in both Server and Client components.
 */

export type SortBy = 'createdAt' | 'name' | 'price';
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  value: string; // `${sortBy}:${sortOrder}`
  label: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export const SORT_OPTIONS: SortOption[] = [
  {
    value: 'createdAt:desc',
    label: 'Newest First',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  {
    value: 'createdAt:asc',
    label: 'Oldest First',
    sortBy: 'createdAt',
    sortOrder: 'asc',
  },
  { value: 'name:asc', label: 'Name A → Z', sortBy: 'name', sortOrder: 'asc' },
  {
    value: 'name:desc',
    label: 'Name Z → A',
    sortBy: 'name',
    sortOrder: 'desc',
  },
  {
    value: 'price:asc',
    label: 'Price: Low → High',
    sortBy: 'price',
    sortOrder: 'asc',
  },
  {
    value: 'price:desc',
    label: 'Price: High → Low',
    sortBy: 'price',
    sortOrder: 'desc',
  },
];

/**
 * Format a number as Bangladeshi Taka.
 * @example formatBDT(1500) → "৳1,500"
 */
export function formatBDT(amount: string | number): string {
  return `৳${Number(amount).toLocaleString('en-US')}`;
}

/**
 * Parse the `images` field from the API.
 * The API stores images as a JSON-stringified array; this function handles
 * both that format and plain URL strings for backward compatibility.
 *
 * @returns An array of at least one image URL.
 */
export function parseGearImages(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as string[];
    }
  } catch {
    // not JSON — fall through
  }
  if (raw?.startsWith('http')) return [raw];
  return ['https://placehold.co/400x300/e2e8f0/94a3b8?text=Gear'];
}

/**
 * Calculate the average star rating from embedded gear reviews.
 * Returns 0 if there are no reviews.
 */
export function calcAvgRating(reviews?: Array<{ rating: number }>): number {
  if (!reviews?.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

/**
 * Format an ISO date string to a human-readable format.
 * @example formatDate("2024-06-15T00:00:00.000Z") → "June 15, 2024"
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  });
}
