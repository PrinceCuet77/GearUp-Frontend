'use client';

import { useState } from 'react';
import { Loader2, Save, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import type { User as UserType } from '@/lib/types';

interface ProfileFormProps {
  user: UserType;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '');
  const [saving, setSaving] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // ── DEMO MODE: API call commented out ──────────────────────────────
    await new Promise((r) => setTimeout(r, 500));
    // ───────────────────────────────────────────────────────────────────────

    toast.success('Profile updated successfully. (demo)');
    setSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setChangingPassword(true);

    // ── DEMO MODE: API call commented out ──────────────────────────────
    await new Promise((r) => setTimeout(r, 500));
    // ───────────────────────────────────────────────────────────────────────

    toast.success('Password changed successfully. (demo)');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangingPassword(false);
  };

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    color: 'var(--foreground)',
  };

  return (
    <div className='mx-auto max-w-2xl space-y-6'>
      {/* Profile info */}
      <div
        className='rounded-xl border p-6'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <div className='mb-5 flex items-center gap-2'>
          <User className='h-4 w-4' style={{ color: 'var(--primary)' }} />
          <h2
            className='text-base font-semibold'
            style={{ color: 'var(--foreground)' }}
          >
            Personal Information
          </h2>
        </div>

        <form onSubmit={handleProfileSave} className='space-y-4'>
          {/* Email (read-only) */}
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
              className='h-10 w-full rounded-lg border px-3 text-sm opacity-60'
              style={inputStyle}
            />
          </div>

          {/* Name */}
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
              className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:ring-2'
              style={
                {
                  ...inputStyle,
                  '--tw-ring-color': 'var(--ring)',
                } as React.CSSProperties
              }
            />
          </div>

          {/* Avatar URL */}
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
              className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors'
              style={inputStyle}
            />
          </div>

          <div className='flex justify-end'>
            <button
              type='submit'
              disabled={saving}
              className='inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-60'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {saving ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Save className='h-4 w-4' />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div
        className='rounded-xl border p-6'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <div className='mb-5 flex items-center gap-2'>
          <Lock className='h-4 w-4' style={{ color: 'var(--primary)' }} />
          <h2
            className='text-base font-semibold'
            style={{ color: 'var(--foreground)' }}
          >
            Change Password
          </h2>
        </div>

        <form onSubmit={handlePasswordChange} className='space-y-4'>
          <div>
            <label
              className='mb-1.5 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Current Password
            </label>
            <input
              type='password'
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors'
              style={inputStyle}
            />
          </div>

          <div>
            <label
              className='mb-1.5 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              New Password
            </label>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors'
              style={inputStyle}
            />
          </div>

          <div>
            <label
              className='mb-1.5 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Confirm New Password
            </label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors'
              style={inputStyle}
            />
          </div>

          <div className='flex justify-end'>
            <button
              type='submit'
              disabled={changingPassword}
              className='inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-60'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {changingPassword ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Lock className='h-4 w-4' />
              )}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
