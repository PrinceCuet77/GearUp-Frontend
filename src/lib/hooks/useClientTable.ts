'use client';

import { useCallback, useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue';

export type SortDirection = 'asc' | 'desc';

export interface ClientTableFilter<T> {
  /** Stable id, also used as the `<select>` name. */
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  /** Value to compare against the selected option (`''` means "all"). */
  accessor: (row: T) => string;
}

export interface ClientTableOptions<T> {
  pageSize?: number;
  /** Everything the search box should match against, joined by the caller. */
  searchAccessor?: (row: T) => string;
  filters?: Array<ClientTableFilter<T>>;
  /** Sortable columns, keyed by column id. */
  sorters?: Record<string, (row: T) => string | number>;
  initialSort?: { key: string; direction: SortDirection };
}

export interface ClientTableResult<T> {
  /** The current page of rows, after search, filters and sorting. */
  rows: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  /** Rows surviving the filters (not just the current page). */
  filteredCount: number;
  /** Rows before any filtering. */
  totalCount: number;
  search: string;
  setSearch: (value: string) => void;
  filterValues: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  sortKey: string | null;
  sortDirection: SortDirection;
  toggleSort: (key: string) => void;
  setPage: (page: number) => void;
  /** True when a search term or any filter is applied. */
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

/**
 * Search + filter + sort + paginate an in-memory row set.
 *
 * Used by the tables whose full result set is already on the client (recent
 * activity, categories, reviews). Server-paginated tables drive the same
 * controls through the URL instead — see `useUrlQuery`.
 */
export function useClientTable<T>(
  data: T[],
  options: ClientTableOptions<T> = {},
): ClientTableResult<T> {
  const {
    pageSize = 10,
    searchAccessor,
    filters = [],
    sorters = {},
    initialSort,
  } = options;

  const [search, setSearchInput] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(
    initialSort?.key ?? null,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    initialSort?.direction ?? 'desc',
  );

  const debouncedSearch = useDebouncedValue(search, 250);

  /* Filtering and sorting run on every render rather than behind a memo. The
     hook only ever sees a page-sized array (at most a few hundred rows), so
     the work is negligible — and memoising would mean depending on the
     accessor literals callers recreate each render, which is where stale-data
     bugs come from. */
  const term = debouncedSearch.trim().toLowerCase();
  const filtered = data.filter((row) => {
    if (
      term &&
      searchAccessor &&
      !searchAccessor(row).toLowerCase().includes(term)
    ) {
      return false;
    }
    return filters.every((filter) => {
      const selected = filterValues[filter.key];
      return !selected || filter.accessor(row) === selected;
    });
  });

  const sorter = sortKey ? sorters[sortKey] : undefined;
  const direction = sortDirection === 'asc' ? 1 : -1;
  const sorted = sorter
    ? [...filtered].sort((a, b) => {
        const left = sorter(a);
        const right = sorter(b);
        if (typeof left === 'number' && typeof right === 'number') {
          return (left - right) * direction;
        }
        return String(left).localeCompare(String(right)) * direction;
      })
    : filtered;

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  // Clamp rather than reset: shrinking results should land on the last page
  // that still has rows, never on an empty one.
  const safePage = Math.min(page, totalPages);
  const rows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const setSearch = useCallback((value: string) => {
    setSearchInput(value);
    setPage(1);
  }, []);

  const setFilter = useCallback((key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const toggleSort = useCallback((key: string) => {
    setPage(1);
    setSortKey((currentKey) => {
      if (currentKey === key) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        return key;
      }
      setSortDirection('asc');
      return key;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchInput('');
    setFilterValues({});
    setPage(1);
  }, []);

  const hasActiveFilters =
    search.trim().length > 0 || Object.values(filterValues).some(Boolean);

  return {
    rows,
    page: safePage,
    pageSize,
    totalPages,
    filteredCount: sorted.length,
    totalCount: data.length,
    search,
    setSearch,
    filterValues,
    setFilter,
    sortKey,
    sortDirection,
    toggleSort,
    setPage,
    hasActiveFilters,
    clearFilters,
  };
}
