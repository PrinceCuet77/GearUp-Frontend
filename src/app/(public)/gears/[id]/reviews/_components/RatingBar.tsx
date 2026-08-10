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
      <span className='w-12 shrink-0 text-right text-xs font-medium text-muted-foreground'>
        {label}
      </span>
      <div
        className='relative h-2 flex-1 overflow-hidden rounded-full bg-muted'
        role='progressbar'
        aria-label={`${label} ratings`}
        aria-valuenow={count}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className='absolute inset-y-0 left-0 rounded-full bg-warning'
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className='w-6 shrink-0 text-xs text-muted-foreground'>
        {count}
      </span>
    </div>
  );
}
