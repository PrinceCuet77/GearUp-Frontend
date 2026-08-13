'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { adoptGoogleSessionAction } from '@/app/(auth)/_actions/googleAuthActions';
import { buttonClasses } from '@/components/ui/Button';
import {
  OAUTH_PARAMS,
  oauthErrorMessage,
  readOAuthFragment,
} from '@/lib/oauth';
import { useAuthStore } from '@/store/useAuthStore';
import type { User, UserRole } from '@/lib/types';

const DASHBOARD_BY_ROLE: Record<UserRole, string> = {
  ADMIN: '/admin',
  CUSTOMER: '/customer',
  PROVIDER: '/provider',
};

/**
 * Landing page for the Google OAuth callback (spec §3.4). The backend redirects
 * here with `?role=&isNewUser=` and the tokens in the URL fragment:
 *
 *   /oauth/callback?role=PROVIDER&isNewUser=true#accessToken=…&refreshToken=…
 *
 * It exchanges that fragment for this origin's own session cookies, wipes the
 * fragment out of the address bar, then routes by role. Failures arrive as
 * `?error=<code>` and are bounced to /login with readable copy.
 */
function OAuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState<string | null>(null);
  // Effects run twice in dev under StrictMode, and the fragment is consumed
  // (and cleared) on the first pass - guard so the second doesn't see an empty
  // hash and report a failure.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const errorCode = searchParams.get(OAUTH_PARAMS.error);
    const tokens = readOAuthFragment(window.location.hash);
    const isNewUser = searchParams.get(OAUTH_PARAMS.isNewUser) === 'true';
    const roleParam = searchParams.get(OAUTH_PARAMS.role) as UserRole | null;

    // Strip the tokens from the address bar (and so from history/bookmarks)
    // before anything else - they are already in hand.
    if (window.location.hash) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
    }

    (async () => {
      if (errorCode) {
        const message = oauthErrorMessage(errorCode);
        router.replace(`/login?error=${encodeURIComponent(message)}`);
        return;
      }

      if (!tokens) {
        setError(
          'Google sign-in did not return a session. Please try signing in again.',
        );
        return;
      }

      const result = await adoptGoogleSessionAction(
        tokens.accessToken,
        tokens.refreshToken,
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      toast.success(
        isNewUser ? 'Welcome to GearUp!' : 'Signed in with Google.',
      );

      const role = result.data?.role ?? roleParam;
      const destination =
        (role && DASHBOARD_BY_ROLE[role]) ?? DASHBOARD_BY_ROLE.CUSTOMER;

      if (result.data?.user) {
        setUser(result.data.user as User);
        router.replace(destination);
        return;
      }

      // No profile came back with the session. A client-side navigation would
      // leave the store (and so the navbar) looking logged out, because the
      // root layout - where UserInitializer hydrates it - doesn't re-render.
      // Take the full page load instead so the server hydrates it.
      window.location.replace(destination);
    })();
  }, [router, searchParams, setUser]);

  if (error) {
    return (
      <div className='w-full max-w-md px-2 sm:px-0'>
        <div className='surface-card flex flex-col items-center gap-4 p-6 text-center shadow-lg sm:p-8'>
          <span className='flex h-12 w-12 items-center justify-center rounded-control bg-danger-soft'>
            <AlertCircle
              className='h-6 w-6 text-danger-soft-foreground'
              aria-hidden='true'
            />
          </span>
          <h1 className='text-xl font-bold tracking-tight text-foreground'>
            Sign-in failed
          </h1>
          <p className='text-sm text-muted-foreground'>{error}</p>
          <Link
            href='/login'
            className={buttonClasses({ variant: 'outline', fullWidth: true })}
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-md px-2 sm:px-0'>
      <div className='surface-card flex flex-col items-center gap-3 p-8 text-center shadow-lg'>
        <Loader2
          className='h-6 w-6 animate-spin text-primary'
          aria-hidden='true'
        />
        <p className='text-sm font-medium text-foreground'>
          Finishing your Google sign-in…
        </p>
        <p className='text-xs text-muted-foreground'>
          Hang tight, this only takes a moment.
        </p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <OAuthCallbackInner />
    </Suspense>
  );
}
