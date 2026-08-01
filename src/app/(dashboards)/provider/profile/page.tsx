import { ProfileContent } from '@/components/dashboard/ProfileContent';
import { PageHeader } from '@/components/dashboard/PageHeader';

export default async function ProviderProfilePage() {
  return (
    <div>
      <PageHeader
        title='Profile Settings'
        description='View and update your account information.'
      />
      <ProfileContent />
    </div>
  );
}
