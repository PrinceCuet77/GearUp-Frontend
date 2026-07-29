'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Dumbbell, Sun, Moon, LogIn } from 'lucide-react';

const PUBLIC_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/gears', label: 'Browse Gear' },
];

export default function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

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

          {/* Nav links */}
          <div className='flex items-center justify-center gap-1 flex-1'>
            {PUBLIC_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='px-4 py-2 rounded-lg text-sm font-medium transition-colors'
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
          </div>

          {/* Desktop right actions */}
          <div className='hidden md:flex items-center gap-2'>
            {/* Theme */}
            <button
              onClick={toggleTheme}
              aria-label='Toggle theme'
              className='flex h-9 w-9 items-center justify-center rounded-lg transition-colors'
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
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className='h-4 w-4' />
                ) : (
                  <Moon className='h-4 w-4' />
                )
              ) : (
                <div className='h-4 w-4' />
              )}
            </button>

            {/* Login */}
            <Link
              href='/login'
              className='flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors'
              style={{
                color: 'var(--foreground)',
                borderColor: 'var(--border)',
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
          </div>

          {/* Mobile right */}
          <div className='flex md:hidden items-center gap-1.5'>
            <button
              onClick={toggleTheme}
              aria-label='Toggle theme'
              className='flex h-9 w-9 items-center justify-center rounded-lg transition-colors'
              style={{ color: 'var(--muted-foreground)' }}
            >
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className='h-4 w-4' />
                ) : (
                  <Moon className='h-4 w-4' />
                )
              ) : (
                <div className='h-4 w-4' />
              )}
            </button>
            <Link
              href='/login'
              className='flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors'
              style={{
                color: 'var(--foreground)',
                borderColor: 'var(--border)',
              }}
            >
              <LogIn className='h-4 w-4' />
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
