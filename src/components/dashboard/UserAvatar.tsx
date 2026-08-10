'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';

/** Up to two initials from a name, falling back to the email's first letter. */
export function getInitials(name?: string | null, email?: string): string {
  if (name?.trim()) {
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

export interface UserAvatarProps {
  name?: string | null;
  email?: string;
  src?: string | null;
  /** Rendered pixel size; the box is always square. */
  size?: number;
  /** `full` for the round chrome avatars, `control` for card-style tiles. */
  shape?: 'full' | 'control';
  className?: string;
}

/**
 * Profile image with an initials fallback, shared by the sidebar, the topbar
 * menu and the profile page so one broken URL behaves the same everywhere.
 */
export function UserAvatar({
  name,
  email,
  src,
  size = 36,
  shape = 'full',
  className,
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  const radius = shape === 'full' ? 'rounded-full' : 'rounded-control';

  if (src && !failed) {
    return (
      <Image
        src={src}
        alt={name ?? email ?? 'Profile photo'}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        unoptimized
        className={cn('shrink-0 object-cover', radius, className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden='true'
      className={cn(
        'flex shrink-0 items-center justify-center bg-primary font-bold text-primary-foreground',
        radius,
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {getInitials(name, email)}
    </span>
  );
}
