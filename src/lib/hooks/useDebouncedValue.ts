'use client';

import { useEffect, useState } from 'react';

/**
 * Trails `value` by `delay` ms. Used by table search boxes so typing filters
 * as you go without a request (or a re-sort) per keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
