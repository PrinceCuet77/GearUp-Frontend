'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  Store,
  User as UserIcon,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { logoutAction } from '@/app/(auth)/_actions/logoutActions';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { UserAvatar } from './UserAvatar';
import { useClickOutside } from '@/lib/hooks';
import { cn } from '@/lib/cn';
import type { UserRole } from '@/lib/types';

const ROLE_TONE: Record<UserRole, BadgeTone> = {
  ADMIN: 'primary',
  PROVIDER: 'secondary',
  CUSTOMER: 'accent',
};

const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  PROVIDER: 'Provider',
  CUSTOMER: 'Customer',
};

interface MenuEntry {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

/**
 * Account menu in the dashboard topbar: identity, the account pages, and sign
 * out. Dismisses on outside click or Escape, and closes itself on navigation.
 */
export function ProfileMenu({ basePath }: { basePath: string }) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const containerRef = useClickOutside<HTMLDivElement>(open, () =>
    setOpen(false),
  );

  if (!user) return null;

  const role = user.role;
  const entries: MenuEntry[] = [
    {
      href: basePath,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview and activity',
    },
    {
      href: `${basePath}/profile`,
      label: 'My Profile',
      icon: UserIcon,
      description: 'Name, photo and account details',
    },
    {
      href: `${basePath}/settings`,
      label: 'Settings',
      icon: Settings,
      description: 'Password and security',
    },
    {
      href: '/gears',
      label: 'Browse Marketplace',
      icon: Store,
      description: 'Back to public gear listings',
    },
  ];

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logoutAction();
      clearUser();
      toast.success('You have been signed out.');
      setOpen(false);
      router.push('/');
    } catch {
      toast.error('Could not sign you out. Please try again.');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className='relative' ref={containerRef}>
      <button
        type='button'
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup='menu'
        aria-label='Open account menu'
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-control border border-border px-2 py-1.5 transition-colors hover:bg-muted',
          open && 'bg-muted',
        )}
      >
        <UserAvatar
          name={user.name}
          email={user.email}
          src={user.avatarUrl}
          size={28}
          shape='control'
        />
        <span className='hidden max-w-32 truncate text-sm font-semibold text-foreground sm:block'>
          {user.name ?? user.email.split('@')[0]}
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden='true'
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role='menu'
            aria-label='Account'
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className='surface-card absolute top-full right-0 z-50 mt-2 w-72 overflow-hidden shadow-lg'
          >
            <div className='flex items-center gap-3 border-b border-border p-4'>
              <UserAvatar
                name={user.name}
                email={user.email}
                src={user.avatarUrl}
                size={40}
                shape='control'
              />
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-bold text-foreground'>
                  {user.name ?? 'User'}
                </p>
                <p className='truncate text-xs text-muted-foreground'>
                  {user.email}
                </p>
              </div>
            </div>

            <div className='border-b border-border px-4 py-2.5'>
              <Badge tone={ROLE_TONE[role] ?? 'neutral'} size='sm'>
                {ROLE_LABEL[role] ?? role}
              </Badge>
            </div>

            <ul className='py-1.5'>
              {entries.map((entry) => (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    role='menuitem'
                    onClick={() => setOpen(false)}
                    className='flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-muted'
                  >
                    <entry.icon
                      className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground'
                      aria-hidden='true'
                    />
                    <span className='min-w-0'>
                      <span className='block text-sm font-semibold text-foreground'>
                        {entry.label}
                      </span>
                      <span className='block truncate text-xs text-muted-foreground'>
                        {entry.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className='border-t border-border p-1.5'>
              <button
                type='button'
                role='menuitem'
                onClick={handleSignOut}
                disabled={signingOut}
                className='flex w-full cursor-pointer items-center gap-3 rounded-control px-2.5 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger-soft disabled:opacity-60'
              >
                <LogOut className='h-4 w-4 shrink-0' aria-hidden='true' />
                {signingOut ? 'Signing out…' : 'Sign Out'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
