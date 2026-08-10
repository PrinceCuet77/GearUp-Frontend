import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { getAllUsers } from './_actions/getAllUsers';
import { AdminUsersClient } from './_components/AdminUsersClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Manage Users · GearUp' };

const LIMIT = 10;

interface AdminUsersPageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const result = await getAllUsers({
    search: params.search,
    role: params.role,
    status: params.status,
    page,
    limit: LIMIT,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const users = result.data ?? [];
  const meta = result.meta ?? {
    page,
    limit: LIMIT,
    total: users.length,
    totalPages: 1,
  };

  return (
    <div>
      <PageHeader
        title='Manage Users'
        description={`${meta.total} registered account${meta.total === 1 ? '' : 's'} across all roles.`}
      />
      <AdminUsersClient
        initialUsers={users}
        meta={meta}
        error={result.error}
      />
    </div>
  );
}
