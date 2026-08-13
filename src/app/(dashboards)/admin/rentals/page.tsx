import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { getAllRentalsForAdmin } from './_actions/getAllRentalsForAdmin';
import { AdminRentalsClient } from './_components/AdminRentalsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Rental Orders · GearUp' };

const LIMIT = 10;

interface AdminRentalsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: string;
    maxAmount?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
  }>;
}

export default async function AdminRentalsPage({
  searchParams,
}: AdminRentalsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const result = await getAllRentalsForAdmin({
    status: params.status,
    search: params.search,
    startDate: params.startDate,
    endDate: params.endDate,
    minAmount: params.minAmount,
    maxAmount: params.maxAmount,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder === 'asc' ? 'asc' : 'desc',
    page,
    limit: LIMIT,
  });

  const orders = result.data ?? [];
  const meta = result.meta ?? {
    page,
    limit: LIMIT,
    total: orders.length,
    totalPages: 1,
    totalRentals: orders.length,
    statusCounts: {},
  };

  return (
    <div>
      <PageHeader
        title='Rental Orders'
        description={`${meta.totalRentals} rental order${meta.totalRentals === 1 ? '' : 's'} across the platform.`}
      />
      <AdminRentalsClient orders={orders} meta={meta} error={result.error} />
    </div>
  );
}
