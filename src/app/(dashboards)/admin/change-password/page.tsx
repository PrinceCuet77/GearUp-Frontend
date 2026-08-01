import { PageHeader } from '@/components/dashboard/PageHeader';
import { ChangePasswordForm } from '@/components/dashboard/ChangePasswordForm';

export default function AdminChangePasswordPage() {
  return (
    <div>
      <PageHeader
        title='Change Password'
        description='Update your admin account password to keep your account secure.'
      />
      <ChangePasswordForm />
    </div>
  );
}
