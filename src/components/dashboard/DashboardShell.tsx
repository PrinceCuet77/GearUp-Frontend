'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  LogOut,
  ChevronRight,
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Star,
  User,
  Users,
  Package,
  Tag,
  ClipboardList,
  PlusCircle,
  Lock,
  type LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { logoutAction } from '@/app/(auth)/_actions/logoutActions';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Star,
  User,
  Users,
  Package,
  Tag,
  ClipboardList,
  PlusCircle,
  Lock,
};

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

/** Role identity uses brand tones only, so the chrome themes with the app. */
const ROLE_META: Record<string, { label: string; tone: BadgeTone }> = {
  CUSTOMER: { label: 'Customer', tone: 'accent' },
  PROVIDER: { label: 'Provider', tone: 'secondary' },
  ADMIN: { label: 'Admin', tone: 'primary' },
};

const OVERVIEW_PATHS = new Set(['/admin', '/customer', '/provider']);

function getInitials(name?: string | null, email?: string): string {
  if (name)
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  return (email?.[0] ?? 'U').toUpperCase();
}

export function DashboardShell({ children, navItems }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  // Close the mobile sidebar on navigation. Adjusting during render rather than
  // in an effect avoids the extra commit that briefly paints the open sidebar
  // on top of the page the user just navigated to.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setSidebarOpen(false);
  }

  const isActive = (href: string) =>
    OVERVIEW_PATHS.has(href) ? pathname === href : pathname.startsWith(href);
  const role = user?.role ?? 'CUSTOMER';
  const meta = ROLE_META[role] ?? ROLE_META.CUSTOMER;
  const initials = getInitials(user?.name, user?.email);

  return (
    <div
      className='flex bg-background'
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-30 lg:hidden'
          style={{ backgroundColor: 'var(--overlay)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed bottom-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{ top: '4rem' }}
      >
        <nav className='flex-1 overflow-y-auto px-3 py-5'>
          <p className='mb-2 px-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
            Navigation
          </p>
          <ul className='space-y-0.5'>
            {navItems.map((item) => {
              const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                      active
                        ? 'bg-primary-soft text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Icon className='h-4 w-4 shrink-0' aria-hidden='true' />
                    <span className='flex-1'>{item.label}</span>
                    {active && (
                      <ChevronRight
                        className='h-3.5 w-3.5 shrink-0 opacity-50'
                        aria-hidden='true'
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className='shrink-0 border-t border-border p-4'>
          {user && (
            <>
              <div className='mb-3 flex items-center gap-3'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground'>
                  {user.avatarUrl && !avatarFailed ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name ?? user.email}
                      width={36}
                      height={36}
                      className='h-9 w-9 rounded-full object-cover'
                      onError={() => setAvatarFailed(true)}
                      unoptimized
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-semibold text-foreground'>
                    {user.name ?? 'User'}
                  </p>
                  <p className='truncate text-xs text-muted-foreground'>
                    {user.email}
                  </p>
                </div>
              </div>

              <Badge tone={meta.tone} size='sm' className='mb-3'>
                {meta.label}
              </Badge>
            </>
          )}

          <form action={logoutAction}>
            <button
              type='submit'
              className='flex w-full cursor-pointer items-center gap-2.5 rounded-control px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-danger-soft hover:text-danger'
            >
              <LogOut className='h-4 w-4 shrink-0' aria-hidden='true' />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <div className='flex min-w-0 flex-1 flex-col lg:ml-64'>
        <div className='flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:hidden'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-control text-foreground transition-colors hover:bg-muted'
            aria-label='Open navigation'
          >
            <Menu className='h-5 w-5' />
          </button>
          <Badge tone={meta.tone} size='md'>
            {meta.label} Dashboard
          </Badge>
        </div>
        <main className='flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8'>
          {children}
        </main>
      </div>
    </div>
  );
}
