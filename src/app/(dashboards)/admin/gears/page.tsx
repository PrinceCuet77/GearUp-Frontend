'use client';

import { useState, useEffect, useCallback } from 'react';
import { Package, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TableSkeleton } from '@/components/Skeleton';
import { formatBDT } from '@/lib/gear-utils';
import type { GearItem } from '@/lib/types';
import { DUMMY_GEARS } from '@/lib/dummy-data';

const LIMIT = 5;

export default function AdminGearsPage() {
  const [gears, setGears] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const fetchGears = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    const start = (page - 1) * LIMIT;
    setGears(DUMMY_GEARS.slice(start, start + LIMIT));
    setTotalPages(Math.ceil(DUMMY_GEARS.length / LIMIT));
    setTotal(DUMMY_GEARS.length);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    void fetchGears();
  }, [fetchGears]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };
  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        title='All Gear Listings'
        description={`${total} item${total !== 1 ? 's' : ''} across all providers`}
      />

      <form onSubmit={handleSearch} className='mb-6 flex gap-2'>
        <div
          className='flex flex-1 items-center gap-2 rounded-lg border px-3'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <Search
            className='h-4 w-4 shrink-0'
            style={{ color: 'var(--muted-foreground)' }}
          />
          <input
            type='text'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Search by name, category or provider…'
            className='h-10 flex-1 bg-transparent text-sm outline-none'
            style={{ color: 'var(--foreground)' }}
          />
          {searchInput && (
            <button
              type='button'
              onClick={clearSearch}
              className='cursor-pointer'
            >
              <X
                className='h-4 w-4'
                style={{ color: 'var(--muted-foreground)' }}
              />
            </button>
          )}
        </div>
        <button
          type='submit'
          className='cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors'
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          Search
        </button>
      </form>

      <div
        className='rounded-xl border'
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
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
              No gear listings found
            </p>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr
                    className='border-b text-left text-xs font-semibold uppercase tracking-wide'
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    <th className='px-6 py-3'>Gear</th>
                    <th className='px-6 py-3'>Provider</th>
                    <th className='px-6 py-3'>Category</th>
                    <th className='px-6 py-3'>Price/Day</th>
                    <th className='px-6 py-3'>Stock</th>
                    <th className='px-6 py-3'>Status</th>
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
                          className='mt-0.5 max-w-50 truncate text-xs'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {gear.description}
                        </p>
                      </td>
                      <td
                        className='px-6 py-4 text-sm'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {gear.provider?.name ?? gear.provider?.email ?? '—'}
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
                        {formatBDT(gear.price)}
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
