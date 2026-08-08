import Link from 'next/link';
import { Clock, Mail, MapPin, Mountain, Phone } from 'lucide-react';
import { FOOTER_COLUMNS, SITE, SOCIAL_LINKS } from '@/lib/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t border-border bg-card'>
      <div className='container-page py-14 lg:py-16'>
        <div className='grid gap-10 lg:grid-cols-12 lg:gap-8'>
          {/* Brand + contact */}
          <div className='lg:col-span-4'>
            <Link
              href='/'
              className='inline-flex items-center gap-2.5 text-xl font-extrabold tracking-tight'
            >
              <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary'>
                <Mountain
                  className='h-5 w-5 text-primary-foreground'
                  aria-hidden='true'
                />
              </span>
              <span className='text-foreground'>
                Gear<span className='text-primary'>Up</span>
              </span>
            </Link>

            <p className='mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground'>
              {SITE.description}
            </p>

            <ul className='mt-6 space-y-3 text-sm'>
              <li>
                <a
                  href={`mailto:${SITE.contact.email}`}
                  className='group flex items-start gap-3 text-muted-foreground transition-colors hover:text-primary'
                >
                  <Mail
                    className='mt-0.5 h-4 w-4 shrink-0 text-primary'
                    aria-hidden='true'
                  />
                  <span className='group-hover:underline'>
                    {SITE.contact.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={SITE.contact.phoneHref}
                  className='group flex items-start gap-3 text-muted-foreground transition-colors hover:text-primary'
                >
                  <Phone
                    className='mt-0.5 h-4 w-4 shrink-0 text-primary'
                    aria-hidden='true'
                  />
                  <span className='group-hover:underline'>
                    {SITE.contact.phone}
                  </span>
                </a>
              </li>
              <li className='flex items-start gap-3 text-muted-foreground'>
                <MapPin
                  className='mt-0.5 h-4 w-4 shrink-0 text-primary'
                  aria-hidden='true'
                />
                <span>{SITE.contact.address}</span>
              </li>
              <li className='flex items-start gap-3 text-muted-foreground'>
                <Clock
                  className='mt-0.5 h-4 w-4 shrink-0 text-primary'
                  aria-hidden='true'
                />
                <span>{SITE.contact.hours}</span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          <div className='grid gap-8 sm:grid-cols-3 lg:col-span-7 lg:col-start-6'>
            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className='text-xs font-bold tracking-wider text-foreground uppercase'>
                  {column.title}
                </h2>
                <ul className='mt-4 space-y-2.5'>
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}`}>
                      <Link
                        href={link.href}
                        className='text-sm text-muted-foreground transition-colors hover:text-primary'
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className='border-t border-border'>
        <div className='container-page flex flex-col items-center justify-between gap-5 py-6 sm:flex-row'>
          <p className='order-2 text-xs text-muted-foreground sm:order-1'>
            &copy; {currentYear} {SITE.name}. All rights reserved.
          </p>

          <ul className='order-1 flex items-center gap-1.5 sm:order-2'>
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`${SITE.name} on ${social.label}`}
                    className='flex h-9 w-9 items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary'
                  >
                    <Icon className='h-4 w-4' aria-hidden='true' />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
}
