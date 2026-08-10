import { TablePageSkeleton } from '@/components/ui/Skeleton';

export default function AdminCategoriesLoading() {
  return <TablePageSkeleton rows={6} cols={3} filters={0} />;
}
