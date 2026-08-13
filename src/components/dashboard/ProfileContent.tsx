import { redirect } from 'next/navigation';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';
import { PageHeader } from './PageHeader';
import { ProfileContentClient } from './ProfileContentClient';
import type { User, UserStatus } from '@/lib/types';

/**
 * Profile page body, shared by all three roles.
 *
 * Fetches server-side so the form renders already populated - no empty-input
 * flash while a client request resolves.
 */
export async function ProfileContent() {
  let profile;
  try {
    const result = await getProfileAction();
    if (!result.success || !result.data) redirect('/login');
    profile = result.data!;
  } catch {
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

  return (
    <div>
      <PageHeader
        title='My Profile'
        description='Your account details and how you appear to others on GearUp.'
      />
      <ProfileContentClient user={user} />
    </div>
  );
}
