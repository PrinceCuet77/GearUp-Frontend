'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';
import { useAuthStore } from '@/store/useAuthStore';
import type { User, UserRole } from '@/lib/types';

/** Known machine codes from §3.6 of the auth spec; anything else is shown verbatim. */
const ERROR_MESSAGES: Record<string, string> = {
  invalid_oauth_state:
    'Your sign-in link expired. Please try again.',
  google_authentication_failed:
    'Google sign-in was cancelled or failed.',
};

const SESSION_FAILED_MESSAGE =
  "We couldn't confirm your Google sign-in. Please try again.";

function dashboardPathForRole(role: UserRole) {
  if (role === 'ADMIN') return '/admin';
  if (role === 'PROVIDER') return '/provider';
  return '/customer';
}

function Spinner() {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground'>
      <Loader2 className='h-8 w-8 animate-spin text-primary' aria-hidden='true' />
      <p className='text-sm font-medium'>Signing you in…</p>
    </div>
  );
}

function OAuthCallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const error = params.get('error');
    if (error) {
      const message = ERROR_MESSAGES[error] ?? decodeURIComponent(error);
      router.replace(`/login?error=${encodeURIComponent(message)}`);
      return;
    }

    const requestedRole = params.get('role');
    const isNewUser = params.get('isNewUser') === 'true';

    getProfileAction()
      .then((result) => {
        if (!result.success || !result.data) {
          router.replace(
            `/login?error=${encodeURIComponent(SESSION_FAILED_MESSAGE)}`,
          );
          return;
        }

        const profile = result.data;
        setUser(profile as User);

        if (isNewUser) {
          toast.success('Welcome to GearUp!');
        } else if (requestedRole && requestedRole !== profile.role) {
          // The stored role always wins — the tile they picked is only a hint.
          toast.info(
            `You're signed in as a ${profile.role.toLowerCase()}. Contact support to change your account type.`,
          );
        }

        router.replace(dashboardPathForRole(profile.role));
      })
      .catch(() =>
        router.replace(
          `/login?error=${encodeURIComponent(SESSION_FAILED_MESSAGE)}`,
        ),
      );
    // Runs once on mount — the callback URL's params don't change under us.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Spinner />;
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <OAuthCallbackInner />
    </Suspense>
  );
}
