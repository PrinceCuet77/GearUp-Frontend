import type { Metadata } from 'next';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { getAllCategoriesAction } from '@/app/(public)/_actions/getAllCategories';
import { getSelfListedAllGearsByProvider } from './_actions/getSelfListedAllGearsByProvider';
import { ProviderGearsShell } from './_components/ProviderGearsShell';
import { ProviderGearsTable } from './_components/ProviderGearsTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'My Gear · GearUp' };

const LIMIT = 10;

export default async function ProviderGearPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [result, categoriesResult] = await Promise.all([
    getSelfListedAllGearsByProvider({
      page,
      limit: LIMIT,
      search: params.search,
      category: params.category,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    getAllCategoriesAction(),
  ]);

  const categories = categoriesResult.data ?? [];
  const meta = result.meta ?? {
    page,
    limit: LIMIT,
    total: result.data.length,
    totalPages: 1,
  };

  return (
    <ProviderGearsShell total={meta.total} categories={categories}>
      {result.error && (
        <ErrorBanner title='Could not load your gear' message={result.error} />
      )}

      <ProviderGearsTable
        gears={result.data}
        categories={categories}
        meta={meta}
      />
    </ProviderGearsShell>
  );
}
