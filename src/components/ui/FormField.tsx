'use client';

import { useId, type ReactNode } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export interface FormFieldProps {
  label: string;
  /** Validation message. Its presence flips the control into the error state. */
  error?: string;
  /** Helper text shown when there is no error. */
  hint?: string;
  required?: boolean;
  /**
   * Receives the wiring every accessible control needs. Spread it onto the
   * input so the label, error text and invalid state stay connected.
   */
  children: (props: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
    className: string;
  }) => ReactNode;
  className?: string;
}

/**
 * Label + control + error/hint, wired together for screen readers.
 * Every form in the app builds its fields from this so labels are always
 * connected to their input and errors always announce.
 */
export function FormField({
  label,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className='field-label'>
        {label}
        {required && (
          <span className='ml-0.5 text-danger' aria-hidden='true'>
            *
          </span>
        )}
      </label>

      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
        className: 'field-input',
      })}

      {error ? (
        <p id={errorId} className='field-error' role='alert'>
          <AlertCircle className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className='field-hint'>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export interface PasswordInputProps extends ComponentProps<'input'> {
  className?: string;
}

/**
 * Password control with a show/hide toggle. Accepts the props object handed
 * down by `FormField`, so it stays labelled and describedby-wired.
 */
export function PasswordInput({ className, ...rest }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className='relative'>
      <input
        {...rest}
        type={visible ? 'text' : 'password'}
        className={cn(className, 'pr-11')}
      />
      <button
        type='button'
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground'
      >
        {visible ? (
          <EyeOff className='h-4 w-4' aria-hidden='true' />
        ) : (
          <Eye className='h-4 w-4' aria-hidden='true' />
        )}
      </button>
    </div>
  );
}
