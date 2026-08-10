import { TablePageSkeleton } from '@/components/ui/Skeleton';

export default function CustomerReviewsLoading() {
  return <TablePageSkeleton rows={6} cols={4} filters={1} />;
}
