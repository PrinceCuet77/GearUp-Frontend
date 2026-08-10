'use client';

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/**
 * `false` during SSR and the first client render, `true` afterwards.
 *
 * Uses `useSyncExternalStore` rather than a `useState` + `useEffect` pair so
 * hydration stays consistent without a cascading render.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

/** Whether the window is scrolled more than `offset` pixels from the top. */
export function useScrolledPast(offset = 8): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > offset,
    () => false,
  );
}
