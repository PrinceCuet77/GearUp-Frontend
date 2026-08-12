export type GoogleAuthRole = 'CUSTOMER' | 'PROVIDER';

/**
 * Google OAuth start URL. Role is baked into the path
 * (`/api/v1/auth/google/customer` or `/api/v1/auth/google/provider`) — the
 * backend has no role-less variant. Must be opened via a full browser
 * navigation (`window.location.href` or a plain `<a>`), never `fetch` — an
 * XHR can't follow the redirect to Google's consent screen and the backend's
 * CSRF-state cookie would be discarded.
 */
export function buildGoogleAuthUrl(role: GoogleAuthRole) {
  const params = new URLSearchParams({ redirect: '/oauth/callback' });

  return `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/auth/google/${role.toLowerCase()}?${params.toString()}`;
}
