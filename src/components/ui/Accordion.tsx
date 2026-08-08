'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** `id` of the item expanded on first render. */
  defaultOpenId?: string;
  className?: string;
}

/**
 * Single-open accordion with an animated height transition.
 * Panels stay in the DOM only while open, and are wired with the
 * `aria-expanded` / `aria-controls` pair for assistive tech.
 */
export function Accordion({ items, defaultOpenId, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `accordion-panel-${item.id}`;
        const buttonId = `accordion-button-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(
              'surface-card overflow-hidden transition-colors',
              isOpen && 'border-primary/40',
            )}
          >
            <h3>
              <button
                id={buttonId}
                type='button'
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className='flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5'
              >
                <span className='text-sm font-bold text-foreground sm:text-base'>
                  {item.question}
                </span>
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
                    isOpen
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  <Plus
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      isOpen && 'rotate-45',
                    )}
                    aria-hidden='true'
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role='region'
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className='overflow-hidden'
                >
                  <p className='px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6'>
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
