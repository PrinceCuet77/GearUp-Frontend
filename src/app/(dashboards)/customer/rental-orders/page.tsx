import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { getAllRentalOrders } from './_actions/getAllRentalOrders';
import { OrdersTable } from './_components/OrdersTable';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'My Rentals · GearUp' };

const LIMIT = 10;

export default async function RentalOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const result = await getAllRentalOrders({
    page,
    limit: LIMIT,
    status: params.status || undefined,
  });

  const total = result.meta?.total ?? result.data.length;

  return (
    <div>
      <PageHeader
        title='My Rentals'
        description={`${total} rental order${total === 1 ? '' : 's'} in your history.`}
      />

      {result.error && (
        <ErrorBanner
          title='Could not load rental orders'
          message={result.error}
        />
      )}

      <OrdersTable
        orders={result.data}
        page={page}
        totalPages={result.meta?.totalPages ?? 1}
        total={total}
        pageSize={LIMIT}
      />
    </div>
  );
}
