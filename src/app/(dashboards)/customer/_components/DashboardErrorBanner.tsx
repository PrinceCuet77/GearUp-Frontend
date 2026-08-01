'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function DashboardErrorBanner({ error }: { error: string }) {
  useEffect(() => {
    toast.error('Dashboard load failed', { description: error });
  }, [error]);

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
          Could not load dashboard
        </p>
        <p className='mt-0.5 text-sm' style={{ color: '#9a3412' }}>
          {error}
        </p>
      </div>
    </div>
  );
}
