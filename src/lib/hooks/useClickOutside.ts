'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Closes a popover-style surface on an outside pointer press or `Escape`.
 *
 * Returns the ref to attach to the element that should stay open - anything
 * inside it (including the trigger) is treated as "inside".
 */
export function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  active: boolean,
  onDismiss: () => void,
): RefObject<T | null> {
  const ref = useRef<T>(null);
  // Kept in a ref so a caller passing an inline arrow does not re-subscribe
  // the document listeners on every render.
  const handlerRef = useRef(onDismiss);

  useEffect(() => {
    handlerRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!active) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(event.target as Node)) handlerRef.current();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handlerRef.current();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [active]);

  return ref;
}
