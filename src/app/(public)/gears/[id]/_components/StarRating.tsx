'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md';
}

export function StarRating({ rating, max = 5, size = 'sm' }: StarRatingProps) {
  const cls = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cls}
          style={{
            fill: i < rating ? '#f59e0b' : 'transparent',
            color: i < rating ? '#f59e0b' : 'var(--border)',
          }}
        />
      ))}
    </div>
  );
}
