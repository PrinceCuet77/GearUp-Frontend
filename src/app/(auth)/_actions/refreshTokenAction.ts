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
      `${process.env.BACKEND_URL}/api/auth/refresh`,
      {
        method: 'POST',
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      },
    );

    const result = await response.json();

    if (result.success) {
      cookie.set('refreshToken', result.data.refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
      });
    } else {
      // Refresh token is invalid/expired — clean up
      cookie.delete('accessToken');
      cookie.delete('refreshToken');
    }

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
