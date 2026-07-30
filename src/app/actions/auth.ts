'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://gear-up-self.vercel.app';

export async function logout(): Promise<void> {
  const cookieStore = await cookies();

  // Call backend logout (best-effort)
  const token = cookieStore.get('accessToken')?.value;
  if (token) {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
    } catch {
      // Ignore — always clear local cookies
    }
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  redirect('/login');
}
