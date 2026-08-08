'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
};

const ICON_SIZE: Record<ButtonSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the full width of the parent. */
  fullWidth?: boolean;
  /** Rendered before the label. Ignored while `loading` is true. */
  leadingIcon?: ReactNode;
  /** Rendered after the label. */
  trailingIcon?: ReactNode;
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: BaseProps & { className?: string } = {}) {
  return cn(
    'btn',
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth && 'w-full',
    className,
  );
}

/** Icon sizing token so callers stay consistent with the button they sit in. */
export function buttonIconClass(size: ButtonSize = 'md') {
  return ICON_SIZE[size];
}

export interface ButtonProps
  extends Omit<ComponentProps<'button'>, 'children'>,
    BaseProps {
  /** Swaps the leading icon for a spinner and blocks interaction. */
  loading?: boolean;
  /** Announced to screen readers while `loading` is true. */
  loadingText?: string;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  leadingIcon,
  trailingIcon,
  loading = false,
  loadingText,
  className,
  disabled,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...rest}
    >
      {loading ? (
        <Loader2 className={cn(ICON_SIZE[size], 'animate-spin')} />
      ) : (
        leadingIcon
      )}
      {loading && loadingText ? loadingText : children}
      {!loading && trailingIcon}
    </button>
  );
}

export interface ButtonLinkProps
  extends Omit<ComponentProps<typeof Link>, 'children'>,
    BaseProps {
  children?: ReactNode;
}

/** Same visual contract as `Button`, rendered as a Next.js `Link`. */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  fullWidth,
  leadingIcon,
  trailingIcon,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </Link>
  );
}
