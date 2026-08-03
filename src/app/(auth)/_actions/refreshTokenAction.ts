'use server';

import { jwtUtils } from '@/lib/jwt';
import { cookies } from 'next/headers';

export const refreshTokenAction = async () => {
  const cookie = await cookies();
  const refreshToken = cookie.get('refreshToken')?.value;

  if (!refreshToken) {
    return {
      success: false,
      message: 'No refresh token found.',
    };
  }

  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/refresh`,
      {
        method: 'POST',
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      },
    );

    const result = await response.json();

    return result;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
    };
  }
};

export const isAccessTokenExist = async () => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken')?.value || null;
  const refreshToken = cookieStore.get('refreshToken')?.value || null;

  if (!accessToken && !refreshToken) {
    return {
      success: false,
      message: 'User not logged in!',
    };
  }

  const decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    // Access token has expired but refresh token is valid, get new access token from backend
    const result = await refreshTokenAction();

    if (result.success) {
      const newAccessToken = result.data.accessToken;

      cookieStore.set('accessToken', newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: 'lax',
      });

      accessToken = newAccessToken;
    }
  }

  return accessToken;
};
