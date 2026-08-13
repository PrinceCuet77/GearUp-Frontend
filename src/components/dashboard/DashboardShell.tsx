'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartColumn,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Tag,
  User,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { UserAvatar } from './UserAvatar';
import { cn } from '@/lib/cn';
import type { UserRole } from '@/lib/types';

/**
 * Icons are passed by name so the nav definitions can live in Server
 * Component layouts without shipping a component reference across the boundary.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  ChartColumn,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Tag,
  User,
  Users,
};

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  /** Sidebar section this item belongs to. */
  group: string;
  /** Match the pathname exactly (used by the overview root). */
  exact?: boolean;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  /** Dashboard root for this role, e.g. `/admin`. */
  basePath: string;
  /** Shown next to the workspace name in the sidebar header. */
  roleLabel: string;
}

const ROLE_TONE: Record<UserRole, BadgeTone> = {
  ADMIN: 'primary',
  PROVIDER: 'secondary',
  CUSTOMER: 'accent',
};

export function DashboardShell({
  children,
  navItems,
  basePath,
  roleLabel,
}: DashboardShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  // Close the mobile drawer on navigation. Adjusting during render rather than
  // in an effect avoids the extra commit that paints the open drawer on top of
  // the page the user just navigated to.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
  }

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const activeItem = navItems.find(isActive);
  const groups = navItems.reduce<Array<{ name: string; items: NavItem[] }>>(
    (accumulator, item) => {
      const group = accumulator.find((entry) => entry.name === item.group);
      if (group) group.items.push(item);
      else accumulator.push({ name: item.group, items: [item] });
      return accumulator;
    },
    [],
  );

  const navigation = (
    <nav
      aria-label='Dashboard sections'
      className='flex-1 space-y-6 overflow-y-auto px-3 py-5'
    >
      {groups.map((group) => (
        <div key={group.name}>
          <p className='mb-1.5 px-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
            {group.name}
          </p>
          <ul className='space-y-0.5'>
            {group.items.map((item) => {
              const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
              const active = isActive(item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                      active
                        ? 'bg-primary-soft font-semibold text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Icon className='h-4 w-4 shrink-0' aria-hidden='true' />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const sidebarFooter = user && (
    <div className='shrink-0 border-t border-border p-4'>
      <Link
        href={`${basePath}/profile`}
        className='flex items-center gap-3 rounded-control p-2 transition-colors hover:bg-muted'
      >
        <UserAvatar
          name={user.name}
          email={user.email}
          src={user.avatarUrl}
          size={36}
        />
        <span className='min-w-0 flex-1'>
          <span className='block truncate text-sm font-semibold text-foreground'>
            {user.name ?? 'User'}
          </span>
          <span className='block truncate text-xs text-muted-foreground'>
            {user.email}
          </span>
        </span>
      </Link>
    </div>
  );

  return (
    <div className='flex min-h-[calc(100vh-var(--app-header-h))] bg-background'>
      {/* Mobile drawer scrim */}
      {drawerOpen && (
        <button
          type='button'
          aria-label='Close navigation'
          onClick={() => setDrawerOpen(false)}
          className='fixed inset-0 z-40 cursor-default lg:hidden'
          style={{ backgroundColor: 'var(--overlay)' }}
        />
      )}

      {/* Mobile drawer */}
      <aside
        aria-hidden={!drawerOpen}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out lg:hidden',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className='flex h-16 shrink-0 items-center justify-between border-b border-border px-4'>
          <span className='text-sm font-bold text-foreground'>
            {roleLabel} Workspace
          </span>
          <button
            type='button'
            onClick={() => setDrawerOpen(false)}
            aria-label='Close navigation'
            className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <X className='h-4 w-4' aria-hidden='true' />
          </button>
        </div>
        {navigation}
        {sidebarFooter}
      </aside>

      {/* Desktop sidebar. The rail carries the surface so it runs the full
          height of the page, while the nav inside sticks to the viewport. */}
      <div className='hidden w-64 shrink-0 border-r border-border bg-card lg:block'>
        <aside className='sticky top-[var(--app-header-h)] flex h-[calc(100vh-var(--app-header-h))] flex-col'>
          <div className='flex shrink-0 items-center gap-2.5 border-b border-border px-5 py-4'>
            <span className='flex h-8 w-8 items-center justify-center rounded-control bg-primary-soft'>
              <LayoutDashboard
                className='h-4 w-4 text-primary'
                aria-hidden='true'
              />
            </span>
            <span className='min-w-0'>
              <span className='block truncate text-sm font-bold text-foreground'>
                {roleLabel}
              </span>
              <span className='block text-[11px] text-muted-foreground'>
                Workspace
              </span>
            </span>
          </div>
          {navigation}
          {sidebarFooter}
        </aside>
      </div>

      <div className='flex min-w-0 flex-1 flex-col'>
        {/* Dashboard topbar */}
        <header className='sticky top-[var(--app-header-h)] z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6'>
          <div className='flex min-w-0 items-center gap-3'>
            <button
              type='button'
              onClick={() => setDrawerOpen(true)}
              aria-label='Open navigation'
              aria-expanded={drawerOpen}
              className='flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-control text-foreground transition-colors hover:bg-muted lg:hidden'
            >
              <Menu className='h-5 w-5' aria-hidden='true' />
            </button>

            <p className='min-w-0 truncate text-sm font-bold text-foreground'>
              {activeItem?.label ?? `${roleLabel} Dashboard`}
            </p>

            {user && (
              <Badge
                tone={ROLE_TONE[user.role] ?? 'neutral'}
                size='sm'
                className='hidden sm:inline-flex'
              >
                {roleLabel}
              </Badge>
            )}
          </div>
        </header>

        <main className='flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8'>
          {children}
        </main>
      </div>
    </div>
  );
}
