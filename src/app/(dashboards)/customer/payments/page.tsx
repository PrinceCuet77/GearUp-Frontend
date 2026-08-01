import { Suspense } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { getAllPayments } from './_actions/getAllPayments';
import { PaymentsTable } from './_components/PaymentsTable';
import { ErrorToast } from './_components/ErrorToast';

export const dynamic = 'force-dynamic';

const LIMIT = 10;

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const statusFilter = params.status ?? '';

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
        <>
          <ErrorToast message={result.error} />
          <div
            className='mb-6 flex items-start gap-3 rounded-xl border-2 p-4'
            style={{
              backgroundColor: 'color-mix(in srgb, #f97316 10%, transparent)',
              borderColor: 'color-mix(in srgb, #f97316 40%, transparent)',
            }}
          >
            <p className='text-sm' style={{ color: '#9a3412' }}>
              {result.error}
            </p>
          </div>
        </>
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
