'use client';

export function RatingBar({
  count,
  total,
  label,
}: {
  count: number;
  total: number;
  label: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className='flex items-center gap-3'>
      <span
        className='w-12 shrink-0 text-xs font-medium text-right'
        style={{ color: 'var(--muted-foreground)' }}
      >
        {label}
      </span>
      <div
        className='relative h-2 flex-1 overflow-hidden rounded-full'
        style={{ backgroundColor: 'var(--muted)' }}
      >
        <div
          className='absolute inset-y-0 left-0 rounded-full'
          style={{ width: `${pct}%`, backgroundColor: '#f59e0b' }}
        />
      </div>
      <span
        className='w-6 shrink-0 text-xs'
        style={{ color: 'var(--muted-foreground)' }}
      >
        {count}
      </span>
    </div>
  );
}
