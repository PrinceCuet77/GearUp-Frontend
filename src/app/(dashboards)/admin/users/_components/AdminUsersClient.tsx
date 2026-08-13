'use client';

import { useEffect, useState } from 'react';
import { Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/dashboard/DataTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { TableToolbar } from '@/components/dashboard/TableToolbar';
import { UserStatusBadge } from '@/components/dashboard/StatusBadge';
import { UserAvatar } from '@/components/dashboard/UserAvatar';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useDebouncedValue, useUrlQuery } from '@/lib/hooks';
import { formatDate } from '@/lib/gear-utils';
import type { UserStatus } from '@/lib/types';
import { changeUserStatus } from '../_actions/changeUserStatus';
import type { AdminUser, AdminUserMeta } from '../_actions/getAllUsers';

const ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'CUSTOMER', label: 'Customers' },
  { value: 'PROVIDER', label: 'Providers' },
  { value: 'ADMIN', label: 'Admins' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

const ROLE_TONE: Record<string, BadgeTone> = {
  ADMIN: 'primary',
  PROVIDER: 'secondary',
  CUSTOMER: 'accent',
};

interface AdminUsersClientProps {
  initialUsers: AdminUser[];
  meta: AdminUserMeta;
  error: string | null;
}

/**
 * User management table.
 *
 * Search, role, status and page all live in the URL, so a filtered view is
 * shareable and the backend does the paging - the client only mirrors it.
 */
export function AdminUsersClient({
  initialUsers,
  meta,
  error,
}: AdminUsersClientProps) {
  const query = useUrlQuery();
  const urlSearch = query.get('search');

  const [users, setUsers] = useState(initialUsers);
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);
  const [toggling, setToggling] = useState(false);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  // Re-seed from the server whenever a new page of users arrives. Comparing
  // the prop against its last-seen value during render avoids committing the
  // stale list for a frame before an effect corrects it.
  const [lastInitial, setLastInitial] = useState(initialUsers);
  if (initialUsers !== lastInitial) {
    setLastInitial(initialUsers);
    setUsers(initialUsers);
  }

  // Push the debounced term into the URL; typing itself must not navigate.
  useEffect(() => {
    if (debouncedSearch !== urlSearch) query.set({ search: debouncedSearch });
    // `query` is rebuilt each render - depending on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, urlSearch]);

  const handleToggleStatus = async () => {
    if (!pendingUser) return;
    const nextStatus: UserStatus =
      pendingUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

    setToggling(true);
    const result = await changeUserStatus(pendingUser.id, nextStatus);
    setToggling(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setUsers((previous) =>
      previous.map((user) =>
        user.id === pendingUser.id ? { ...user, status: nextStatus } : user,
      ),
    );
    setPendingUser(null);
  };

  const hasActiveFilters = Boolean(
    searchInput || query.get('role') || query.get('status'),
  );

  const columns: Array<DataTableColumn<AdminUser>> = [
    {
      id: 'account',
      header: 'Account',
      cell: (user) => (
        <div className='flex items-center gap-3'>
          <UserAvatar
            name={user.name}
            email={user.email}
            src={user.avatarUrl}
            size={36}
          />
          <div className='min-w-0'>
            <p className='truncate font-medium text-foreground'>
              {user.name || 'No name set'}
            </p>
            <p className='truncate text-xs text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      hideBelow: 'md',
      cell: (user) => (
        <Badge tone={ROLE_TONE[user.role] ?? 'neutral'} size='sm'>
          {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
        </Badge>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      hideBelow: 'sm',
      cell: (user) => <UserStatusBadge status={user.status as UserStatus} />,
    },
    {
      id: 'joined',
      header: 'Joined',
      hideBelow: 'md',
      cell: (user) => (
        <span className='whitespace-nowrap text-muted-foreground'>
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (user) =>
        user.role === 'ADMIN' ? (
          <span className='text-xs text-muted-foreground'>Protected</span>
        ) : (
          <button
            type='button'
            onClick={() => setPendingUser(user)}
            disabled={toggling && pendingUser?.id === user.id}
            className={
              user.status === 'ACTIVE'
                ? 'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-control bg-danger-soft px-3 text-xs font-semibold text-danger-soft-foreground transition-opacity hover:opacity-80 disabled:opacity-50'
                : 'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-control bg-secondary-soft px-3 text-xs font-semibold text-secondary-soft-foreground transition-opacity hover:opacity-80 disabled:opacity-50'
            }
          >
            {toggling && pendingUser?.id === user.id && (
              <Loader2
                className='h-3.5 w-3.5 animate-spin'
                aria-hidden='true'
              />
            )}
            {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
            <span className='sr-only'> {user.email}</span>
          </button>
        ),
    },
  ];

  return (
    <div>
      {error && <ErrorBanner message={error} title='Could not load users' />}

      <TableToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchLabel='Find an account'
        searchPlaceholder='Search by name or email…'
        selects={[
          {
            key: 'role',
            label: 'Role',
            value: query.get('role'),
            options: ROLE_OPTIONS,
            onChange: (value) => query.set({ role: value }),
          },
          {
            key: 'status',
            label: 'Status',
            value: query.get('status'),
            options: STATUS_OPTIONS,
            onChange: (value) => query.set({ status: value }),
          },
        ]}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => {
          setSearchInput('');
          query.clear();
        }}
        isPending={query.isPending}
      />

      <DataTable
        caption='All registered GearUp accounts'
        columns={columns}
        rows={users}
        getRowKey={(user) => user.id}
        loading={query.isPending && users.length === 0}
        emptyIcon={Users}
        emptyTitle={
          hasActiveFilters ? 'No matching accounts' : 'No accounts yet'
        }
        emptyDescription={
          hasActiveFilters
            ? 'No accounts match these filters. Try a different name, role or status.'
            : 'Registered users will appear here as they sign up.'
        }
        footer={
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            pageSize={meta.limit}
            onPageChange={(page) => query.set({ page })}
            itemLabel='accounts'
            isPending={query.isPending}
          />
        }
      />

      <ConfirmDialog
        open={Boolean(pendingUser)}
        onClose={() => !toggling && setPendingUser(null)}
        onConfirm={handleToggleStatus}
        loading={toggling}
        tone={pendingUser?.status === 'ACTIVE' ? 'danger' : 'primary'}
        title={
          pendingUser?.status === 'ACTIVE'
            ? 'Suspend this account?'
            : 'Reactivate this account?'
        }
        confirmLabel={pendingUser?.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
        description={
          pendingUser?.status === 'ACTIVE' ? (
            <>
              <strong className='text-foreground'>{pendingUser?.email}</strong>{' '}
              will lose access to GearUp until the account is reactivated.
            </>
          ) : (
            <>
              <strong className='text-foreground'>{pendingUser?.email}</strong>{' '}
              will regain full access to GearUp.
            </>
          )
        }
      />
    </div>
  );
}
