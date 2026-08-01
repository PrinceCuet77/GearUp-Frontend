import { getAllReviews } from './_actions/getAllReviews';
import { ReviewsList } from './_components/ReviewsList';

const LIMIT = 10;

export default async function ReviewsPage() {
  const result = await getAllReviews();

  const reviews = result.success ? result.data : [];
  const totalPages = result.success ? (result.meta?.totalPages ?? 1) : 1;
  const total = result.success ? (result.meta?.total ?? result.data.length) : 0;

  return (
    <ReviewsList
      initialReviews={reviews}
      initialTotalPages={totalPages}
      initialTotal={total}
    />
  );
}
