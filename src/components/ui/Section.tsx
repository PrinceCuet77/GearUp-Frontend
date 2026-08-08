import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Max-width page gutter. Every full-width section wraps its content in this. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('container-page', className)}>{children}</div>;
}

export type SectionTone = 'default' | 'subtle' | 'card';

const TONE_CLASS: Record<SectionTone, string> = {
  default: 'bg-background',
  subtle: 'bg-background-subtle',
  card: 'bg-card',
};

export interface SectionProps {
  id?: string;
  /** Alternating background so adjacent sections stay visually separated. */
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

/** A landing-page section: consistent vertical rhythm + page gutter. */
export function Section({
  id,
  tone = 'default',
  className,
  containerClassName,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn('section-y scroll-mt-20', TONE_CLASS[tone], className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowIcon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  /** Rendered on the opposite side of the title on `left` alignment. */
  action?: ReactNode;
  as?: ElementType;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  align = 'center',
  action,
  as: Heading = 'h2',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-5 sm:mb-14',
        centered
          ? 'items-center text-center'
          : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-3',
          centered ? 'items-center' : 'items-start',
        )}
      >
        {eyebrow && (
          <span className='eyebrow border-primary/25 bg-primary-soft text-primary-soft-foreground'>
            {eyebrowIcon}
            {eyebrow}
          </span>
        )}
        <Heading className='max-w-3xl text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl'>
          {title}
        </Heading>
        {description && (
          <p className='max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground'>
            {description}
          </p>
        )}
      </div>
      {action && !centered && <div className='shrink-0'>{action}</div>}
    </div>
  );
}
