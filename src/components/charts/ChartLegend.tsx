import { cn } from '@/lib/cn';

export interface LegendItem {
  label: string;
  color: string;
  /** Optional figure shown after the label (count, share, amount). */
  value?: string;
}

/**
 * Identity key for a chart. Present whenever a chart carries two or more
 * series, so the reading never depends on colour alone — the swatch is a
 * secondary cue next to the text, not the only one.
 */
export function ChartLegend({
  items,
  className,
}: {
  items: LegendItem[];
  className?: string;
}) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-2', className)}>
      {items.map((item) => (
        <li key={item.label} className='flex items-center gap-2 text-xs'>
          <span
            className='h-2.5 w-2.5 shrink-0 rounded-[3px]'
            style={{ backgroundColor: item.color }}
            aria-hidden='true'
          />
          <span className='text-muted-foreground'>{item.label}</span>
          {item.value && (
            <span className='font-semibold text-foreground'>{item.value}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
