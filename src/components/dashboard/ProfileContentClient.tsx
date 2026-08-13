'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Mail,
  RefreshCw,
  Save,
  ShieldCheck,
  UserCog,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { UserAvatar } from './UserAvatar';
import { updateProfile } from '@/app/(dashboards)/customer/profile/_actions/updateProfile';
import { useAuthStore } from '@/store/useAuthStore';
import {
  updateProfileSchema,
  type UpdateProfileValues,
} from '@/lib/validations/profile';
import { formatDate } from '@/lib/gear-utils';
import type { User, UserRole } from '@/lib/types';

const ROLE_TONE: Record<UserRole, BadgeTone> = {
  ADMIN: 'primary',
  PROVIDER: 'secondary',
  CUSTOMER: 'accent',
};

const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  PROVIDER: 'Gear Provider',
  CUSTOMER: 'Customer',
};

interface ProfileContentClientProps {
  user: User;
}

/**
 * Profile page: identity summary plus the editable fields, inline.
 *
 * Editing happens on the page rather than in a modal - the form is the point of
 * the page, and an inline form keeps the current values visible while typing.
 */
export function ProfileContentClient({ user }: ProfileContentClientProps) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultValues: UpdateProfileValues = {
    name: user.name ?? '',
    avatarUrl: user.avatarUrl ?? '',
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
    mode: 'onBlur',
  });

  // Subscribed values (not `watch()`) so the summary card previews edits live
  // without handing the compiler a function it cannot memoise.
  const previewName = useWatch({ control, name: 'name' });
  const previewAvatar = useWatch({ control, name: 'avatarUrl' });

  const onSubmit = async (values: UpdateProfileValues) => {
    setSubmitError(null);
    setSavedAt(null);

    const result = await updateProfile({
      name: values.name.trim(),
      avatarUrl: values.avatarUrl.trim() || undefined,
    });

    if (!result.success || !result.data) {
      const message =
        result.error ?? 'Could not update your profile. Please try again.';
      setSubmitError(message);
      toast.error(message);
      return;
    }

    setUser(result.data);
    setSavedAt(new Date().toISOString());
    toast.success('Profile updated.');
    // Re-seed the form so "unsaved changes" clears and Reset returns here.
    reset({
      name: result.data.name ?? '',
      avatarUrl: result.data.avatarUrl ?? '',
    });
    router.refresh();
  };

  const details = [
    {
      icon: Mail,
      label: 'Email address',
      value: user.email,
      note: 'Contact support to change your email.',
    },
    {
      icon: ShieldCheck,
      label: 'Account role',
      value: ROLE_LABEL[user.role] ?? user.role,
      note: 'Determines which parts of GearUp you can access.',
    },
    {
      icon: CalendarDays,
      label: 'Member since',
      value: formatDate(user.createdAt),
      note: 'The day this account was created.',
    },
    {
      icon: RefreshCw,
      label: 'Last updated',
      value: formatDate(user.updatedAt),
      note: 'When your details were last changed.',
    },
  ];

  return (
    <div className='grid gap-6 lg:grid-cols-3'>
      {/* Identity summary */}
      <section className='surface-card h-fit p-6 lg:col-span-1'>
        <div className='flex flex-col items-center text-center'>
          <UserAvatar
            name={previewName || user.name}
            email={user.email}
            src={previewAvatar || user.avatarUrl}
            size={88}
            shape='control'
          />
          <h2 className='mt-4 w-full truncate text-lg font-bold text-foreground'>
            {previewName || user.name || 'Unnamed account'}
          </h2>
          <p className='mt-0.5 w-full truncate text-sm text-muted-foreground'>
            {user.email}
          </p>
          <div className='mt-3 flex flex-wrap items-center justify-center gap-2'>
            <Badge tone={ROLE_TONE[user.role] ?? 'neutral'} size='sm'>
              {ROLE_LABEL[user.role] ?? user.role}
            </Badge>
            <Badge
              tone={user.status === 'ACTIVE' ? 'secondary' : 'danger'}
              size='sm'
              icon={<BadgeCheck className='h-3 w-3' aria-hidden='true' />}
            >
              {user.status === 'ACTIVE' ? 'Active' : 'Suspended'}
            </Badge>
          </div>
        </div>

        <dl className='mt-6 space-y-4 border-t border-border pt-5'>
          {details.map((detail) => (
            <div key={detail.label} className='flex items-start gap-3'>
              <span className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-muted'>
                <detail.icon
                  className='h-4 w-4 text-muted-foreground'
                  aria-hidden='true'
                />
              </span>
              <div className='min-w-0'>
                <dt className='text-xs font-semibold text-muted-foreground'>
                  {detail.label}
                </dt>
                <dd className='truncate text-sm font-medium text-foreground'>
                  {detail.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* Editable fields */}
      <section className='surface-card p-6 lg:col-span-2'>
        <div className='mb-5 flex items-center gap-2'>
          <UserCog className='h-4 w-4 text-primary' aria-hidden='true' />
          <h2 className='text-base font-bold text-foreground'>
            Edit your information
          </h2>
        </div>

        {savedAt && (
          <p
            role='status'
            className='mb-5 flex items-center gap-2 rounded-control border border-secondary/40 bg-secondary-soft px-4 py-3 text-sm font-medium text-secondary-soft-foreground'
          >
            <CheckCircle2 className='h-4 w-4 shrink-0' aria-hidden='true' />
            Your profile was saved.
          </p>
        )}

        {submitError && (
          <p
            role='alert'
            className='mb-5 flex items-center gap-2 rounded-control border border-danger/40 bg-danger-soft px-4 py-3 text-sm font-medium text-danger-soft-foreground'
          >
            <AlertCircle className='h-4 w-4 shrink-0' aria-hidden='true' />
            {submitError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className='space-y-5'
        >
          <FormField
            label='Full name'
            required
            error={errors.name?.message}
            hint='Shown to providers and customers on your orders.'
          >
            {(props) => (
              <input
                {...props}
                {...register('name')}
                type='text'
                autoComplete='name'
                placeholder='e.g. Rezoan Shakil'
                maxLength={100}
              />
            )}
          </FormField>

          <FormField
            label='Profile photo URL'
            error={errors.avatarUrl?.message}
            hint='Optional. Must be an https:// link to an image; leave empty to use your initials.'
          >
            {(props) => (
              <input
                {...props}
                {...register('avatarUrl')}
                type='url'
                inputMode='url'
                autoComplete='photo'
                placeholder='https://example.com/photo.jpg'
                maxLength={255}
              />
            )}
          </FormField>

          <FormField label='Email address' hint='Email cannot be changed here.'>
            {(props) => (
              <input
                {...props}
                type='email'
                value={user.email}
                readOnly
                disabled
                className={`${props.className} cursor-not-allowed opacity-60`}
              />
            )}
          </FormField>

          <div className='flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between'>
            <p className='text-xs text-muted-foreground'>
              {isDirty
                ? 'You have unsaved changes.'
                : 'Everything is up to date.'}
            </p>
            <div className='flex gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  reset();
                  setSubmitError(null);
                  setSavedAt(null);
                }}
                disabled={!isDirty || isSubmitting}
              >
                Reset
              </Button>
              <Button
                type='submit'
                loading={isSubmitting}
                loadingText='Saving…'
                disabled={!isDirty}
                leadingIcon={<Save className='h-4 w-4' aria-hidden='true' />}
              >
                Save changes
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
