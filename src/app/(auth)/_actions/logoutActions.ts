'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const logoutAction = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get('accessToken')?.value;
  const refreshToken = cookie.get('refreshToken')?.value;

  try {
    await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: [
          accessToken ? `accessToken=${accessToken}` : null,
          refreshToken ? `refreshToken=${refreshToken}` : null,
        ]
          .filter(Boolean)
          .join('; '),
      },
    });
  } catch {
    // Clear the local session regardless of whether the backend call succeeded.
  }

  cookie.delete('accessToken');
  cookie.delete('refreshToken');

  revalidateTag('user-profile', 'max');
};
