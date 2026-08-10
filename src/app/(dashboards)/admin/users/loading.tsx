import { TablePageSkeleton } from '@/components/ui/Skeleton';

export default function AdminUsersLoading() {
  return <TablePageSkeleton rows={6} cols={5} filters={2} />;
}
