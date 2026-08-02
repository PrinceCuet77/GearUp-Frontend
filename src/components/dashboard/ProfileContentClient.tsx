'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import { updateProfile } from '@/app/(dashboards)/customer/profile/_actions/updateProfile';
import { useAuthStore } from '@/store/useAuthStore';
import type { User } from '@/lib/types';

interface ProfileContentClientProps {
  user: User;
}

export function ProfileContentClient({ user }: ProfileContentClientProps) {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState(user.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '');
  const [saving, setSaving] = useState(false);

  /* Track original values to detect changes */
  const originalName = user.name ?? '';
  const originalAvatar = user.avatarUrl ?? '';
  const hasChanges = name !== originalName || avatarUrl !== originalAvatar;

  /* Reset form when modal opens */
  useEffect(() => {
    if (modalOpen) {
      setName(user.name ?? '');
      setAvatarUrl(user.avatarUrl ?? '');
    }
  }, [modalOpen, user.name, user.avatarUrl]);

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
      router.refresh();
    } else {
      toast.error(
        result.error ?? 'Failed to update profile. Please try again.',
      );
    }

    setSaving(false);
  }, [name, avatarUrl, router, setUser]);

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    color: 'var(--foreground)',
  };

  const getInitials = (n?: string | null, e?: string) => {
    if (n)
      return n
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
    return (e?.[0] ?? 'U').toUpperCase();
  };

  return (
    <div className='mx-auto max-w-2xl space-y-6'>
      {/* Profile info card */}
      <div
        className='rounded-xl border p-6'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <div className='mb-5 flex items-center gap-2'>
          <UserIcon className='h-4 w-4' style={{ color: 'var(--primary)' }} />
          <h2
            className='text-base font-semibold'
            style={{ color: 'var(--foreground)' }}
          >
            Personal Information
          </h2>
        </div>

        <div className='space-y-4'>
          {/* Avatar */}
          <div className='flex items-center gap-4'>
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name ?? ''}
                className='h-16 w-16 rounded-xl object-cover'
              />
            ) : (
              <span
                className='flex h-16 w-16 items-center justify-center rounded-xl text-lg font-bold text-white'
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {getInitials(user.name, user.email)}
              </span>
            )}
            <div>
              <p style={{ color: 'var(--foreground)' }}>
                {user.name ?? 'No name set'}
              </p>
              <p
                className='text-xs'
                style={{ color: 'var(--muted-foreground)' }}
              >
                {user.email}
              </p>
              <span
                className='mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold'
                style={{
                  backgroundColor:
                    user.role === 'ADMIN'
                      ? 'rgba(239,68,68,0.12)'
                      : user.role === 'PROVIDER'
                        ? 'rgba(34,197,94,0.12)'
                        : 'rgba(59,130,246,0.12)',
                  color:
                    user.role === 'ADMIN'
                      ? '#dc2626'
                      : user.role === 'PROVIDER'
                        ? '#16a34a'
                        : '#2563eb',
                }}
              >
                {user.role}
              </span>
            </div>
          </div>

          {/* Read-only fields */}
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label
                className='mb-1.5 block text-sm font-medium'
                style={{ color: 'var(--foreground)' }}
              >
                Email
              </label>
              <input
                type='email'
                value={user.email}
                disabled
                className='h-10 w-full rounded-lg border px-3 text-sm opacity-60 cursor-not-allowed'
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className='mb-1.5 block text-sm font-medium'
                style={{ color: 'var(--foreground)' }}
              >
                Full Name
              </label>
              <input
                type='text'
                value={user.name ?? ''}
                disabled
                className='h-10 w-full rounded-lg border px-3 text-sm opacity-60 cursor-not-allowed'
                style={inputStyle}
              />
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              type='button'
              onClick={() => setModalOpen(true)}
              className='inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-colors cursor-pointer'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Pencil className='h-4 w-4' />
              Update Profile
            </button>
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
        saveDisabled={!hasChanges || saving}
        footerRight
      >
        <div className='space-y-4'>
          <div>
            <label
              className='mb-1.5 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Full Name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Your full name'
              maxLength={100}
              className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:ring-2'
              style={
                {
                  ...inputStyle,
                  '--tw-ring-color': 'var(--ring)',
                } as React.CSSProperties
              }
            />
            <p
              className='mt-1 text-right text-xs'
              style={{ color: 'var(--muted-foreground)' }}
            >
              {name.length}/100
            </p>
          </div>

          <div>
            <label
              className='mb-1.5 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Avatar URL
              <span
                className='ml-1 text-xs font-normal'
                style={{ color: 'var(--muted-foreground)' }}
              >
                (optional)
              </span>
            </label>
            <input
              type='url'
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder='https://example.com/avatar.jpg'
              maxLength={255}
              className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors'
              style={inputStyle}
            />
            <p
              className='mt-1 text-right text-xs'
              style={{ color: 'var(--muted-foreground)' }}
            >
              {avatarUrl.length}/255
            </p>
            {avatarUrl && (
              <div className='mt-2 flex items-center gap-3'>
                <img
                  src={avatarUrl}
                  alt='Avatar preview'
                  className='h-10 w-10 rounded-lg object-cover'
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span
                  className='text-xs'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Preview
                </span>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
