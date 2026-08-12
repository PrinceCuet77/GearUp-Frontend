'use client';

import { buttonClasses } from '@/components/ui/Button';
import { GoogleIcon } from '@/components/ui/BrandIcons';
import { buildGoogleAuthUrl, type GoogleAuthRole } from '@/lib/oauth';

const ROLE_LABEL: Record<GoogleAuthRole, string> = {
  CUSTOMER: 'Continue with Google as a Customer',
  PROVIDER: 'Continue with Google as a Provider',
};

/**
 * Starts the Google OAuth flow for the given role. Renders as a plain `<a>`
 * so the browser performs a full navigation — required for the backend's
 * CSRF-state cookie and the redirect to Google's consent screen to work.
 */
export function GoogleButton({
  role,
  label = ROLE_LABEL[role],
}: {
  role: GoogleAuthRole;
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
