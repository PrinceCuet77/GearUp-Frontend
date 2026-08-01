import { redirect } from 'next/navigation';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';
import { ProfileContentClient } from './ProfileContentClient';
import type { User, UserStatus } from '@/lib/types';

export async function ProfileContent() {
  const profile = await getProfileAction();

  if (!profile) {
    redirect('/login');
  }

  const status: UserStatus =
    profile.status === 'INACTIVE' ? 'SUSPENDED' : 'ACTIVE';

  const user: User = {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    status,
    avatarUrl: profile.avatarUrl ?? null,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };

  return <ProfileContentClient user={user} />;
}
