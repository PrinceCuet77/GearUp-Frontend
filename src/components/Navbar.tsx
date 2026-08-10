'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronDown,
  LayoutDashboard,
  Lock,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Mountain,
  ShoppingCart,
  Sun,
  User as UserIcon,
  UserPlus,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { useTheme } from '@/components/ThemeProvider';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ROLE_LINKS, ROLE_COLORS, type AvailableRole } from '@/lib/constants';
import { PUBLIC_LINKS } from '@/lib/site';
import { logoutAction } from '@/app/(auth)/_actions/logoutActions';
import { cn } from '@/lib/cn';
import { useIsClient, useScrolledPast } from '@/lib/hooks';
import { Button, ButtonLink } from '@/components/ui/Button';

function getInitials(name?: string | null, email?: string) {
  if (name) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }
  return (email?.[0] ?? 'U').toUpperCase();
}

/** Dashboard root for a role — also the prefix for profile/password routes. */
function dashboardRoot(role?: AvailableRole | null) {
  if (role === 'ADMIN') return '/admin';
  if (role === 'PROVIDER') return '/provider';
  return '/customer';
}

function Avatar({
  src,
  name,
  email,
  color,
  className,
}: {
  src?: string | null;
  name?: string | null;
  email?: string;
  color?: string;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? 'Profile photo'}
        width={40}
        height={40}
        className={cn('object-cover', className)}
        unoptimized
      />
    );
  }
  return (
    <span
      className={cn(
        'flex items-center justify-center font-bold text-white',
        className,
      )}
      style={{ backgroundColor: color ?? 'var(--primary)' }}
      aria-hidden='true'
    >
      {getInitials(name, email)}
    </span>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const mounted = useIsClient();
  const scrolled = useScrolledPast(8);

  const userProfile = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const { theme, toggleTheme } = useTheme();
  const toggleCart = useCartStore((s) => s.toggleCart);
  const cartHydrated = useCartStore((s) => s._hasHydrated);
  const itemCount = useCartStore((s) => s.itemCount());

  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handle = (e: MouseEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [userMenuOpen]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  };

  const role = userProfile?.role as AvailableRole | undefined;
  const roleLinks = role && role in ROLE_LINKS ? ROLE_LINKS[role] : [];
  const roleColors = role && role in ROLE_COLORS ? ROLE_COLORS[role] : null;
  const rolePath = dashboardRoot(role);

  const closeUserMenu = useCallback(() => setUserMenuOpen(false), []);
  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);

  // On /login, offer a way to Register; everywhere else (including /register), offer Sign In.
  const showRegisterCta = pathname === '/login';

  const handleLogout = async () => {
    await logoutAction();
    clearUser();
    toast.success('Logged out successfully');
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push('/');
  };

  const iconButton =
    'flex h-10 w-10 cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-shadow duration-300',
        scrolled ? 'shadow-sm' : 'shadow-none',
      )}
      style={{
        backgroundColor: scrolled ? 'var(--nav-bg)' : 'var(--card)',
        borderColor: 'var(--nav-border)',
        backdropFilter: scrolled ? 'blur(12px)' : undefined,
      }}
    >
      <nav
        className='container-page'
        aria-label='Primary'
      >
        <div className='flex h-16 items-center justify-between gap-4 lg:h-18'>
          {/* Logo */}
          <Link
            href='/'
            className='flex shrink-0 items-center gap-2.5 text-xl font-extrabold tracking-tight'
          >
            <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm'>
              <Mountain
                className='h-5 w-5 text-primary-foreground'
                aria-hidden='true'
              />
            </span>
            <span className='text-foreground'>
              Gear<span className='text-primary'>Up</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className='hidden flex-1 items-center gap-1 md:flex'>
            {[...PUBLIC_LINKS, ...roleLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'rounded-control px-3 py-2 text-sm font-semibold transition-colors',
                  isActive(link.href)
                    ? 'bg-primary-soft text-primary-soft-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className='flex items-center gap-1.5'>
            {userProfile && (
              <button
                onClick={toggleCart}
                aria-label={`Open cart${cartHydrated && itemCount > 0 ? `, ${itemCount} item${itemCount === 1 ? '' : 's'}` : ''}`}
                className={cn(iconButton, 'relative')}
              >
                <ShoppingCart className='h-[18px] w-[18px]' />
                {cartHydrated && itemCount > 0 && (
                  <span className='absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground'>
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className={iconButton}
            >
              {!mounted ? (
                <span className='h-[18px] w-[18px]' />
              ) : theme === 'dark' ? (
                <Sun className='h-[18px] w-[18px]' />
              ) : (
                <Moon className='h-[18px] w-[18px]' />
              )}
            </button>

            {/* Desktop auth */}
            <div className='hidden items-center gap-2 md:flex'>
              {userProfile ? (
                <div className='relative' ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((open) => !open)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup='menu'
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-control border border-border px-2.5 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted',
                      userMenuOpen && 'bg-muted',
                    )}
                  >
                    <Avatar
                      src={userProfile.avatarUrl}
                      name={userProfile.name}
                      email={userProfile.email}
                      color={roleColors?.color}
                      className='h-7 w-7 rounded-lg text-xs'
                    />
                    <span className='hidden max-w-28 truncate lg:block'>
                      {userProfile.name ?? userProfile.email.split('@')[0]}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
                        userMenuOpen && 'rotate-180',
                      )}
                      aria-hidden='true'
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        role='menu'
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: 'easeOut' }}
                        className='surface-card absolute right-0 top-full z-50 mt-2 w-68 overflow-hidden shadow-lg'
                      >
                        <div className='border-b border-border p-4'>
                          <div className='flex items-center gap-3'>
                            <Avatar
                              src={userProfile.avatarUrl}
                              name={userProfile.name}
                              email={userProfile.email}
                              color={roleColors?.color}
                              className='h-10 w-10 rounded-xl text-sm'
                            />
                            <div className='min-w-0'>
                              <p className='truncate text-sm font-bold text-foreground'>
                                {userProfile.name ?? 'User'}
                              </p>
                              <p className='truncate text-xs text-muted-foreground'>
                                {userProfile.email}
                              </p>
                            </div>
                          </div>
                          {roleColors && (
                            <span
                              className='mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold'
                              style={{
                                backgroundColor: roleColors.bg,
                                color: roleColors.color,
                              }}
                            >
                              {userProfile.role}
                            </span>
                          )}
                        </div>

                        <div className='py-1.5'>
                          <MenuLink
                            href={rolePath}
                            icon={LayoutDashboard}
                            label='Dashboard'
                            onNavigate={closeUserMenu}
                          />
                          {roleLinks.map((link) => (
                            <MenuLink
                              key={link.href}
                              href={link.href}
                              icon={link.icon}
                              label={link.label}
                              onNavigate={closeUserMenu}
                            />
                          ))}
                          <MenuLink
                            href={`${rolePath}/profile`}
                            icon={UserIcon}
                            label='My Profile'
                            onNavigate={closeUserMenu}
                          />
                          <MenuLink
                            href={`${rolePath}/change-password`}
                            icon={Lock}
                            label='Change Password'
                            onNavigate={closeUserMenu}
                          />
                        </div>

                        <div className='border-t border-border py-1.5'>
                          <button
                            onClick={handleLogout}
                            role='menuitem'
                            className='flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger-soft'
                          >
                            <LogOut className='h-4 w-4' aria-hidden='true' />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : showRegisterCta ? (
                <ButtonLink
                  href='/register'
                  variant='primary'
                  size='sm'
                  leadingIcon={<UserPlus className='h-4 w-4' />}
                >
                  Get Started
                </ButtonLink>
              ) : (
                <ButtonLink
                  href='/login'
                  variant='ghost'
                  size='sm'
                  leadingIcon={<LogIn className='h-4 w-4' />}
                >
                  Sign In
                </ButtonLink>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className={cn(iconButton, 'text-foreground md:hidden')}
            >
              {mobileOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className='overflow-hidden border-t border-border bg-card md:hidden'
          >
            <div className='container-page max-h-[calc(100dvh-4rem)] overflow-y-auto py-4'>
              {userProfile && (
                <div className='mb-4 flex items-center gap-3 rounded-card bg-muted p-3'>
                  <Avatar
                    src={userProfile.avatarUrl}
                    name={userProfile.name}
                    email={userProfile.email}
                    color={roleColors?.color}
                    className='h-10 w-10 shrink-0 rounded-xl text-sm'
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-bold text-foreground'>
                      {userProfile.name ?? 'User'}
                    </p>
                    <p className='truncate text-xs text-muted-foreground'>
                      {userProfile.email}
                    </p>
                  </div>
                  {roleColors && (
                    <span
                      className='shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold'
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

              <div className='flex flex-col gap-1'>
                {PUBLIC_LINKS.map((link) => (
                  <MobileLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={isActive(link.href)}
                      onNavigate={closeMobileMenu}
                  />
                ))}

                {userProfile && (
                  <>
                    <p className='mt-4 mb-1 px-3 text-[11px] font-bold tracking-wider text-muted-foreground uppercase'>
                      My Account
                    </p>
                    <MobileLink
                      href={rolePath}
                      label='Dashboard'
                      active={pathname === rolePath}
                      onNavigate={closeMobileMenu}
                    />
                    {roleLinks.map((link) => (
                      <MobileLink
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        active={isActive(link.href)}
                      onNavigate={closeMobileMenu}
                      />
                    ))}
                    <MobileLink
                      href={`${rolePath}/profile`}
                      label='My Profile'
                      active={isActive(`${rolePath}/profile`)}
                      onNavigate={closeMobileMenu}
                    />
                    <MobileLink
                      href={`${rolePath}/change-password`}
                      label='Change Password'
                      active={isActive(`${rolePath}/change-password`)}
                      onNavigate={closeMobileMenu}
                    />
                  </>
                )}
              </div>

              <div className='mt-4 border-t border-border pt-4'>
                {userProfile ? (
                  <Button
                    onClick={handleLogout}
                    variant='outline'
                    fullWidth
                    leadingIcon={<LogOut className='h-4 w-4' />}
                    className='!border-danger/40 !text-danger hover:!bg-danger-soft'
                  >
                    Log Out
                  </Button>
                ) : showRegisterCta ? (
                  <ButtonLink
                    href='/register'
                    fullWidth
                    leadingIcon={<UserPlus className='h-4 w-4' />}
                  >
                    Create Free Account
                  </ButtonLink>
                ) : (
                  <ButtonLink
                    href='/login'
                    variant='outline'
                    fullWidth
                    leadingIcon={<LogIn className='h-4 w-4' />}
                  >
                    Sign In
                  </ButtonLink>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  onNavigate,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      role='menuitem'
      onClick={onNavigate}
      className='flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted'
    >
      <Icon className='h-4 w-4 text-muted-foreground' aria-hidden='true' />
      {label}
    </Link>
  );
}

function MobileLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      onClick={onNavigate}
      className={cn(
        'rounded-control px-3 py-2.5 text-sm font-semibold transition-colors',
        active
          ? 'bg-primary-soft text-primary-soft-foreground'
          : 'text-foreground hover:bg-muted',
      )}
    >
      {label}
    </Link>
  );
}
