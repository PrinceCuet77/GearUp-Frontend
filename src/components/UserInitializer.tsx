'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import type { User } from '@/lib/types';

/**
 * Bootstraps the Zustand auth store with the server-fetched profile.
 * Place this in the root layout - it runs once on mount and syncs the
 * server-rendered user data into the global store so every client component
 * can read from useAuthStore instead of fetching independently.
 */
export default function UserInitializer({
  initialProfile,
}: {
  initialProfile: User | null;
}) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    setUser(initialProfile);
  }, [initialProfile, setUser]);

  return null;
}
