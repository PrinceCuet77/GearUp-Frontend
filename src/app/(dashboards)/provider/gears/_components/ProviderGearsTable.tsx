'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Package, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GearItem } from '@/lib/types';
import { parseGearImages } from '@/lib/gear-utils';
import { GearActions } from './GearActions';
import { useGearEdit, useGearAdd } from './ProviderGearsShell';

function formatCurrency(amount: string | number) {
  return `৳${Number(amount).toFixed(2)}`;
}

interface ProviderGearsTableProps {
  gears: GearItem[];
  page: number;
  totalPages: number;
  total: number;
}

export function ProviderGearsTable({
  gears,
  page,
  totalPages,
  total,
}: ProviderGearsTableProps) {
  const onEdit = useGearEdit();
  const onAdd = useGearAdd();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      return params.toString();
    },
    [searchParams],
  );

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString({ page: String(newPage) })}`);
  };

  if (gears.length === 0) {
    return (
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
        <button
          onClick={() => onAdd?.()}
          className='mt-4 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white'
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <PlusCircle className='h-4 w-4' />
          Add Your First Gear
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile card view */}
      <div className='block sm:hidden'>
        <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
          {gears.map((gear) => {
            const gearImages = parseGearImages(gear.images);
            return (
              <li key={gear.id} className='p-4'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-3'>
                      {gearImages.length > 0 && (
                        <img
                          src={gearImages[0]}
                          alt={gear.name}
                          className='h-12 w-12 rounded-lg object-cover shrink-0'
                        />
                      )}
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
                    </div>
                  </div>
                  <GearActions
                    gearId={gear.id}
                    gearName={gear.name}
                    gear={gear}
                    onEdit={() => onEdit?.(gear)}
                  />
                </div>
              </li>
            );
          })}
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
              <th className='px-6 py-3'>Image</th>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Category</th>
              <th className='px-6 py-3'>Price/Day</th>
              <th className='px-6 py-3'>Stock</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y' style={{ borderColor: 'var(--border)' }}>
            {gears.map((gear) => {
              const gearImages = parseGearImages(gear.images);
              return (
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
                    {gearImages.length > 0 ? (
                      <img
                        src={gearImages[0]}
                        alt={gear.name}
                        className='h-10 w-10 rounded-lg object-cover'
                      />
                    ) : (
                      <div
                        className='flex h-10 w-10 items-center justify-center rounded-lg'
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        <Package
                          className='h-5 w-5 opacity-40'
                          style={{ color: 'var(--muted-foreground)' }}
                        />
                      </div>
                    )}
                  </td>
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
                    <GearActions
                      gearId={gear.id}
                      gearName={gear.name}
                      gear={gear}
                      onEdit={() => onEdit?.(gear)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div
          className='flex items-center justify-between border-t px-6 py-4'
          style={{ borderColor: 'var(--border)' }}
        >
          <p className='text-sm' style={{ color: 'var(--muted-foreground)' }}>
            Page {page} of {totalPages} · {total} listing
            {total === 1 ? '' : 's'}
          </p>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
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
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
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
    </div>
  );
}
