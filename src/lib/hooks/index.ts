/**
 * Shared client hooks.
 *
 * Import from `@/lib/hooks` — the individual modules are an implementation
 * detail so a hook can move between files without touching call sites.
 */
export { useIsClient, useScrolledPast } from './useBrowser';
export { useClickOutside } from './useClickOutside';
export { useDebouncedValue } from './useDebouncedValue';
export { useUrlQuery } from './useUrlQuery';
export { useClientTable } from './useClientTable';
export type { ClientTableFilter, ClientTableResult } from './useClientTable';
