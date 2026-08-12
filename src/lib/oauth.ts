export type GoogleAuthRole = 'CUSTOMER' | 'PROVIDER';

/**
 * Google OAuth start URL. Must be opened via a full browser navigation
 * (`window.location.href` or a plain `<a>`), never `fetch` — an XHR can't
 * follow the redirect to Google's consent screen and the backend's
 * CSRF-state cookie would be discarded.
 */
export function buildGoogleAuthUrl(role?: GoogleAuthRole) {
  const params = new URLSearchParams({ redirect: '/oauth/callback' });
  if (role) params.set('role', role);

  return `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/auth/google?${params.toString()}`;
}
