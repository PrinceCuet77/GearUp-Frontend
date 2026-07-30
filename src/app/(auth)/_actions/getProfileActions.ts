'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER' | 'PROVIDER';
  status: 'ACTIVE' | 'INACTIVE';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const getProfileAction = async (): Promise<UserProfile | null> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return null;
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/api/user/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      // cache: 'force-cache',
      // next: { revalidate: 60 * 60 * 24, tags: ['user-profile'] }, // Enable caching with a tag
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    console.log("🚀 ~ getProfileAction ~ result:", result)

    if (result.success && result.data) {
      return result.data as UserProfile;
    }

    return null;
  } catch {
    return null;
  }
};
