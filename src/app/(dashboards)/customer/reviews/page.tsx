import { getAllReviews } from './_actions/getAllReviews';
import { ReviewsList } from './_components/ReviewsList';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';

const LIMIT = 10;

export default async function ReviewsPage() {
  const result = await getAllReviews();

  const reviews = result.success ? result.data : [];
  const totalPages = result.success ? (result.meta?.totalPages ?? 1) : 1;
  const total = result.success ? (result.meta?.total ?? result.data.length) : 0;

  return (
    <div>
      {result.error && (
        <ErrorBanner
          title='Could not load reviews'
          message={result.error}
        />
      )}
      <ReviewsList
        initialReviews={reviews}
        initialTotalPages={totalPages}
        initialTotal={total}
      />
    </div>
  );
}
