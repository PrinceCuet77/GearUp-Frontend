import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, ShieldCheck, UserCog } from 'lucide-react';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';
import { PageHeader } from './PageHeader';
import { ChangePasswordForm } from './ChangePasswordForm';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/gear-utils';

/**
 * Account settings, shared by all three roles: security first, with the
 * account facts that are managed elsewhere summarised alongside.
 */
export async function SettingsContent({ basePath }: { basePath: string }) {
  let profile;
  try {
    const result = await getProfileAction();
    if (!result.success || !result.data) redirect('/login');
    profile = result.data!;
  } catch {
    redirect('/login');
  }

  const summary = [
    { label: 'Signed in as', value: profile.email },
    { label: 'Account role', value: profile.role },
    { label: 'Member since', value: formatDate(profile.createdAt) },
  ];

  return (
    <div>
      <PageHeader
        title='Account Settings'
        description='Manage your sign-in security and review your account details.'
      />

      <div className='grid gap-6 lg:grid-cols-3'>
        <section className='lg:col-span-2'>
          <div className='surface-card p-6'>
            <div className='mb-1 flex items-center gap-2'>
              <ShieldCheck className='h-4 w-4 text-primary' aria-hidden='true' />
              <h2 className='text-base font-bold text-foreground'>
                Password &amp; security
              </h2>
            </div>
            <p className='mb-5 text-sm text-muted-foreground'>
              Choose a password you do not use anywhere else. You stay signed in
              on this device after changing it.
            </p>
            <ChangePasswordForm />
          </div>
        </section>

        <section className='surface-card h-fit p-6'>
          <div className='mb-4 flex items-center gap-2'>
            <UserCog className='h-4 w-4 text-primary' aria-hidden='true' />
            <h2 className='text-base font-bold text-foreground'>
              Account summary
            </h2>
          </div>

          <dl className='space-y-4'>
            {summary.map((row) => (
              <div key={row.label}>
                <dt className='text-xs font-semibold text-muted-foreground'>
                  {row.label}
                </dt>
                <dd className='mt-0.5 truncate text-sm font-medium text-foreground'>
                  {row.value}
                </dd>
              </div>
            ))}
            <div>
              <dt className='text-xs font-semibold text-muted-foreground'>
                Status
              </dt>
              <dd className='mt-1'>
                <Badge
                  tone={profile.status === 'ACTIVE' ? 'secondary' : 'danger'}
                  size='sm'
                >
                  {profile.status === 'ACTIVE' ? 'Active' : 'Suspended'}
                </Badge>
              </dd>
            </div>
          </dl>

          <Link
            href={`${basePath}/profile`}
            className='mt-6 flex items-center justify-between gap-2 rounded-control border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-muted'
          >
            Edit profile details
            <ArrowRight className='h-4 w-4 shrink-0' aria-hidden='true' />
          </Link>
        </section>
      </div>
    </div>
  );
}
