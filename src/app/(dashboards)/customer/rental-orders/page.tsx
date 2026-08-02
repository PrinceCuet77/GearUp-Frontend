import { Suspense } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { getAllRentalOrders } from './_actions/getAllRentalOrders';
import { OrdersTable } from './_components/OrdersTable';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';

export const dynamic = 'force-dynamic';

const LIMIT = 10;

export default async function RentalOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const statusFilter = params.status ?? '';

  const result = await getAllRentalOrders({
    page,
    limit: LIMIT,
    status: statusFilter || undefined,
  });

  const orders = result.success ? result.data : [];
  const totalPages = result.meta?.totalPages ?? 1;
  const total = result.meta?.total ?? 0;

  return (
    <div>
      <PageHeader
        title='My Rental Orders'
        description={`${total} total rental order${total !== 1 ? 's' : ''}`}
      />

      {result.error && <ErrorBanner title='Could not load rental orders' message={result.error} />}

      <Suspense fallback={<TableSkeleton rows={5} cols={4} />}>
        <OrdersTable
          orders={orders}
          page={page}
          totalPages={totalPages}
          total={total}
          statusFilter={statusFilter}
        />
      </Suspense>
    </div>
  );
}
