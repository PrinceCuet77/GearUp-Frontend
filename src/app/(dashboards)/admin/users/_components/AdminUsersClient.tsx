'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserStatusBadge } from '@/components/dashboard/StatusBadge';
import { TableSkeleton } from '@/components/Skeleton';
import { changeUserStatus } from '../_actions/changeUserStatus';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import type { AdminUser, AdminUserMeta } from '../_actions/getAllUsers';
import type { UserStatus } from '@/lib/types';
import { formatDate } from '@/lib/gear-utils';

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: 'Customer',
  PROVIDER: 'Provider',
  ADMIN: 'Admin',
};

interface AdminUsersClientProps {
  initialUsers: AdminUser[];
  initialMeta: AdminUserMeta;
  initialSearch: string;
  error: string | null;
}

export function AdminUsersClient({
  initialUsers,
  initialMeta,
  initialSearch,
  error,
}: AdminUsersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [meta, setMeta] = useState<AdminUserMeta>(initialMeta);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [toggling, setToggling] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const page = meta.page;
  const totalPages = meta.totalPages;

  const buildUrl = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(overrides)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.set('page', overrides.page ?? '1');
      return `?${params.toString()}`;
    },
    [searchParams],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ search: searchInput.trim(), page: '1' }));
  };

  const clearSearch = () => {
    setSearchInput('');
    router.push(buildUrl({ search: '', page: '1' }));
  };

  const goToPage = (newPage: number) => {
    router.push(buildUrl({ page: String(newPage) }));
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setToggling(userId);
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const result = await changeUserStatus(
      userId,
      newStatus as 'SUSPENDED' | 'ACTIVE',
    );

    if (result.success) {
      toast.success(result.message);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                status: currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
              }
            : u,
        ),
      );
    } else {
      toast.error(result.message);
    }
    setToggling(null);
  };

  // Sync users when initial props change (navigation)
  useEffect(() => {
    setUsers(initialUsers);
    setMeta(initialMeta);
  }, [initialUsers, initialMeta]);

  return (
    <div>
      {error && <ErrorBanner message={error} title='Could not load users' />}

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
            placeholder='Search by name or email…'
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
        ) : users.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <Users
              className='mb-3 h-10 w-10 opacity-30'
              style={{ color: 'var(--muted-foreground)' }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--muted-foreground)' }}
            >
              No users found
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
                    <th className='px-6 py-3'>Email</th>
                    <th className='px-6 py-3'>Role</th>
                    <th className='px-6 py-3'>Status</th>
                    <th className='px-6 py-3'>Joined</th>
                    <th className='px-6 py-3'>Actions</th>
                  </tr>
                </thead>
                <tbody
                  className='divide-y'
                  style={{ borderColor: 'var(--border)' }}
                >
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className='transition-colors'
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div
                            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden'
                            style={{
                              backgroundColor: user.avatarUrl
                                ? 'transparent'
                                : user.role === 'ADMIN'
                                  ? '#ef4444'
                                  : user.role === 'PROVIDER'
                                    ? '#22c55e'
                                    : '#3b82f6',
                            }}
                          >
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt={`${user.email}'s avatar`}
                                className='h-full w-full object-cover'
                              />
                            ) : (
                              <span className='text-xs font-bold text-white'>
                                {user.email[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className='min-w-0'>
                            <p
                              className='truncate text-sm font-medium'
                              style={{ color: 'var(--foreground)' }}
                            >
                              {user.name ?? '-'}
                            </p>
                            <p
                              className='truncate text-xs'
                              style={{ color: 'var(--muted-foreground)' }}
                            >
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td
                        className='px-6 py-4 text-sm'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {ROLE_LABELS[user.role] ?? user.role}
                      </td>
                      <td className='px-6 py-4'>
                        <UserStatusBadge status={user.status as UserStatus} />
                      </td>
                      <td
                        className='px-6 py-4 text-sm'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {formatDate(user.createdAt)}
                      </td>
                      <td className='px-6 py-4'>
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() =>
                              handleToggleStatus(user.id, user.status)
                            }
                            disabled={toggling === user.id}
                            className='cursor-pointer inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors disabled:opacity-50'
                            style={
                              user.status === 'ACTIVE'
                                ? {
                                    backgroundColor: 'rgba(239,68,68,0.08)',
                                    color: '#ef4444',
                                  }
                                : {
                                    backgroundColor: 'rgba(34,197,94,0.08)',
                                    color: '#16a34a',
                                  }
                            }
                          >
                            {toggling === user.id && (
                              <Loader2 className='h-3.5 w-3.5 animate-spin' />
                            )}
                            {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
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
                    onClick={() => goToPage(page - 1)}
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
                    onClick={() => goToPage(page + 1)}
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
