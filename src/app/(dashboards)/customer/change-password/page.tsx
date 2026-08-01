import { PageHeader } from '@/components/dashboard/PageHeader';
import { ChangePasswordForm } from '@/components/dashboard/ChangePasswordForm';

export default function CustomerChangePasswordPage() {
  return (
    <div>
      <PageHeader
        title='Change Password'
        description='Update your account password to keep your account secure.'
      />
      <ChangePasswordForm />
    </div>
  );
}
