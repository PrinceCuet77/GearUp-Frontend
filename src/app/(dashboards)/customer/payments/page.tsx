import { Suspense } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { getAllPayments } from './_actions/getAllPayments';
import { PaymentsTable } from './_components/PaymentsTable';
import { PaymentResult } from './_components/PaymentResult';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';

const LIMIT = 10;

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
    orderId?: string;
    tranId?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const statusFilter = params.status ?? '';
  const orderId = params.orderId;
  const tranId = params.tranId;

  // Handle payment result pages
  if (['success', 'failed', 'cancelled'].includes(statusFilter)) {
    return (
      <PaymentResult status={statusFilter} orderId={orderId} tranId={tranId} />
    );
  }

  const result = await getAllPayments({
    page,
    limit: LIMIT,
    status: statusFilter || undefined,
  });

  const payments = result.success ? result.data : [];
  const totalPages = result.meta?.totalPages ?? 1;
  const total = result.meta?.total ?? 0;

  return (
    <div>
      <PageHeader
        title='Payment History'
        description={`${total} transaction${total !== 1 ? 's' : ''}`}
      />

      {result.error && (
        <ErrorBanner
          title='Could not load payment history'
          message={result.error}
        />
      )}

      <Suspense fallback={<TableSkeleton rows={5} cols={5} />}>
        <PaymentsTable
          payments={payments}
          page={page}
          totalPages={totalPages}
          total={total}
          statusFilter={statusFilter}
        />
      </Suspense>
    </div>
  );
}
