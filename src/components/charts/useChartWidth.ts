'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Measures the chart container so the SVG can be drawn at true pixel size.
 *
 * Scaling a fixed viewBox would be less code, but it scales the type with it —
 * axis labels end up huge on a wide screen and unreadable on a narrow one.
 * Drawing at real pixels keeps every chart's typography identical to the rest
 * of the dashboard at every breakpoint.
 */
export function useChartWidth<T extends HTMLElement = HTMLDivElement>(
  fallbackWidth = 640,
): { ref: RefObject<T | null>; width: number; measured: boolean } {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallbackWidth);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next > 0) {
        setWidth(next);
        setMeasured(true);
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width, measured };
}
