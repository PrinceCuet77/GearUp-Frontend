'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dumbbell, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/validations/auth';
import { loginAction } from '@/app/(auth)/_actions/loginActions';
import z from 'zod';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      const result = await loginAction(null, formData);

      if (result?.success) {
        toast.success(result.message || 'Login successful!');
        router.push('/dashboard');
      } else {
        toast.error(result?.message || 'Login failed. Please try again.');
      }
    });
  };

  return (
    <>
      <div className='w-full max-w-md px-2 sm:px-0'>
        {/* Card */}
        <div
          className='rounded-2xl border shadow-xl p-6 sm:p-8'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          {/* Logo */}
          <div className='flex flex-col items-center mb-8'>
            <div
              className='flex h-12 w-12 items-center justify-center rounded-xl mb-4'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Dumbbell className='h-6 w-6 text-white' />
            </div>
            <h1
              className='text-2xl font-bold tracking-tight'
              style={{ color: 'var(--card-foreground)' }}
            >
              Welcome back
            </h1>
            <p
              className='mt-1 text-sm'
              style={{ color: 'var(--muted-foreground)' }}
            >
              Sign in to your GearUp account
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-5'
          >
            {/* Email */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='email'
                className='text-sm font-medium'
                style={{ color: 'var(--card-foreground)' }}
              >
                Email
              </label>
              <input
                id='email'
                type='email'
                autoComplete='email'
                placeholder='Enter your email'
                className='w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-sm'
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: form.formState.errors.email
                    ? 'var(--destructive)'
                    : undefined,
                }}
                {...form.register('email')}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent)';
                }}
                onBlur={(e) => {
                  if (!form.formState.errors.email) {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }
                }}
              />
              {form.formState.errors.email && (
                <p className='text-xs' style={{ color: 'var(--destructive)' }}>
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='text-sm font-medium'
                  style={{ color: 'var(--card-foreground)' }}
                >
                  Password
                </label>
              </div>
              <div className='relative'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder='Enter your password'
                  className='w-full rounded-lg border px-4 py-2.5 pr-11 text-sm outline-none transition-colors'
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: form.formState.errors.password
                      ? 'var(--destructive)'
                      : undefined,
                  }}
                  {...form.register('password')}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent)';
                  }}
                  onBlur={(e) => {
                    if (!form.formState.errors.password) {
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.style.boxShadow = '';
                    }
                  }}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className='cursor-pointer absolute right-3 top-1/2 -translate-y-1/2'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className='text-xs' style={{ color: 'var(--destructive)' }}>
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={isPending}
              className='mt-1 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {isPending ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className='my-6 flex items-center gap-3'>
            <div
              className='flex-1 h-px'
              style={{ backgroundColor: 'var(--border)' }}
            />
            <span
              className='text-xs'
              style={{ color: 'var(--muted-foreground)' }}
            >
              New to GearUp?
            </span>
            <div
              className='flex-1 h-px'
              style={{ backgroundColor: 'var(--border)' }}
            />
          </div>

          {/* Register link */}
          <p
            className='text-center text-sm'
            style={{ color: 'var(--muted-foreground)' }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href='/register'
              className='font-semibold hover:underline'
              style={{ color: 'var(--primary)' }}
            >
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
