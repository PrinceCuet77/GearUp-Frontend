'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ErrorBannerProps {
  message: string;
  title?: string;
  showToast?: boolean;
}

/**
 * Inline failure notice. Uses the `danger` state tokens (not the brand orange)
 * so it reads as an error and keeps contrast in both themes.
 */
export function ErrorBanner({
  message,
  title = 'Could not load dashboard',
  showToast = true,
}: ErrorBannerProps) {
  const lastMessageRef = useRef<string>('');

  useEffect(() => {
    if (showToast && message !== lastMessageRef.current) {
      lastMessageRef.current = message;
      toast.error(message);
    }
  }, [message, showToast]);

  return (
    <div
      role='alert'
      className='mb-6 flex items-start gap-3 rounded-card border border-danger/40 bg-danger-soft p-4'
    >
      <AlertTriangle
        className='mt-0.5 h-5 w-5 shrink-0 text-danger'
        aria-hidden='true'
      />
      <div className='flex-1'>
        <p className='text-sm font-bold text-danger-soft-foreground'>{title}</p>
        <p className='mt-0.5 text-sm text-danger-soft-foreground'>{message}</p>
      </div>
    </div>
  );
}
