import { DUMMY_PROVIDER } from '@/lib/dummy-data';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { PageHeader } from '@/components/dashboard/PageHeader';

export default async function ProviderProfilePage() {
  const user = DUMMY_PROVIDER;

  return (
    <div>
      <PageHeader
        title='Profile Settings'
        description='Manage your provider account and password.'
      />
      <ProfileForm user={user} />
    </div>
  );
}
