import { Mountain } from 'lucide-react';
import type { CategoryHighlight } from '@/lib/home-data';

/**
 * Continuously scrolling strip of live categories.
 * The track is duplicated so the CSS translate can loop seamlessly; the copy
 * is hidden from assistive tech to avoid reading every label twice.
 */
export function CatalogueMarquee({
  categories,
}: {
  categories: CategoryHighlight[];
}) {
  const labels = categories
    .filter((category) => category.listingCount > 0)
    .map((category) => category.name);

  if (labels.length < 3) return null;

  return (
    <div className='border-y border-border bg-background-subtle py-4'>
      <div className='mask-fade-x overflow-hidden'>
        <div className='flex w-max animate-marquee items-center gap-8'>
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className='flex items-center gap-8'
              aria-hidden={copy === 1 || undefined}
            >
              {labels.map((label) => (
                <li
                  key={`${copy}-${label}`}
                  className='flex items-center gap-3 text-sm font-bold tracking-wide text-muted-foreground uppercase'
                >
                  <Mountain
                    className='h-4 w-4 text-primary'
                    aria-hidden='true'
                  />
                  {label}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
