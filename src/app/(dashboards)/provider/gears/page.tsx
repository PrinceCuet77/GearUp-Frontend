'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Package,
  PlusCircle,
  Pencil,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TableSkeleton } from '@/components/ui/Skeleton';
import type { GearItem } from '@/lib/types';
import { DUMMY_GEARS, DUMMY_PROVIDER } from '@/lib/dummy-data';

const PROVIDER_GEARS = DUMMY_GEARS.filter(
  (g) => g.providerId === DUMMY_PROVIDER.id,
);

function formatCurrency(amount: string | number) {
  return `$${Number(amount).toFixed(2)}`;
}

export default function ProviderGearPage() {
  const [gears, setGears] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchGears = useCallback(async () => {
    setLoading(true);

    await new Promise((r) => setTimeout(r, 200));
    const start = (page - 1) * 10;
    setGears(PROVIDER_GEARS.slice(start, start + 10));
    setTotalPages(Math.ceil(PROVIDER_GEARS.length / 10));
    setTotal(PROVIDER_GEARS.length);

    setLoading(false);
  }, [page]);

  useEffect(() => {
    void fetchGears();
  }, [fetchGears]);

  const handleDelete = async (gearId: string, gearName: string) => {
    if (!confirm(`Delete "${gearName}"? This cannot be undone.`)) return;
    setDeleting(gearId);

    await new Promise((r) => setTimeout(r, 400));

    toast.success(`"${gearName}" removed from inventory. (demo)`);
    setGears((prev) => prev.filter((g) => g.id !== gearId));
    setTotal((t) => t - 1);
    setDeleting(null);
  };

  return (
    <div>
      <PageHeader
        title='My Gear'
        description={`${total} item${total !== 1 ? 's' : ''} in inventory`}
        action={
          <Link
            href='/provider/gear/new'
            className='inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition-colors'
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <PlusCircle className='h-4 w-4' />
            Add Gear
          </Link>
        }
      />

      <div
        className='rounded-xl border'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : gears.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <Package
              className='mb-3 h-10 w-10 opacity-30'
              style={{ color: 'var(--muted-foreground)' }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--muted-foreground)' }}
            >
              No gear listed yet
            </p>
            <Link
              href='/provider/gear/new'
              className='mt-4 inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <PlusCircle className='h-4 w-4' />
              Add Your First Gear
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className='block sm:hidden'>
              <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
                {gears.map((gear) => (
                  <li key={gear.id} className='p-4'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0 flex-1'>
                        <p
                          className='truncate font-medium'
                          style={{ color: 'var(--foreground)' }}
                        >
                          {gear.name}
                        </p>
                        <p
                          className='mt-0.5 text-sm'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {formatCurrency(gear.price)}/day · Stock: {gear.stock}
                        </p>
                        <span
                          className='mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold'
                          style={
                            gear.isActive
                              ? {
                                  backgroundColor: 'rgba(34,197,94,0.12)',
                                  color: '#16a34a',
                                }
                              : {
                                  backgroundColor: 'var(--muted)',
                                  color: 'var(--muted-foreground)',
                                }
                          }
                        >
                          {gear.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Link
                          href={`/provider/gear/${gear.id}/edit`}
                          className='flex h-8 w-8 items-center justify-center rounded-lg transition-colors'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          <Pencil className='h-4 w-4' />
                        </Link>
                        <button
                          onClick={() => handleDelete(gear.id, gear.name)}
                          disabled={deleting === gear.id}
                          className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg transition-colors'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {deleting === gear.id ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <Trash2 className='h-4 w-4' />
                          )}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop table view */}
            <div className='hidden overflow-x-auto sm:block'>
              <table className='w-full'>
                <thead>
                  <tr
                    className='border-b text-left text-xs font-semibold uppercase tracking-wide'
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    <th className='px-6 py-3'>Name</th>
                    <th className='px-6 py-3'>Category</th>
                    <th className='px-6 py-3'>Price/Day</th>
                    <th className='px-6 py-3'>Stock</th>
                    <th className='px-6 py-3'>Status</th>
                    <th className='px-6 py-3'>Actions</th>
                  </tr>
                </thead>
                <tbody
                  className='divide-y'
                  style={{ borderColor: 'var(--border)' }}
                >
                  {gears.map((gear) => (
                    <tr
                      key={gear.id}
                      className='transition-colors'
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td className='px-6 py-4'>
                        <p
                          className='text-sm font-medium'
                          style={{ color: 'var(--foreground)' }}
                        >
                          {gear.name}
                        </p>
                        <p
                          className='truncate text-xs'
                          style={{
                            color: 'var(--muted-foreground)',
                            maxWidth: '240px',
                          }}
                        >
                          {gear.description}
                        </p>
                      </td>
                      <td
                        className='px-6 py-4 text-sm'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {gear.category?.name ?? '—'}
                      </td>
                      <td
                        className='px-6 py-4 text-sm font-semibold'
                        style={{ color: 'var(--foreground)' }}
                      >
                        {formatCurrency(gear.price)}
                      </td>
                      <td
                        className='px-6 py-4 text-sm'
                        style={{ color: 'var(--foreground)' }}
                      >
                        {gear.stock}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className='inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold'
                          style={
                            gear.isActive
                              ? {
                                  backgroundColor: 'rgba(34,197,94,0.12)',
                                  color: '#16a34a',
                                }
                              : {
                                  backgroundColor: 'var(--muted)',
                                  color: 'var(--muted-foreground)',
                                }
                          }
                        >
                          {gear.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <Link
                            href={`/provider/gear/${gear.id}/edit`}
                            className='flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors'
                            style={{
                              backgroundColor: 'var(--muted)',
                              color: 'var(--foreground)',
                            }}
                          >
                            <Pencil className='h-3 w-3' />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(gear.id, gear.name)}
                            disabled={deleting === gear.id}
                            className='cursor-pointer flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors disabled:opacity-50'
                            style={{
                              backgroundColor: 'rgba(239,68,68,0.08)',
                              color: '#ef4444',
                            }}
                          >
                            {deleting === gear.id ? (
                              <Loader2 className='h-3 w-3 animate-spin' />
                            ) : (
                              <Trash2 className='h-3 w-3' />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div
                className='flex items-center justify-between border-t px-6 py-4'
                style={{ borderColor: 'var(--border)' }}
              >
                <p
                  className='text-sm'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Page {page} of {totalPages}
                </p>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
