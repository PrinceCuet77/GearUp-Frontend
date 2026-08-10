import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { getAllRentalOrdersForProvider } from './_actions/getAllRentalOrdersForProvider';
import { ProviderOrdersTable } from './_components/ProviderOrdersTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Rental Orders · GearUp' };

const LIMIT = 10;

export default async function ProviderOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const result = await getAllRentalOrdersForProvider({
    page,
    limit: LIMIT,
    status: params.status || undefined,
  });

  const total = result.meta?.total ?? result.data.length;

  return (
    <div>
      <PageHeader
        title='Rental Orders'
        description={`${total} order${total === 1 ? '' : 's'} received for your gear.`}
      />

      {result.error && (
        <ErrorBanner
          title='Could not load rental orders'
          message={result.error}
        />
      )}

      <ProviderOrdersTable
        orders={result.data}
        page={page}
        totalPages={result.meta?.totalPages ?? 1}
        total={total}
        pageSize={LIMIT}
      />
    </div>
  );
}
