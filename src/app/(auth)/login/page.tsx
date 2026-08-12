'use client';

import { Suspense, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Dumbbell,
  Loader2,
  ShieldCheck,
  Store,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/validations/auth';
import {
  demoLoginAction,
  loginAction,
  type DemoRole,
} from '@/app/(auth)/_actions/loginActions';
import { Button } from '@/components/ui/Button';
import { FormField, PasswordInput } from '@/components/ui/FormField';
import { GoogleButton } from '@/components/auth/GoogleButton';
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

/** Exact message the backend returns for a Google-linked account (§3.2/§6.3). */
const GOOGLE_ONLY_MESSAGE =
  'This account was created with Google. Please continue with Google.';

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

type LoginResult = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: { user?: { role?: string } };
};

function LoginPageInner() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [demoLoadingRole, setDemoLoadingRole] = useState<DemoRole | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(() => {
    const urlError = searchParams.get('error');
    return urlError ? decodeURIComponent(urlError) : null;
  });
  const [suspended, setSuspended] = useState(false);
  const [googleOnly, setGoogleOnly] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLoginResult = (result: LoginResult) => {
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
      return;
    }

    const message = result?.message || 'Login failed. Please try again.';
    const statusCode = result?.statusCode;

    setBannerError(null);
    setSuspended(false);
    setGoogleOnly(false);

    if (statusCode === 404) {
      form.setError('email', { message });
    } else if (statusCode === 401 && message === GOOGLE_ONLY_MESSAGE) {
      setGoogleOnly(true);
    } else if (statusCode === 401) {
      form.setError('password', { message });
    } else if (statusCode === 403) {
      setSuspended(true);
      setBannerError(message);
    } else {
      setBannerError(message);
    }

    toast.error(message);
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

        {bannerError && (
          <div
            role='alert'
            className='mb-5 flex items-center gap-2 rounded-control border border-danger/40 bg-danger-soft px-4 py-3 text-sm font-medium text-danger-soft-foreground'
          >
            <AlertCircle className='h-4 w-4 shrink-0' aria-hidden='true' />
            {bannerError}
          </div>
        )}

        {googleOnly ? (
          <div className='flex flex-col items-center gap-4 rounded-control border border-border bg-muted px-4 py-6 text-center'>
            <p className='text-sm text-muted-foreground'>
              This account was created with Google. Continue with Google to
              sign in.
            </p>
            <div className='flex w-full flex-col gap-2'>
              <GoogleButton role='CUSTOMER' />
              <GoogleButton role='PROVIDER' />
            </div>
            <button
              type='button'
              onClick={() => setGoogleOnly(false)}
              className='text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline'
            >
              Use a different account
            </button>
          </div>
        ) : (
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
                  disabled={suspended}
                />
              )}
            </FormField>

            <FormField
              label='Password'
              error={errors.password?.message}
              required
            >
              {(props) => (
                <PasswordInput
                  {...props}
                  {...form.register('password')}
                  autoComplete='current-password'
                  placeholder='Enter your password'
                  disabled={suspended}
                />
              )}
            </FormField>

            <Button
              type='submit'
              fullWidth
              className='mt-1'
              loading={isPending && demoLoadingRole === null}
              loadingText='Signing in…'
              disabled={suspended}
            >
              Sign in
            </Button>

            <div className='flex flex-col gap-2'>
              <GoogleButton role='CUSTOMER' />
              <GoogleButton role='PROVIDER' />
            </div>
          </form>
        )}

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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
