'use client';

import { buttonClasses } from '@/components/ui/Button';
import { GoogleIcon } from '@/components/ui/BrandIcons';
import { buildGoogleAuthUrl, type GoogleSignupRole } from '@/lib/oauth';

/**
 * Starts the Google OAuth flow. Renders as a plain `<a>` so the browser
 * performs a full navigation - required for the redirect to Google's consent
 * screen, which an XHR could not follow.
 *
 * `role` decides what a *brand-new* Google account is created as; signing in
 * with an existing account keeps whatever role it already has.
 */
export function GoogleButton({
  label = 'Continue with Google',
  role = 'CUSTOMER',
}: {
  label?: string;
  role?: GoogleSignupRole;
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
