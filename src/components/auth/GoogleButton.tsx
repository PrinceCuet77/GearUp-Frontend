'use client';

import { buttonClasses } from '@/components/ui/Button';
import { GoogleIcon } from '@/components/ui/BrandIcons';
import { buildGoogleAuthUrl, type GoogleAuthRole } from '@/lib/oauth';

/**
 * Starts the Google OAuth flow. Renders as a plain `<a>` so the browser
 * performs a full navigation — required for the backend's CSRF-state
 * cookie and the redirect to Google's consent screen to work.
 */
export function GoogleButton({
  role,
  label = 'Continue with Google',
}: {
  /** Only applied when Google creates a *new* user. Omit on the login page. */
  role?: GoogleAuthRole;
  label?: string;
}) {
  return (
    <a
      href={buildGoogleAuthUrl(role)}
      className={buttonClasses({ variant: 'outline', fullWidth: true })}
    >
      <GoogleIcon className='h-4 w-4' />
      {label}
    </a>
  );
}
