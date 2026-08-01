'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import {
  Menu,
  Sun,
  Moon,
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

const ROLE_META: Record<
  string,
  { label: string; avatarBg: string; badgeBg: string; badgeColor: string }
> = {
  CUSTOMER: {
    label: 'Customer',
    avatarBg: '#3b82f6',
    badgeBg: 'rgba(59,130,246,0.12)',
    badgeColor: '#3b82f6',
  },
  PROVIDER: {
    label: 'Provider',
    avatarBg: '#22c55e',
    badgeBg: 'rgba(34,197,94,0.12)',
    badgeColor: '#22c55e',
  },
  ADMIN: {
    label: 'Admin',
    avatarBg: '#ef4444',
    badgeBg: 'rgba(239,68,68,0.12)',
    badgeColor: '#ef4444',
  },
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
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    OVERVIEW_PATHS.has(href) ? pathname === href : pathname.startsWith(href);
  const role = user?.role ?? 'CUSTOMER';
  const meta = ROLE_META[role] ?? ROLE_META.CUSTOMER;
  const initials = getInitials(user?.name, user?.email);

  return (
    <div
      className='flex'
      style={{
        minHeight: 'calc(100vh - 4rem)',
        backgroundColor: 'var(--background)',
      }}
    >
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-30 lg:hidden'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          'fixed bottom-0 left-0 z-40 flex w-64 flex-col border-r transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        style={{
          top: '4rem',
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <nav className='flex-1 overflow-y-auto px-3 py-5'>
          <p
            className='mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest'
            style={{ color: 'var(--muted-foreground)' }}
          >
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
                    className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150'
                    style={{
                      backgroundColor: active
                        ? 'color-mix(in srgb, var(--primary) 12%, transparent)'
                        : 'transparent',
                      color: active
                        ? 'var(--primary)'
                        : 'var(--muted-foreground)',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'var(--muted)';
                        e.currentTarget.style.color = 'var(--foreground)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--muted-foreground)';
                      }
                    }}
                  >
                    <Icon className='h-4 w-4 shrink-0' />
                    <span className='flex-1'>{item.label}</span>
                    {active && (
                      <ChevronRight className='h-3.5 w-3.5 shrink-0 opacity-50' />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className='shrink-0 border-t p-4'
          style={{ borderColor: 'var(--border)' }}
        >
          {user && (
            <div className='mb-3 flex items-center gap-3'>
              <div
                className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white'
                style={{ backgroundColor: meta.avatarBg }}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name ?? user.email}
                    className='h-9 w-9 rounded-full object-cover'
                  />
                ) : (
                  initials
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <p
                  className='truncate text-sm font-semibold'
                  style={{ color: 'var(--foreground)' }}
                >
                  {user.name ?? 'User'}
                </p>
                <p
                  className='truncate text-xs'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {user.email}
                </p>
              </div>
            </div>
          )}
          {user && (
            <span
              className='mb-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold'
              style={{ backgroundColor: meta.badgeBg, color: meta.badgeColor }}
            >
              {meta.label}
            </span>
          )}
          <form action={logoutAction}>
            <button
              type='submit'
              className='cursor-pointer flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150'
              style={{ color: 'var(--muted-foreground)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)';
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--muted-foreground)';
              }}
            >
              <LogOut className='h-4 w-4 shrink-0' />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <div className='flex min-w-0 flex-1 flex-col lg:ml-64'>
        <div
          className='flex h-14 shrink-0 items-center justify-between border-b px-4 lg:hidden'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className='cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg transition-colors'
            style={{ color: 'var(--foreground)' }}
            aria-label='Open navigation'
          >
            <Menu className='h-5 w-5' />
          </button>
          <span
            className='inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold'
            style={{ backgroundColor: meta.badgeBg, color: meta.badgeColor }}
          >
            {meta.label} Dashboard
          </span>
          {mounted && (
            <button
              onClick={toggleTheme}
              className='cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg transition-colors'
              style={{ color: 'var(--foreground)' }}
              aria-label='Toggle theme'
            >
              {theme === 'dark' ? (
                <Sun className='h-4 w-4' />
              ) : (
                <Moon className='h-4 w-4' />
              )}
            </button>
          )}
        </div>
        <main className='flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8'>
          {children}
        </main>
      </div>
    </div>
  );
}
