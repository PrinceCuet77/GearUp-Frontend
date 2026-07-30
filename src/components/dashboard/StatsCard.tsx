import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  accentColor?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  accentColor = 'var(--primary)',
}: StatsCardProps) {
  return (
    <div
      className='rounded-xl border p-5 transition-shadow hover:shadow-md'
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0 flex-1'>
          <p
            className='text-sm font-medium'
            style={{ color: 'var(--muted-foreground)' }}
          >
            {title}
          </p>
          <p
            className='mt-1 text-2xl font-bold tracking-tight'
            style={{ color: 'var(--foreground)' }}
          >
            {value}
          </p>
          {description && (
            <p
              className='mt-1 text-xs'
              style={{ color: 'var(--muted-foreground)' }}
            >
              {description}
            </p>
          )}
        </div>

        <div
          className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl'
          style={{
            backgroundColor: `color-mix(in srgb, ${accentColor} 14%, transparent)`,
          }}
        >
          <Icon className='h-5 w-5' style={{ color: accentColor }} />
        </div>
      </div>
    </div>
  );
}
