'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Check,
  Dumbbell,
  ShoppingBag,
  Store,
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { registerSchema } from '@/lib/validations/auth';
import { registerAction } from '@/app/(auth)/_actions/registerActions';
import { loginAction } from '@/app/(auth)/_actions/loginActions';
import { Button } from '@/components/ui/Button';
import { FormField, PasswordInput } from '@/components/ui/FormField';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { cn } from '@/lib/cn';

type Role = 'CUSTOMER' | 'PROVIDER';

const ROLES: {
  value: Role;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'CUSTOMER',
    label: 'Customer',
    description: 'Browse & rent gear',
    icon: <ShoppingBag className='h-5 w-5' aria-hidden='true' />,
  },
  {
    value: 'PROVIDER',
    label: 'Provider',
    description: 'List & manage gear',
    icon: <Store className='h-5 w-5' aria-hidden='true' />,
  },
];

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<Role>('CUSTOMER');
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', role: 'CUSTOMER' },
  });

  const onSubmit = (values: RegisterValues) => {
    setServerError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('role', selectedRole);

      const result = await registerAction(undefined, formData);

      if (!result?.success) {
        const message =
          result?.message || 'Could not create your account. Please try again.';
        setServerError(message);
        toast.error(message);
        return;
      }

      // Register doesn't log the user in — sign them in immediately with the
      // same credentials rather than bouncing them to the login form.
      const loginFormData = new FormData();
      loginFormData.append('email', values.email);
      loginFormData.append('password', values.password);
      const loginResult = await loginAction(null, loginFormData);

      if (!loginResult?.success) {
        toast.success('Account created! Please sign in to continue.');
        router.push('/login');
        return;
      }

      const role = loginResult.data?.user?.role;
      toast.success('Account created successfully!');

      if (role === 'PROVIDER') {
        router.push('/provider');
      } else {
        router.push('/customer');
      }
    });
  };

  const { errors } = form.formState;

  return (
    <div className='w-full max-w-md px-2 sm:px-0'>
      <div className='surface-card p-6 shadow-lg sm:p-8'>
        {/* Logo */}
        <div className='mb-8 flex flex-col items-center text-center'>
          <span className='mb-4 flex h-12 w-12 items-center justify-center rounded-control bg-primary'>
            <Dumbbell
              className='h-6 w-6 text-primary-foreground'
              aria-hidden='true'
            />
          </span>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Create your account
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Join GearUp and start renting gear today
          </p>
        </div>

        {/* Server error */}
        {serverError && (
          <div
            role='alert'
            className='mb-5 flex items-center gap-2 rounded-control border border-danger/40 bg-danger-soft px-4 py-3 text-sm font-medium text-danger-soft-foreground'
          >
            <AlertCircle className='h-4 w-4 shrink-0' aria-hidden='true' />
            {serverError}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5'
          noValidate
        >
          <FormField label='Email' error={errors.email?.message} required>
            {(props) => (
              <input
                {...props}
                {...form.register('email')}
                type='email'
                autoComplete='email'
                placeholder='Enter your email'
              />
            )}
          </FormField>

          <FormField
            label='Password'
            error={errors.password?.message}
            hint='Between 6 and 20 characters.'
            required
          >
            {(props) => (
              <PasswordInput
                {...props}
                {...form.register('password')}
                autoComplete='new-password'
                placeholder='Min. 6 characters'
              />
            )}
          </FormField>

          {/* Role selection */}
          <fieldset className='flex flex-col gap-2'>
            <legend className='field-label'>I want to…</legend>
            <div className='grid grid-cols-2 gap-3'>
              {ROLES.map((role) => {
                const isSelected = selectedRole === role.value;
                return (
                  <button
                    key={role.value}
                    type='button'
                    onClick={() => setSelectedRole(role.value)}
                    aria-pressed={isSelected}
                    className={cn(
                      'relative flex cursor-pointer flex-col items-center gap-2 rounded-control border-2 px-4 py-4 text-center transition-all',
                      isSelected
                        ? 'border-primary bg-primary-soft text-primary-soft-foreground'
                        : 'border-border bg-muted text-foreground hover:border-border-strong',
                    )}
                  >
                    {isSelected && (
                      <span className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary'>
                        <Check
                          className='h-3 w-3 text-primary-foreground'
                          aria-hidden='true'
                        />
                      </span>
                    )}
                    <span
                      className={
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      }
                    >
                      {role.icon}
                    </span>
                    <span>
                      <span className='block text-sm font-semibold'>
                        {role.label}
                      </span>
                      <span className='mt-0.5 block text-xs text-muted-foreground'>
                        {role.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Button
            type='submit'
            fullWidth
            className='mt-1'
            loading={isPending}
            loadingText='Creating account…'
          >
            Create Account
          </Button>
        </form>

        {/* Divider */}
        <div className='my-6 flex items-center gap-3'>
          <span className='h-px flex-1 bg-border' />
          <span className='text-xs text-muted-foreground'>Or</span>
          <span className='h-px flex-1 bg-border' />
        </div>

        <GoogleButton role={selectedRole} />

        {/* Divider */}
        <div className='my-6 flex items-center gap-3'>
          <span className='h-px flex-1 bg-border' />
          <span className='text-xs text-muted-foreground'>
            Already a member?
          </span>
          <span className='h-px flex-1 bg-border' />
        </div>

        <p className='text-center text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='font-semibold text-primary hover:underline'
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
