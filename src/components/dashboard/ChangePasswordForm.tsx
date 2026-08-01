'use client';

import { useState, useCallback } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { changePassword } from '@/app/(dashboards)/customer/change-password/_actions/passwordChange';

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const canSubmit = currentPassword.length > 0 && newPassword.length >= 6;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;

      setSaving(true);

      try {
        const result = await changePassword({
          oldPassword: currentPassword,
          newPassword: newPassword,
        });

        if (result.success) {
          toast.success('Password changed successfully.');
          setCurrentPassword('');
          setNewPassword('');
        } else {
          toast.error(result.error || 'Failed to change password.');
        }
      } catch {
        toast.error('An unexpected error occurred. Please try again.');
      } finally {
        setSaving(false);
      }
    },
    [canSubmit, currentPassword, newPassword],
  );

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    color: 'var(--foreground)',
  };

  return (
    <div className='mx-auto max-w-2xl'>
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
            Update Password
          </h2>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              className='mb-1.5 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Current Password
            </label>
            <input
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:ring-2'
              style={
                {
                  ...inputStyle,
                  '--tw-ring-color': 'var(--ring)',
                } as React.CSSProperties
              }
              placeholder='Enter your current password'
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
              minLength={6}
              className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:ring-2'
              style={
                {
                  ...inputStyle,
                  '--tw-ring-color': 'var(--ring)',
                } as React.CSSProperties
              }
              placeholder='Minimum 6 characters'
            />
            {newPassword.length > 0 && newPassword.length < 6 && (
              <p className='mt-1 text-xs' style={{ color: '#ef4444' }}>
                Password must be at least 6 characters.
              </p>
            )}
          </div>

          <div className='flex justify-end'>
            <button
              type='submit'
              disabled={!canSubmit || saving}
              className='inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {saving ? (
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
