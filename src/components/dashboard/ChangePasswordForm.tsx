'use client';

import { useState, useCallback } from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { changePassword } from '@/app/(dashboards)/customer/change-password/_actions/passwordChange';
import { Button } from '@/components/ui/Button';
import { FormField, PasswordInput } from '@/components/ui/FormField';

const MIN_LENGTH = 6;

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Only surface the length error once the user has typed something.
  const newPasswordError =
    newPassword.length > 0 && newPassword.length < MIN_LENGTH
      ? `Password must be at least ${MIN_LENGTH} characters.`
      : undefined;

  const canSubmit =
    currentPassword.length > 0 && newPassword.length >= MIN_LENGTH;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;

      setSaving(true);
      setSucceeded(false);
      setFormError(null);

      try {
        const result = await changePassword({
          oldPassword: currentPassword,
          newPassword: newPassword,
        });

        if (result.success) {
          toast.success('Password changed successfully.');
          setSucceeded(true);
          setCurrentPassword('');
          setNewPassword('');
        } else {
          const message = result.error || 'Failed to change password.';
          setFormError(message);
          toast.error(message);
        }
      } catch {
        const message = 'An unexpected error occurred. Please try again.';
        setFormError(message);
        toast.error(message);
      } finally {
        setSaving(false);
      }
    },
    [canSubmit, currentPassword, newPassword],
  );

  return (
    <div className='mx-auto max-w-2xl'>
      <div className='surface-card p-6'>
        <div className='mb-5 flex items-center gap-2'>
          <Lock className='h-4 w-4 text-primary' aria-hidden='true' />
          <h2 className='text-base font-bold text-foreground'>
            Update Password
          </h2>
        </div>

        {succeeded && (
          <p
            role='status'
            className='mb-5 flex items-center gap-2 rounded-control border border-secondary/40 bg-secondary-soft px-4 py-3 text-sm font-medium text-secondary-soft-foreground'
          >
            <CheckCircle2 className='h-4 w-4 shrink-0' aria-hidden='true' />
            Your password has been updated.
          </p>
        )}

        {formError && (
          <p
            role='alert'
            className='mb-5 rounded-control border border-danger/40 bg-danger-soft px-4 py-3 text-sm font-medium text-danger-soft-foreground'
          >
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} className='space-y-4' noValidate>
          <FormField label='Current password' required>
            {(props) => (
              <PasswordInput
                {...props}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setSucceeded(false);
                }}
                autoComplete='current-password'
                placeholder='Enter your current password'
                required
              />
            )}
          </FormField>

          <FormField
            label='New password'
            error={newPasswordError}
            hint={`Minimum ${MIN_LENGTH} characters.`}
            required
          >
            {(props) => (
              <PasswordInput
                {...props}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setSucceeded(false);
                }}
                autoComplete='new-password'
                placeholder={`Minimum ${MIN_LENGTH} characters`}
                minLength={MIN_LENGTH}
                required
              />
            )}
          </FormField>

          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={!canSubmit}
              loading={saving}
              loadingText='Updating…'
              leadingIcon={<Lock className='h-4 w-4' />}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
