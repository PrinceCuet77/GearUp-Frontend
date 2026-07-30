// import { redirect } from 'next/navigation';
// import { getCurrentUser } from '@/lib/api';
import { DUMMY_ADMIN } from '@/lib/dummy-data';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { PageHeader } from '@/components/dashboard/PageHeader';

export default async function AdminProfilePage() {
  const user = DUMMY_ADMIN;

  return (
    <div>
      <PageHeader
        title='Profile Settings'
        description='Manage your admin account and password.'
      />
      <ProfileForm user={user} />
    </div>
  );
}
