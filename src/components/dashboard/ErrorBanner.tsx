'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ErrorBannerProps {
  message: string;
  title?: string;
  showToast?: boolean;
}

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
      className='mb-6 flex items-start gap-3 rounded-xl border-2 p-4'
      style={{
        backgroundColor: 'color-mix(in srgb, #f97316 10%, transparent)',
        borderColor: 'color-mix(in srgb, #f97316 40%, transparent)',
      }}
    >
      <AlertTriangle
        className='mt-0.5 h-5 w-5 shrink-0'
        style={{ color: '#ea580c' }}
      />
      <div className='flex-1'>
        <p className='text-sm font-semibold' style={{ color: '#9a3412' }}>
          {title}
        </p>
        <p className='mt-0.5 text-sm' style={{ color: '#9a3412' }}>
          {message}
        </p>
      </div>
    </div>
  );
}
