import { Suspense } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { getAllUsers } from './_actions/getAllUsers';
import { AdminUsersClient } from './_components/AdminUsersClient';

interface AdminUsersPageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    status?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const params = await searchParams;

  const result = await getAllUsers({
    search: params.search,
    role: params.role,
    status: params.status,
    page: params.page ? Number(params.page) : 1,
    limit: params.limit ? Number(params.limit) : 10,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder as 'asc' | 'desc' | undefined,
  });

  const users = result.data ?? [];
  const meta = result.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  return (
    <div>
      <PageHeader
        title='User Management'
        description={`${meta.total} registered user${meta.total !== 1 ? 's' : ''}`}
      />
      <Suspense fallback={<TableSkeleton rows={5} cols={5} />}>
        <AdminUsersClient
          initialUsers={users}
          initialMeta={meta}
          initialSearch={params.search ?? ''}
          error={result.error}
        />
      </Suspense>
    </div>
  );
}
