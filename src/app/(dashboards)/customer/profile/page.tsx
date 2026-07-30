import { DUMMY_CUSTOMER } from '@/lib/dummy-data';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { PageHeader } from '@/components/dashboard/PageHeader';

export default async function CustomerProfilePage() {
  // ── DEMO MODE: real auth commented out ────────────────────────────
  // const user = await getCurrentUser();
  // if (!user) redirect('/login');
  const user = DUMMY_CUSTOMER;
  // ───────────────────────────────────────────────────────────────────────

  return (
    <div>
      <PageHeader
        title='Profile Settings'
        description='Manage your account information and password.'
      />
      <ProfileForm user={user} />
    </div>
  );
}
