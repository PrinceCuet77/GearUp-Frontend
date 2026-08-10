'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Pencil, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { updateProfile } from '@/app/(dashboards)/customer/profile/_actions/updateProfile';
import { useAuthStore } from '@/store/useAuthStore';
import type { User, UserRole } from '@/lib/types';

interface ProfileContentClientProps {
  user: User;
}

/** Roles map onto brand tones only — no extra colours enter the palette. */
const ROLE_TONE: Record<UserRole, BadgeTone> = {
  ADMIN: 'danger',
  PROVIDER: 'secondary',
  CUSTOMER: 'accent',
};

function getInitials(n?: string | null, e?: string) {
  if (n)
    return n
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  return (e?.[0] ?? 'U').toUpperCase();
}

export function ProfileContentClient({ user }: ProfileContentClientProps) {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState(user.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  /* Track original values to detect changes */
  const originalName = user.name ?? '';
  const originalAvatar = user.avatarUrl ?? '';
  const hasChanges = name !== originalName || avatarUrl !== originalAvatar;

  /* Reset the draft fields each time the modal opens. Adjusting during render
     keeps the first painted frame correct — an effect would briefly show the
     previously edited (and discarded) values. */
  const [wasOpen, setWasOpen] = useState(modalOpen);
  if (modalOpen !== wasOpen) {
    setWasOpen(modalOpen);
    if (modalOpen) {
      setName(originalName);
      setAvatarUrl(originalAvatar);
      setPreviewFailed(false);
    }
  }

  const nameError =
    name.trim().length > 100 ? 'Name must be 100 characters or fewer.' : undefined;
  const avatarError =
    avatarUrl.trim().length > 255
      ? 'Avatar URL must be 255 characters or fewer.'
      : undefined;

  const handleSave = useCallback(async () => {
    const trimmedName = name.trim();
    const trimmedAvatar = avatarUrl.trim();

    if (trimmedName.length > 100) {
      toast.error('Name must be 100 characters or fewer.');
      return;
    }
    if (trimmedAvatar.length > 255) {
      toast.error('Avatar URL must be 255 characters or fewer.');
      return;
    }

    setSaving(true);

    const result = await updateProfile({
      name: trimmedName,
      avatarUrl: trimmedAvatar || undefined,
    });

    if (result.success && result.data) {
      // Update Zustand store with new profile data
      setUser(result.data);
      toast.success('Profile updated successfully.');
      setModalOpen(false);
      setAvatarFailed(false);
      router.refresh();
    } else {
      toast.error(
        result.error ?? 'Failed to update profile. Please try again.',
      );
    }

    setSaving(false);
  }, [name, avatarUrl, router, setUser]);

  return (
    <div className='mx-auto max-w-2xl space-y-6'>
      {/* Profile info card */}
      <div className='surface-card p-6'>
        <div className='mb-5 flex items-center gap-2'>
          <UserIcon className='h-4 w-4 text-primary' aria-hidden='true' />
          <h2 className='text-base font-bold text-foreground'>
            Personal Information
          </h2>
        </div>

        <div className='space-y-4'>
          {/* Avatar */}
          <div className='flex items-center gap-4'>
            {user.avatarUrl && !avatarFailed ? (
              <Image
                src={user.avatarUrl}
                alt={user.name ?? 'Profile photo'}
                width={64}
                height={64}
                className='h-16 w-16 rounded-control object-cover'
                onError={() => setAvatarFailed(true)}
                unoptimized
              />
            ) : (
              <span className='flex h-16 w-16 items-center justify-center rounded-control bg-primary text-lg font-bold text-primary-foreground'>
                {getInitials(user.name, user.email)}
              </span>
            )}
            <div className='min-w-0'>
              <p className='truncate font-semibold text-foreground'>
                {user.name ?? 'No name set'}
              </p>
              <p className='truncate text-xs text-muted-foreground'>
                {user.email}
              </p>
              <Badge
                tone={ROLE_TONE[user.role] ?? 'neutral'}
                size='sm'
                className='mt-1.5'
              >
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Read-only fields */}
          <div className='grid gap-4 sm:grid-cols-2'>
            <FormField label='Email'>
              {(props) => (
                <input
                  {...props}
                  type='email'
                  value={user.email}
                  disabled
                  className={`${props.className} cursor-not-allowed opacity-60`}
                />
              )}
            </FormField>

            <FormField label='Full name'>
              {(props) => (
                <input
                  {...props}
                  type='text'
                  value={user.name ?? ''}
                  disabled
                  className={`${props.className} cursor-not-allowed opacity-60`}
                />
              )}
            </FormField>
          </div>

          <div className='flex justify-end'>
            <Button
              onClick={() => setModalOpen(true)}
              leadingIcon={<Pencil className='h-4 w-4' />}
            >
              Update Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title='Update Profile'
        onSave={handleSave}
        saveLabel='Save Changes'
        cancelLabel='Cancel'
        saving={saving}
        saveDisabled={!hasChanges || Boolean(nameError || avatarError)}
        footerRight
      >
        <form
          className='space-y-4'
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <FormField
            label='Full name'
            error={nameError}
            hint={`${name.length}/100 characters`}
          >
            {(props) => (
              <input
                {...props}
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your full name'
                maxLength={100}
              />
            )}
          </FormField>

          <FormField
            label='Avatar URL'
            error={avatarError}
            hint={`Optional — ${avatarUrl.length}/255 characters`}
          >
            {(props) => (
              <input
                {...props}
                type='url'
                value={avatarUrl}
                onChange={(e) => {
                  setAvatarUrl(e.target.value);
                  setPreviewFailed(false);
                }}
                placeholder='https://example.com/avatar.jpg'
                maxLength={255}
              />
            )}
          </FormField>

          {avatarUrl && !previewFailed && (
            <div className='flex items-center gap-3'>
              <Image
                src={avatarUrl}
                alt='Avatar preview'
                width={40}
                height={40}
                className='h-10 w-10 rounded-control object-cover'
                onError={() => setPreviewFailed(true)}
                unoptimized
              />
              <span className='text-xs text-muted-foreground'>Preview</span>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
