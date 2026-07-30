'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const logoutAction = async () => {
  const cookie = await cookies();
  cookie.delete('accessToken');
  cookie.delete('refreshToken');

  revalidateTag('user-profile', 'max');
};
