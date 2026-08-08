'use client';

import { useEffect, useRef, useState } from 'react';
import {
  animate,
  useInView,
  useReducedMotion,
  type AnimationPlaybackControls,
} from 'motion/react';

export interface CountUpProps {
  value: number;
  /** Decimal places to render — use 1 for averages like 4.7. */
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Counts from 0 to `value` the first time it scrolls into view.
 * Renders the final value immediately for reduced-motion users, and the final
 * value is always what ends up in the DOM for screen readers.
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1.4,
  prefix = '',
  suffix = '',
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // A zero-duration tween lands on the final value immediately, which keeps
    // the reduced-motion path on the same code path as the animated one.
    const controls: AnimationPlaybackControls = animate(0, value, {
      duration: reduceMotion ? 0 : duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });

    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString('en-US');

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
