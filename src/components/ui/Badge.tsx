import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'danger'
  | 'warning';

export type BadgeSize = 'sm' | 'md';

const TONE_CLASS: Record<BadgeTone, string> = {
  primary: 'bg-primary-soft text-primary-soft-foreground',
  secondary: 'bg-secondary-soft text-secondary-soft-foreground',
  accent: 'bg-accent-soft text-accent-soft-foreground',
  neutral: 'bg-muted text-muted-foreground',
  danger: 'bg-danger-soft text-danger-soft-foreground',
  warning: 'bg-warning-soft text-warning-soft-foreground',
};

const SIZE_CLASS: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-3 py-1 text-xs',
};

export interface BadgeProps {
  tone?: BadgeTone;
  size?: BadgeSize;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Badge({
  tone = 'neutral',
  size = 'md',
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap',
        TONE_CLASS[tone],
        SIZE_CLASS[size],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
