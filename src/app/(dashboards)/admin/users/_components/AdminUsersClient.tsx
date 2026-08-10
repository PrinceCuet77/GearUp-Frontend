'use client';

import { useState, useCallback } from 'react';
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
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
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

/** Initial-avatar tint per role — brand tones only, defined in both themes. */
const ROLE_AVATAR_CLASS: Record<string, string> = {
  CUSTOMER: 'bg-accent-soft text-accent-soft-foreground',
  PROVIDER: 'bg-secondary-soft text-secondary-soft-foreground',
  ADMIN: 'bg-primary-soft text-primary-soft-foreground',
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

  // Re-seed the table when the server sends a new page of users. Comparing the
  // prop against its last-seen value during render replaces the previous
  // effect, which committed the stale list for one frame before correcting it.
  const [lastInitialUsers, setLastInitialUsers] = useState(initialUsers);
  if (initialUsers !== lastInitialUsers) {
    setLastInitialUsers(initialUsers);
    setUsers(initialUsers);
    setMeta(initialMeta);
  }

  return (
    <div>
      {error && <ErrorBanner message={error} title='Could not load users' />}

      <form onSubmit={handleSearch} className='mb-6 flex gap-2'>
        <div className='relative flex-1'>
          <label htmlFor='admin-user-search' className='sr-only'>
            Search users by name or email
          </label>
          <Search
            className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground'
            aria-hidden='true'
          />
          <input
            id='admin-user-search'
            type='search'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Search by name or email…'
            className='field-input h-11 py-0 pr-9 pl-9'
          />
          {searchInput && (
            <button
              type='button'
              onClick={clearSearch}
              aria-label='Clear search'
              className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>
        <Button type='submit'>Search</Button>
      </form>

      {users.length === 0 ? (
        <EmptyState
          icon={Users}
          title='No users found'
          description={
            initialSearch
              ? 'No accounts match that search. Try a different name or email.'
              : 'No user accounts exist yet.'
          }
        />
      ) : (
        <div className='surface-card overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[720px]'>
                <thead>
                  <tr className='border-b border-border text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
                    <th className='px-6 py-3'>Email</th>
                    <th className='px-6 py-3'>Role</th>
                    <th className='px-6 py-3'>Status</th>
                    <th className='px-6 py-3'>Joined</th>
                    <th className='px-6 py-3'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className='transition-colors hover:bg-muted'
                    >
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full ${
                              user.avatarUrl ? '' : (ROLE_AVATAR_CLASS[user.role] ?? "bg-muted text-muted-foreground")
                            }`}
                          >
                            {user.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={user.avatarUrl}
                                alt={`${user.email}'s avatar`}
                                className='h-full w-full object-cover'
                              />
                            ) : (
                              <span className='text-xs font-bold'>
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
                            className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-control px-3 text-xs font-semibold transition-colors disabled:opacity-50 ${
                              user.status === 'ACTIVE'
                                ? 'bg-danger-soft text-danger-soft-foreground hover:bg-danger-soft/70'
                                : 'bg-secondary-soft text-secondary-soft-foreground hover:bg-secondary-soft/70'
                            }`}
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
              <div className='flex items-center justify-between gap-4 border-t border-border px-6 py-4'>
                <p className='text-sm text-muted-foreground'>
                  Page {page} of {totalPages}
                </p>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    aria-label='Previous page'
                    className='w-9 px-0'
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    aria-label='Next page'
                    className='w-9 px-0'
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
