'use client';

import { Rating } from '@/components/ui/Rating';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
}

/**
 * Thin wrapper kept for the detail-page call sites - delegates to the shared
 * `Rating` primitive so stars look identical everywhere in the app.
 */
export function StarRating({ rating, size = 'sm' }: StarRatingProps) {
  return <Rating value={rating} size={size} starsOnly />;
}
