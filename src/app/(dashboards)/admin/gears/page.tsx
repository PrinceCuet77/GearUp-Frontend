import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { getAllCategoriesAction } from '@/app/(public)/_actions/getAllCategories';
import { getAllGearsForAdmin } from './_actions/getAllGearsForAdmin';
import { AdminGearsClient } from './_components/AdminGearsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Manage Gear · GearUp' };

const LIMIT = 10;

interface AdminGearsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
  }>;
}

export default async function AdminGearsPage({
  searchParams,
}: AdminGearsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [result, categoriesResult] = await Promise.all([
    getAllGearsForAdmin({
      search: params.search,
      category: params.category,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder === 'asc' ? 'asc' : 'desc',
      page,
      limit: LIMIT,
    }),
    getAllCategoriesAction(),
  ]);

  const gears = result.data ?? [];
  const meta = result.meta ?? {
    page,
    limit: LIMIT,
    total: gears.length,
    totalPages: 1,
  };

  return (
    <div>
      <PageHeader
        title='Manage Gear'
        description={`${meta.total} listing${meta.total === 1 ? '' : 's'} across all providers.`}
      />
      <AdminGearsClient
        gears={gears}
        categories={categoriesResult.data ?? []}
        meta={meta}
        error={result.error}
      />
    </div>
  );
}
