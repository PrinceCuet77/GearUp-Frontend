'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { UserStatusBadge } from '@/components/dashboard/StatusBadge';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TableSkeleton } from '@/components/Skeleton';
import type { User, UserStatus } from '@/lib/types';
import { DUMMY_USERS } from '@/lib/dummy-data';

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: 'Customer',
  PROVIDER: 'Provider',
  ADMIN: 'Admin',
};
const LIMIT = 5;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [toggling, setToggling] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    const q = search.toLowerCase();
    const filtered = q
      ? DUMMY_USERS.filter(
          (u) =>
            (u.name ?? '').toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        )
      : DUMMY_USERS;
    const start = (page - 1) * LIMIT;
    setUsers(filtered.slice(start, start + LIMIT));
    setTotalPages(Math.ceil(filtered.length / LIMIT));
    setTotal(filtered.length);
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

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

  const toggleStatus = async (userId: string, currentStatus: UserStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setToggling(userId);
    await new Promise((r) => setTimeout(r, 400));
    toast.success(
      `User ${newStatus === 'ACTIVE' ? 'activated' : 'suspended'}. (demo)`,
    );
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
    );
    setToggling(null);
  };

  return (
    <div>
      <PageHeader
        title='User Management'
        description={`${total} registered user${total !== 1 ? 's' : ''}`}
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
            placeholder='Search by name or email…'
            className='h-10 flex-1 bg-transparent text-sm outline-none'
            style={{ color: 'var(--foreground)' }}
          />
          {searchInput && (
            <button type='button' onClick={clearSearch}>
              <X
                className='h-4 w-4'
                style={{ color: 'var(--muted-foreground)' }}
              />
            </button>
          )}
        </div>
        <button
          type='submit'
          className='rounded-lg px-4 py-2 text-sm font-semibold transition-colors'
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
                    <th className='px-6 py-3'>User</th>
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
                            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white'
                            style={{
                              backgroundColor:
                                user.role === 'ADMIN'
                                  ? '#ef4444'
                                  : user.role === 'PROVIDER'
                                    ? '#22c55e'
                                    : '#3b82f6',
                            }}
                          >
                            {(user.name?.[0] ?? user.email[0]).toUpperCase()}
                          </div>
                          <div className='min-w-0'>
                            <p
                              className='truncate text-sm font-medium'
                              style={{ color: 'var(--foreground)' }}
                            >
                              {user.name ?? 'No name'}
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
                        <UserStatusBadge status={user.status} />
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
                            onClick={() => toggleStatus(user.id, user.status)}
                            disabled={toggling === user.id}
                            className='inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors disabled:opacity-50'
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
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className='flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
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
                    className='flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40'
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
