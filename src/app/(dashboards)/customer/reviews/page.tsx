import type { Metadata } from 'next';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { getAllReviews } from './_actions/getAllReviews';
import { ReviewsList } from './_components/ReviewsList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'My Reviews · GearUp' };

/**
 * Reviews are loaded in one page so search and rating filters apply across the
 * whole set rather than only the rows currently visible.
 */
const LIMIT = 100;

export default async function ReviewsPage() {
  const result = await getAllReviews({ page: 1, limit: LIMIT });

  return (
    <div>
      {result.error && (
        <ErrorBanner title='Could not load reviews' message={result.error} />
      )}
      <ReviewsList initialReviews={result.data} />
    </div>
  );
}
