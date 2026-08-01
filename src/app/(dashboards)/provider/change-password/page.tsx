import { PageHeader } from '@/components/dashboard/PageHeader';
import { ChangePasswordForm } from '@/components/dashboard/ChangePasswordForm';

export default function ProviderChangePasswordPage() {
  return (
    <div>
      <PageHeader
        title='Change Password'
        description='Update your provider account password to keep your account secure.'
      />
      <ChangePasswordForm />
    </div>
  );
}
