import { Suspense } from 'react';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { getSelfListedAllGearsByProvider } from './_actions/getSelfListedAllGearsByProvider';
// import { getCategories } from './_actions/getCategories';
import { ProviderGearsTable } from './_components/ProviderGearsTable';
import { ProviderGearsShell } from './_components/ProviderGearsShell';
import { getAllCategoriesAction } from '@/app/(public)/_actions/getAllCategories';

export const dynamic = 'force-dynamic';

const LIMIT = 10;

export default async function ProviderGearPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [result, categoriesResult] = await Promise.all([
    getSelfListedAllGearsByProvider({ page, limit: LIMIT }),
    getAllCategoriesAction(),
  ]);

  const gears = result.success ? result.data : [];
  const totalPages = result.meta?.totalPages ?? 1;
  const total = result.meta?.total ?? 0;
  const categories = categoriesResult.success
    ? (categoriesResult.data ?? [])
    : [];

  return (
    <ProviderGearsShell total={total} categories={categories}>
      {result.error && (
        <ErrorBanner title='Could not load gear list' message={result.error} />
      )}

      <div
        className='rounded-xl border'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <Suspense fallback={<TableSkeleton rows={5} cols={5} />}>
          <ProviderGearsTable
            gears={gears}
            page={page}
            totalPages={totalPages}
            total={total}
          />
        </Suspense>
      </div>
    </ProviderGearsShell>
  );
}
