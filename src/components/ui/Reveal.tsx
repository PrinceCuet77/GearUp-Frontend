'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

const OFFSET: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

export interface RevealProps {
  children: ReactNode;
  /** Direction the element travels *from*. */
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
  /** Replay the animation every time the element re-enters the viewport. */
  repeat?: boolean;
}

/**
 * Scroll-triggered entrance animation.
 *
 * Collapses to a no-op (instant, final state) when the user has
 * `prefers-reduced-motion` enabled.
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.55,
  className,
  repeat = false,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = OFFSET[direction];

  return (
    <motion.div
      className={className}
      initial={
        reduceMotion ? { opacity: 1 } : { opacity: 0, x: offset.x, y: offset.y }
      }
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: !repeat, amount: 0.2 }}
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggers the entrance of its direct `RevealItem` children.
 * Use for grids and lists so cards cascade instead of popping in together.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : stagger,
        delayChildren: reduceMotion ? 0 : delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div className={cn('h-full', className)} variants={variants}>
      {children}
    </motion.div>
  );
}
