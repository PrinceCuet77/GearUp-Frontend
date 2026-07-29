import Link from 'next/link';
import { Dumbbell, Mail, Phone, MapPin } from 'lucide-react';

const quickLinks = [
  { label: 'Browse Gear', href: '/gear' },
  { label: 'How It Works', href: '/#how-it-works' },
];

const supportLinks = [
  { label: 'Help Center', href: '/help' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Return Policy', href: '/returns' },
  { label: 'Terms of Service', href: '/terms' },
];

const categoryLinks = [
  { label: 'Bikes & Cycling', href: '/gear?category=Bikes' },
  { label: 'Camping & Outdoors', href: '/gear?category=Camping' },
  { label: 'Water Sports', href: '/gear?category=Water+Sports' },
  { label: 'Fitness Equipment', href: '/gear?category=Fitness' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--card)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* Main Footer */}
      <div className='mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8'>
        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Brand Column */}
          <div className='sm:col-span-2 lg:col-span-1'>
            <Link href='/' className='mb-5 flex items-center gap-2'>
              <div
                className='flex h-9 w-9 items-center justify-center rounded-xl'
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Dumbbell className='h-5 w-5 text-white' />
              </div>
              <span
                className='text-xl font-extrabold tracking-tight'
                style={{ color: 'var(--foreground)' }}
              >
                Gear<span style={{ color: 'var(--primary)' }}>Up</span>
              </span>
            </Link>
            <p
              className='mb-5 max-w-xs text-sm leading-relaxed'
              style={{ color: 'var(--muted-foreground)' }}
            >
              Your one-stop marketplace for renting premium sports and outdoor
              gear. Adventure made accessible.
            </p>

            {/* Contact Info */}
            <ul className='space-y-2.5'>
              <li className='flex items-center gap-2.5'>
                <Mail
                  className='h-4 w-4 shrink-0'
                  style={{ color: 'var(--primary)' }}
                />
                <span
                  className='text-sm'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  support@gearup.com
                </span>
              </li>
              <li className='flex items-center gap-2.5'>
                <Phone
                  className='h-4 w-4 shrink-0'
                  style={{ color: 'var(--primary)' }}
                />
                <span
                  className='text-sm'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  +880 1700-000000
                </span>
              </li>
              <li className='flex items-start gap-2.5'>
                <MapPin
                  className='mt-0.5 h-4 w-4 shrink-0'
                  style={{ color: 'var(--primary)' }}
                />
                <span
                  className='text-sm'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Dhaka, Bangladesh
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className='mb-4 text-sm font-bold uppercase tracking-wider'
              style={{ color: 'var(--foreground)' }}
            >
              Quick Links
            </h4>
            <ul className='space-y-2.5'>
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm transition-colors hover:underline'
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4
              className='mb-4 text-sm font-bold uppercase tracking-wider'
              style={{ color: 'var(--foreground)' }}
            >
              Categories
            </h4>
            <ul className='space-y-2.5'>
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm transition-colors hover:underline'
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className='mb-4 text-sm font-bold uppercase tracking-wider'
              style={{ color: 'var(--foreground)' }}
            >
              Support
            </h4>
            <ul className='space-y-2.5'>
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm transition-colors hover:underline'
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{ borderTop: '1px solid var(--border)' }}
        className='mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8'
      >
        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <p className='text-xs' style={{ color: 'var(--muted-foreground)' }}>
            &copy; {currentYear} GearUp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
