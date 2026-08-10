import { TablePageSkeleton } from '@/components/ui/Skeleton';

export default function ProviderGearsLoading() {
  return <TablePageSkeleton rows={6} cols={6} filters={2} />;
}
