import { TablePageSkeleton } from '@/components/ui/Skeleton';

export default function AdminGearsLoading() {
  return <TablePageSkeleton rows={6} cols={6} filters={3} />;
}
