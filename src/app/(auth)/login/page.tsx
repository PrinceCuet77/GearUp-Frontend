'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dumbbell, Loader2, ShieldCheck, Store, User } from 'lucide-react';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/validations/auth';
import {
  demoLoginAction,
  loginAction,
  type DemoRole,
} from '@/app/(auth)/_actions/loginActions';
import { Button } from '@/components/ui/Button';
import { FormField, PasswordInput } from '@/components/ui/FormField';
import z from 'zod';

const DEMO_OPTIONS: {
  role: DemoRole;
  label: string;
  icon: React.ElementType;
}[] = [
  { role: 'CUSTOMER', label: 'Demo Customer', icon: User },
  { role: 'PROVIDER', label: 'Demo Provider', icon: Store },
  { role: 'ADMIN', label: 'Demo Admin', icon: ShieldCheck },
];

/** Divider with a centred caption, used twice on this card. */
function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className='my-6 flex items-center gap-3'>
      <span className='h-px flex-1 bg-border' />
      <span className='text-xs text-muted-foreground'>{children}</span>
      <span className='h-px flex-1 bg-border' />
    </div>
  );
}

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [demoLoadingRole, setDemoLoadingRole] = useState<DemoRole | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLoginResult = (result: {
    success?: boolean;
    message?: string;
    data?: { user?: { role?: string } };
  }) => {
    if (result?.success) {
      const role = result.data?.user?.role;
      const roleLabel =
        role === 'ADMIN'
          ? 'Admin'
          : role === 'CUSTOMER'
            ? 'Customer'
            : role === 'PROVIDER'
              ? 'Provider'
              : null;

      toast.success(
        roleLabel
          ? `Logged in successfully as ${roleLabel}`
          : result.message || 'Login successful!',
      );

      if (role === 'ADMIN') {
        router.push('/admin');
      } else if (role === 'CUSTOMER') {
        router.push('/customer');
      } else if (role === 'PROVIDER') {
        router.push('/provider');
      }
    } else {
      toast.error(result?.message || 'Login failed. Please try again.');
    }
  };

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      const result = await loginAction(null, formData);
      handleLoginResult(result);
    });
  };

  const handleDemoLogin = (role: DemoRole) => {
    setDemoLoadingRole(role);
    startTransition(async () => {
      const result = await demoLoginAction(role);
      handleLoginResult(result);
      setDemoLoadingRole(null);
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
            Welcome back
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Sign in to your GearUp account
          </p>
        </div>

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

          <FormField label='Password' error={errors.password?.message} required>
            {(props) => (
              <PasswordInput
                {...props}
                {...form.register('password')}
                autoComplete='current-password'
                placeholder='Enter your password'
              />
            )}
          </FormField>

          <Button
            type='submit'
            fullWidth
            className='mt-1'
            loading={isPending && demoLoadingRole === null}
            loadingText='Signing in…'
          >
            Sign in
          </Button>
        </form>

        <Divider>Or try a demo account</Divider>

        {/* Demo login buttons */}
        <div className='grid grid-cols-3 gap-2'>
          {DEMO_OPTIONS.map(({ role, label, icon: Icon }) => (
            <button
              key={role}
              type='button'
              onClick={() => handleDemoLogin(role)}
              disabled={isPending}
              className='flex cursor-pointer flex-col items-center gap-1.5 rounded-control border border-border px-2 py-3 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:bg-muted disabled:pointer-events-none disabled:opacity-55'
            >
              {demoLoadingRole === role ? (
                <Loader2 className='h-4 w-4 animate-spin' aria-hidden='true' />
              ) : (
                <Icon className='h-4 w-4' aria-hidden='true' />
              )}
              {label}
            </button>
          ))}
        </div>

        <Divider>New to GearUp?</Divider>

        {/* Register link */}
        <p className='text-center text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <Link
            href='/register'
            className='font-semibold text-primary hover:underline'
          >
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
}
