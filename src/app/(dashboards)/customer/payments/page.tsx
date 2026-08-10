import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { getAllPayments } from './_actions/getAllPayments';
import { PaymentsTable } from './_components/PaymentsTable';
import { PaymentResult } from './_components/PaymentResult';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Payments · GearUp' };

const LIMIT = 10;

/** Gateway redirects come back to this route with an outcome in `status`. */
const RESULT_STATUSES = ['success', 'failed', 'cancelled'];

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
  const statusFilter = params.status ?? '';

  if (RESULT_STATUSES.includes(statusFilter)) {
    return (
      <PaymentResult
        status={statusFilter}
        orderId={params.orderId}
        tranId={params.tranId}
      />
    );
  }

  const page = Math.max(1, Number(params.page) || 1);
  const result = await getAllPayments({
    page,
    limit: LIMIT,
    status: statusFilter || undefined,
  });

  const total = result.meta?.total ?? result.data.length;

  return (
    <div>
      <PageHeader
        title='Payments'
        description={`${total} transaction${total === 1 ? '' : 's'} on your account.`}
      />

      {result.error && (
        <ErrorBanner
          title='Could not load payment history'
          message={result.error}
        />
      )}

      <PaymentsTable
        payments={result.data}
        page={page}
        totalPages={result.meta?.totalPages ?? 1}
        total={total}
        pageSize={LIMIT}
      />
    </div>
  );
}
