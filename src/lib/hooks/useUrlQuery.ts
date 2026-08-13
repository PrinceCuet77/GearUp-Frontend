'use client';

import { useCallback, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export interface UrlQuery {
  /** Current value of a param, or `fallback` when absent. */
  get: (key: string, fallback?: string) => string;
  /** Current value parsed as a positive integer, or `fallback`. */
  getNumber: (key: string, fallback: number) => number;
  /**
   * Merge params into the URL. An empty string removes the key. `page` is
   * reset to 1 on every change unless the patch sets it explicitly, so a new
   * filter never lands the user on a page that no longer exists.
   */
  set: (patch: Record<string, string | number | undefined>) => void;
  /** Drop every param (back to the unfiltered first page). */
  clear: () => void;
  /** True while the server component for the new URL is still rendering. */
  isPending: boolean;
}

/**
 * URL-search-param state for server-paginated, server-filtered tables.
 *
 * Filters live in the URL rather than component state so a filtered view stays
 * shareable, bookmarkable and survives a refresh - the same convention the
 * public gear browser uses.
 */
export function useUrlQuery(): UrlQuery {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const get = useCallback(
    (key: string, fallback = '') => searchParams.get(key) ?? fallback,
    [searchParams],
  );

  const getNumber = useCallback(
    (key: string, fallback: number) => {
      const parsed = Number(searchParams.get(key));
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    },
    [searchParams],
  );

  const set = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, raw] of Object.entries(patch)) {
        const value = raw === undefined ? '' : String(raw);
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (!('page' in patch)) params.delete('page');

      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams],
  );

  const clear = useCallback(() => {
    startTransition(() => router.replace(pathname, { scroll: false }));
  }, [pathname, router]);

  return { get, getNumber, set, clear, isPending };
}
