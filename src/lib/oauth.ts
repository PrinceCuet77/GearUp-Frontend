/**
 * Google OAuth start URL (`GET /api/v1/auth/google`).
 *
 * The endpoint takes no query params and has no role-scoped variants — every
 * account created through Google is a `CUSTOMER`; providers must register with
 * email/password. On success the backend sets the session cookies itself and
 * redirects to `<APP_URL>/customer`, so there is no client-side callback page.
 *
 * Must be opened via a full browser navigation (a plain `<a>` or
 * `window.location.href`), never `fetch` — an XHR can't follow the redirect to
 * Google's consent screen and CORS blocks it.
 */
export function buildGoogleAuthUrl() {
  return `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/auth/google`;
}
