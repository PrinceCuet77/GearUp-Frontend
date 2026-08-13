'use server';

import type { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { jwtUtils } from '@/lib/jwt';
import type { UserProfile, UserRole } from '@/lib/types';
import { getProfileAction } from './getProfileActions';

type AdoptResult = {
  success: boolean;
  message: string;
  data: { user: UserProfile | null; role: UserRole | null } | null;
};

/**
 * Turns the tokens the Google callback hands back in the URL fragment
 * (spec §3.4) into this origin's own `accessToken`/`refreshToken` cookies.
 *
 * The backend also sets its own cookies, but on a split-domain deployment those
 * are third-party - Safari, Firefox and Chrome incognito drop them (spec §2).
 * Everything here (middleware RBAC, every server action) reads *our* cookies, so
 * adopting the tokens is what actually creates the session. Same cookie flags as
 * `loginActions.ts`, so a Google session and a credentials session are identical
 * from this point on.
 *
 * Both tokens are verified against the shared JWT secrets before anything is
 * written - a token that fails verification would only get rejected by the
 * middleware on the next request anyway, so failing here gives a clean error.
 */
export const adoptGoogleSessionAction = async (
  accessToken: string,
  refreshToken: string,
): Promise<AdoptResult> => {
  const failure = {
    success: false,
    message: 'Your Google sign-in could not be completed. Please try again.',
    data: null,
  };

  if (!accessToken || !refreshToken) return failure;

  const decodedAccessToken = jwtUtils.verifyToken(
    accessToken,
    process.env.JWT_ACCESS_SECRET as string,
  );
  const decodedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string,
  );

  if (!decodedAccessToken.success || !decodedRefreshToken.success) {
    return failure;
  }

  const cookie = await cookies();

  cookie.set('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: 'lax',
  });

  cookie.set('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  });

  // The JWT carries the role, so routing never depends on the profile call
  // succeeding - that only fills the auth store to skip a fetch on the dashboard.
  const claims = decodedAccessToken.data as JwtPayload;
  const role = (claims?.role as UserRole) ?? null;

  const profile = await getProfileAction();

  return {
    success: true,
    message: 'Signed in with Google.',
    data: {
      user: profile.success ? profile.data : null,
      role: (profile.success ? profile.data?.role : null) ?? role,
    },
  };
};
