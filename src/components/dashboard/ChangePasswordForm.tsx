'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { changePassword } from '@/app/(dashboards)/customer/settings/_actions/passwordChange';
import { Button } from '@/components/ui/Button';
import { FormField, PasswordInput } from '@/components/ui/FormField';
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '@/lib/validations/auth';

/**
 * Password change form. Renders bare (no card chrome) so the settings page
 * owns the surface it sits on.
 */
export function ChangePasswordForm() {
  const [succeeded, setSucceeded] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values: ChangePasswordValues) => {
    setFormError(null);
    setSucceeded(false);

    try {
      const result = await changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (result.success) {
        toast.success('Password changed successfully.');
        setSucceeded(true);
        reset();
        return;
      }

      const message = result.error || 'Failed to change password.';
      setFormError(message);
      toast.error(message);
    } catch {
      const message = 'An unexpected error occurred. Please try again.';
      setFormError(message);
      toast.error(message);
    }
  };

  return (
    <>
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
          className='mb-5 flex items-center gap-2 rounded-control border border-danger/40 bg-danger-soft px-4 py-3 text-sm font-medium text-danger-soft-foreground'
        >
          <AlertCircle className='h-4 w-4 shrink-0' aria-hidden='true' />
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4' noValidate>
        <FormField
          label='Current password'
          required
          error={errors.currentPassword?.message}
        >
          {(props) => (
            <PasswordInput
              {...props}
              {...register('currentPassword', {
                onChange: () => setSucceeded(false),
              })}
              autoComplete='current-password'
              placeholder='Enter your current password'
            />
          )}
        </FormField>

        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            label='New password'
            required
            error={errors.newPassword?.message}
            hint='6–20 characters.'
          >
            {(props) => (
              <PasswordInput
                {...props}
                {...register('newPassword', {
                  onChange: () => setSucceeded(false),
                })}
                autoComplete='new-password'
                placeholder='Choose a new password'
              />
            )}
          </FormField>

          <FormField
            label='Confirm new password'
            required
            error={errors.confirmPassword?.message}
          >
            {(props) => (
              <PasswordInput
                {...props}
                {...register('confirmPassword', {
                  onChange: () => setSucceeded(false),
                })}
                autoComplete='new-password'
                placeholder='Re-enter the new password'
              />
            )}
          </FormField>
        </div>

        <div className='flex justify-end pt-1'>
          <Button
            type='submit'
            loading={isSubmitting}
            loadingText='Updating…'
            leadingIcon={<Lock className='h-4 w-4' aria-hidden='true' />}
          >
            Update password
          </Button>
        </div>
      </form>
    </>
  );
}
