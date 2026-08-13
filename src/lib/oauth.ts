import type { UserRole } from '@/lib/types';

/**
 * Frontend path the backend sends the browser back to once Google is done.
 * Must start with `/` - the backend rejects absolute/protocol-relative values
 * to avoid being turned into an open redirect.
 */
export const OAUTH_CALLBACK_PATH = '/oauth/callback';

/** Roles a brand-new Google account can be created as. There is no `/google/admin`. */
export type GoogleSignupRole = Extract<UserRole, 'CUSTOMER' | 'PROVIDER'>;

const GOOGLE_START_PATH: Record<GoogleSignupRole, string> = {
  CUSTOMER: '/api/v1/auth/google/customer',
  PROVIDER: '/api/v1/auth/google/provider',
};

/**
 * Google OAuth start URL (spec §3.3).
 *
 * `role` only applies to accounts being *created* - an existing user keeps the
 * role they signed up with, whichever variant they come through. The role, the
 * `redirect` path and the origin are packed into a signed 10-minute `state`, so
 * nothing needs to survive the redirect in `localStorage`.
 *
 * Must be opened via a full browser navigation (a plain `<a>` or
 * `window.location.href`), never `fetch` - an XHR can't follow the redirect to
 * Google's consent screen and CORS blocks it.
 */
export function buildGoogleAuthUrl(
  role: GoogleSignupRole = 'CUSTOMER',
  redirect: string = OAUTH_CALLBACK_PATH,
) {
  const base = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${GOOGLE_START_PATH[role]}`;
  return `${base}?redirect=${encodeURIComponent(redirect)}`;
}

/**
 * Query params the callback redirect carries (spec §3.4):
 * `<redirect>?role=<ROLE>&isNewUser=<bool>#accessToken=<jwt>&refreshToken=<jwt>`,
 * or `<redirect>?error=<code>` on failure.
 */
export const OAUTH_PARAMS = {
  role: 'role',
  isNewUser: 'isNewUser',
  error: 'error',
} as const;

/** Known `error` codes from §3.4, mapped to copy safe to show a user. */
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_oauth_state: 'Your sign-in link expired. Please try again.',
  google_authentication_failed: 'Google sign-in was cancelled or failed.',
};

/**
 * Some failures come back as an already-human-readable message rather than a
 * code ("No email found from google!", the suspended-account message), so
 * unknown values are passed through instead of being replaced.
 */
export function oauthErrorMessage(code: string) {
  return (
    OAUTH_ERROR_MESSAGES[code] ||
    code ||
    'Google sign-in failed. Please try again.'
  );
}

/** Tokens handed back in the callback URL fragment. */
export type OAuthFragmentTokens = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Reads the tokens out of a URL fragment. The fragment is used (rather than a
 * query param) because it never reaches a server - no access logs, no `Referer`
 * leakage. Returns `null` when either token is missing.
 */
export function readOAuthFragment(hash: string): OAuthFragmentTokens | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) return null;

  const params = new URLSearchParams(raw);
  const accessToken = params.get('accessToken');
  const refreshToken = params.get('refreshToken');

  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}
