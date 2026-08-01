'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import {
  Dumbbell,
  Sun,
  Moon,
  Menu,
  X,
  ShoppingCart,
  LogIn,
  UserPlus,
  ChevronDown,
  LogOut,
  User,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuthStore } from '@/store/useAuthStore';

import {
  PUBLIC_LINKS,
  ROLE_LINKS,
  ROLE_COLORS,
  type AvailableRole,
} from '@/lib/constants';
import { logoutAction } from '@/app/(auth)/_actions/logoutActions';
import { toast } from 'sonner';

function getInitials(name?: string | null, email?: string) {
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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userProfile = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toggleCart, itemCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handle = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [userMenuOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const roleLinks =
    userProfile?.role && userProfile.role in ROLE_LINKS
      ? ROLE_LINKS[userProfile.role as AvailableRole]
      : [];
  const roleColors =
    userProfile?.role && userProfile.role in ROLE_COLORS
      ? ROLE_COLORS[userProfile.role as AvailableRole]
      : null;

  const handleLogout = async () => {
    await logoutAction();
    clearUser();
    toast.success('Logged out successfully');
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push('/');
  };

  return (
    <header
      className='sticky top-0 z-40 w-full border-b backdrop-blur-md'
      style={{
        backgroundColor: 'var(--nav-bg)',
        borderColor: 'var(--nav-border)',
      }}
    >
      <nav className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between gap-4'>
          {/* Logo */}
          <Link
            href='/'
            className='flex shrink-0 items-center gap-2.5 font-bold text-xl tracking-tight'
          >
            <span
              className='flex h-9 w-9 items-center justify-center rounded-xl'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Dumbbell className='h-5 w-5 text-white' />
            </span>
            <span style={{ color: 'var(--foreground)' }}>
              Gear<span style={{ color: 'var(--primary)' }}>Up</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className='hidden md:flex items-center gap-0.5 flex-1'>
            {PUBLIC_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='px-3 py-2 rounded-lg text-sm font-medium transition-colors'
                style={{
                  color: isActive(link.href)
                    ? 'var(--primary)'
                    : 'var(--muted-foreground)',
                  backgroundColor: isActive(link.href)
                    ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) {
                    (
                      e.currentTarget as HTMLAnchorElement
                    ).style.backgroundColor = 'var(--muted)';
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      'var(--foreground)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    (
                      e.currentTarget as HTMLAnchorElement
                    ).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      'var(--muted-foreground)';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='px-3 py-2 rounded-lg text-sm font-medium transition-colors'
                style={{
                  color: isActive(link.href)
                    ? 'var(--primary)'
                    : 'var(--muted-foreground)',
                  backgroundColor: isActive(link.href)
                    ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                    : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className='hidden md:flex items-center gap-2'>
            {/* Theme */}
            <button
              onClick={toggleTheme}
              aria-label='Toggle theme'
              className='cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg transition-colors'
              style={{ color: 'var(--muted-foreground)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'var(--muted)';
                (e.currentTarget as HTMLButtonElement).style.color =
                  'var(--foreground)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'transparent';
                (e.currentTarget as HTMLButtonElement).style.color =
                  'var(--muted-foreground)';
              }}
            >
              {!mounted ? (
                <div className='h-4 w-4' />
              ) : theme === 'dark' ? (
                <Sun className='h-4 w-4' />
              ) : (
                <Moon className='h-4 w-4' />
              )}
            </button>

            {/* Cart */}
            {userProfile && (
              <button
                onClick={toggleCart}
                aria-label='Open cart'
                className='cursor-pointer relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors'
                style={{ color: 'var(--muted-foreground)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'var(--muted)';
                  (e.currentTarget as HTMLButtonElement).style.color =
                    'var(--foreground)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color =
                    'var(--muted-foreground)';
                }}
              >
                <ShoppingCart className='h-4 w-4' />
                {itemCount > 0 && (
                  <span
                    className='absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-bold text-white'
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            )}

            {/* Auth / User menu */}
            {userProfile ? (
              <div className='relative' ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className='cursor-pointer flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors'
                  style={{
                    backgroundColor: userMenuOpen
                      ? 'var(--muted)'
                      : 'transparent',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                  }}
                >
                  {userProfile?.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.name ?? undefined}
                      className='h-7 w-7 rounded-lg object-cover'
                    />
                  ) : (
                    <span
                      className='flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white'
                      style={{
                        backgroundColor: roleColors?.color ?? 'var(--primary)',
                      }}
                    >
                      {getInitials(userProfile?.name, userProfile?.email)}
                    </span>
                  )}
                  <span className='hidden lg:block max-w-25 truncate'>
                    {userProfile?.name ?? userProfile?.email.split('@')[0]}
                  </span>
                  <ChevronDown
                    className='h-3.5 w-3.5'
                    style={{
                      transform: userMenuOpen ? 'rotate(180deg)' : 'none',
                      color: 'var(--muted-foreground)',
                      transition: 'transform 0.15s',
                    }}
                  />
                </button>

                {userMenuOpen && (
                  <div
                    className='absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border shadow-2xl z-50'
                    style={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    {/* User info */}
                    <div
                      className='border-b px-4 py-3'
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className='flex items-center gap-3'>
                        {userProfile?.avatarUrl ? (
                          <img
                            src={userProfile.avatarUrl}
                            alt={userProfile.name ?? undefined}
                            className='h-10 w-10 rounded-xl object-cover'
                          />
                        ) : (
                          <span
                            className='flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white'
                            style={{
                              backgroundColor:
                                roleColors?.color ?? 'var(--primary)',
                            }}
                          >
                            {getInitials(userProfile?.name, userProfile?.email)}
                          </span>
                        )}
                        <div className='min-w-0'>
                          <p
                            className='truncate text-sm font-semibold'
                            style={{ color: 'var(--foreground)' }}
                          >
                            {userProfile?.name ?? 'User'}
                          </p>
                          <p
                            className='truncate text-xs'
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            {userProfile?.email}
                          </p>
                        </div>
                      </div>
                      {roleColors && (
                        <span
                          className='mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold'
                          style={{
                            backgroundColor: roleColors.bg,
                            color: roleColors.color,
                          }}
                        >
                          {userProfile?.role ?? userProfile?.role}
                        </span>
                      )}
                    </div>

                    {/* Quick links */}
                    <div className='py-1'>
                      <Link
                        href='/me'
                        onClick={() => setUserMenuOpen(false)}
                        className='flex items-center gap-3 px-4 py-2.5 text-sm transition-colors'
                        style={{ color: 'var(--foreground)' }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLAnchorElement
                          ).style.backgroundColor = 'var(--muted)';
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLAnchorElement
                          ).style.backgroundColor = 'transparent';
                        }}
                      >
                        <User
                          className='h-4 w-4'
                          style={{ color: 'var(--muted-foreground)' }}
                        />
                        My Profile
                      </Link>
                      {roleLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setUserMenuOpen(false)}
                            className='flex items-center gap-3 px-4 py-2.5 text-sm transition-colors'
                            style={{ color: 'var(--foreground)' }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLAnchorElement
                              ).style.backgroundColor = 'var(--muted)';
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLAnchorElement
                              ).style.backgroundColor = 'transparent';
                            }}
                          >
                            <Icon
                              className='h-4 w-4'
                              style={{ color: 'var(--muted-foreground)' }}
                            />
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Logout */}
                    <div
                      className='border-t py-1'
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <button
                        onClick={handleLogout}
                        className='flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer'
                        style={{ color: '#ef4444' }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = 'rgba(239,68,68,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = 'transparent';
                        }}
                      >
                        <LogOut className='h-4 w-4' />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : pathname === '/login' ? (
              <Link
                href='/register'
                className='flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors'
                style={{ backgroundColor: 'var(--primary)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    'var(--primary-hover)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    'var(--primary)';
                }}
              >
                <UserPlus className='h-4 w-4' />
                Register
              </Link>
            ) : (
              <Link
                href='/login'
                className='flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors'
                style={{
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    'var(--muted)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    'transparent';
                }}
              >
                <LogIn className='h-4 w-4' />
                Login
              </Link>
            )}
          </div>

          {/* Mobile right */}
          <div className='flex md:hidden items-center gap-1'>
            <button
              onClick={toggleCart}
              aria-label='Open cart'
              className='cursor-pointer relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors'
              style={{ color: 'var(--muted-foreground)' }}
            >
              <ShoppingCart className='h-4 w-4' />
              {itemCount > 0 && (
                <span
                  className='absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-bold text-white'
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleTheme}
              aria-label='Toggle theme'
              className='cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg transition-colors'
              style={{ color: 'var(--muted-foreground)' }}
            >
              {!mounted ? (
                <div className='h-4 w-4' />
              ) : theme === 'dark' ? (
                <Sun className='h-4 w-4' />
              ) : (
                <Moon className='h-4 w-4' />
              )}
            </button>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label='Toggle menu'
              className='cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg transition-colors'
              style={{ color: 'var(--foreground)' }}
            >
              {mobileOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className='md:hidden border-t pb-4'
            style={{ borderColor: 'var(--border)' }}
          >
            {/* User strip */}
            {userProfile && (
              <div
                className='mt-3 mb-2 flex items-center gap-3 rounded-xl px-4 py-3'
                style={{ backgroundColor: 'var(--muted)' }}
              >
                {userProfile?.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name ?? undefined}
                    className='h-10 w-10 shrink-0 rounded-xl object-cover'
                  />
                ) : (
                  <span
                    className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white'
                    style={{
                      backgroundColor: roleColors?.color ?? 'var(--primary)',
                    }}
                  >
                    {getInitials(userProfile.name, userProfile.email)}
                  </span>
                )}
                <div className='min-w-0 flex-1'>
                  <p
                    className='truncate text-sm font-semibold'
                    style={{ color: 'var(--foreground)' }}
                  >
                    {userProfile.name ?? 'User'}
                  </p>
                  <p
                    className='truncate text-xs'
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {userProfile.email}
                  </p>
                </div>
                {roleColors && (
                  <span
                    className='shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold'
                    style={{
                      backgroundColor: roleColors.bg,
                      color: roleColors.color,
                    }}
                  >
                    {userProfile.role}
                  </span>
                )}
              </div>
            )}

            <div className='flex flex-col gap-0.5 pt-1'>
              {[
                ...PUBLIC_LINKS,
                ...(userProfile
                  ? [{ href: '/me', label: 'My Profile' }, ...roleLinks]
                  : []),
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className='rounded-lg px-4 py-2.5 text-sm font-medium transition-colors'
                  style={{
                    color: isActive(link.href)
                      ? 'var(--primary)'
                      : 'var(--foreground)',
                    backgroundColor: isActive(link.href)
                      ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                      : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Logout / login */}
            <div
              className='mt-2 border-t pt-2'
              style={{ borderColor: 'var(--border)' }}
            >
              {userProfile ? (
                <button
                  onClick={handleLogout}
                  className='cursor-pointer flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium'
                  style={{ color: '#ef4444' }}
                >
                  <LogOut className='h-4 w-4' />
                  Log Out
                </button>
              ) : pathname === '/login' ? (
                <Link
                  href='/register'
                  onClick={() => setMobileOpen(false)}
                  className='flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-white mx-4'
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <UserPlus className='h-4 w-4' />
                  Register
                </Link>
              ) : (
                <Link
                  href='/login'
                  onClick={() => setMobileOpen(false)}
                  className='flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium mx-4'
                  style={{
                    color: 'var(--foreground)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <LogIn className='h-4 w-4' />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
