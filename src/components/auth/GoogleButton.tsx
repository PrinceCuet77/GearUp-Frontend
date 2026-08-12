'use client';

import { buttonClasses } from '@/components/ui/Button';
import { GoogleIcon } from '@/components/ui/BrandIcons';
import { buildGoogleAuthUrl } from '@/lib/oauth';

/**
 * Starts the Google OAuth flow. Renders as a plain `<a>` so the browser
 * performs a full navigation — required for the redirect to Google's consent
 * screen and for the session cookies to come back to us.
 *
 * Google sign-in always yields a customer account; there is no provider
 * variant of this flow.
 */
export function GoogleButton({
  label = 'Continue with Google',
}: {
  label?: string;
}) {
  return (
    <a
      href={buildGoogleAuthUrl()}
      className={buttonClasses({ variant: 'outline', fullWidth: true })}
    >
      <GoogleIcon className='h-4 w-4' />
      {label}
    </a>
  );
}
