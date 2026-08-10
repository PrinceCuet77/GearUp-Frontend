'use client';

import { Users } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { TableToolbar } from '@/components/dashboard/TableToolbar';
import { UserStatusBadge } from '@/components/dashboard/StatusBadge';
import { UserAvatar } from '@/components/dashboard/UserAvatar';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { useClientTable } from '@/lib/hooks';
import { formatShortDate } from '@/lib/gear-utils';
import type { UserStatus } from '@/lib/types';
import type { AdminUser } from '../users/_actions/getAllUsers';

const PAGE_SIZE = 5;

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

/** Newest accounts on the admin overview, with role/status filters and paging. */
export function RecentUsersTable({ users }: { users: AdminUser[] }) {
  const table = useClientTable(users, {
    pageSize: PAGE_SIZE,
    searchAccessor: (user) => `${user.name ?? ''} ${user.email}`,
    filters: [
      {
        key: 'role',
        label: 'Role',
        options: ROLE_OPTIONS,
        accessor: (user) => user.role,
      },
      {
        key: 'status',
        label: 'Status',
        options: STATUS_OPTIONS,
        accessor: (user) => user.status,
      },
    ],
    sorters: {
      name: (user) => user.name ?? user.email,
      createdAt: (user) => new Date(user.createdAt).getTime(),
    },
    initialSort: { key: 'createdAt', direction: 'desc' },
  });

  const columns: Array<DataTableColumn<AdminUser>> = [
    {
      id: 'name',
      header: 'Account',
      sortable: true,
      cell: (user) => (
        <div className='flex items-center gap-3'>
          <UserAvatar
            name={user.name}
            email={user.email}
            src={user.avatarUrl}
            size={32}
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
      id: 'createdAt',
      header: 'Joined',
      hideBelow: 'md',
      sortable: true,
      align: 'right',
      cell: (user) => (
        <span className='whitespace-nowrap text-muted-foreground'>
          {formatShortDate(user.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        searchValue={table.search}
        onSearchChange={table.setSearch}
        searchLabel='Find an account'
        searchPlaceholder='Search by name or email…'
        selects={[
          {
            key: 'role',
            label: 'Role',
            value: table.filterValues.role ?? '',
            options: ROLE_OPTIONS,
            onChange: (value) => table.setFilter('role', value),
          },
          {
            key: 'status',
            label: 'Status',
            value: table.filterValues.status ?? '',
            options: STATUS_OPTIONS,
            onChange: (value) => table.setFilter('status', value),
          },
        ]}
        hasActiveFilters={table.hasActiveFilters}
        onClearFilters={table.clearFilters}
      />

      <DataTable
        caption='Most recently registered accounts'
        columns={columns}
        rows={table.rows}
        getRowKey={(user) => user.id}
        emptyIcon={Users}
        emptyTitle={
          table.hasActiveFilters ? 'No matching accounts' : 'No accounts yet'
        }
        emptyDescription={
          table.hasActiveFilters
            ? 'Try a different search term, role or status.'
            : 'Registered users will appear here as they sign up.'
        }
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSort={table.toggleSort}
        footer={
          <Pagination
            page={table.page}
            totalPages={table.totalPages}
            total={table.filteredCount}
            pageSize={PAGE_SIZE}
            onPageChange={table.setPage}
            itemLabel='accounts'
          />
        }
      />
    </div>
  );
}
