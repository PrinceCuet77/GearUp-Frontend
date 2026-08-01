'use client';

import { useActionState, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Dumbbell,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Store,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
// import { register } from '@/app/actions/auth';

type Role = 'CUSTOMER' | 'PROVIDER';

const roles: {
  value: Role;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'CUSTOMER',
    label: 'Customer',
    description: 'Browse & rent gear',
    icon: <ShoppingBag className='h-5 w-5' />,
  },
  {
    value: 'PROVIDER',
    label: 'Provider',
    description: 'List & manage gear',
    icon: <Store className='h-5 w-5' />,
  },
];

export default function RegisterPage() {
  // const [state, action, pending] = useActionState(register, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('CUSTOMER');

  // useEffect(() => {
  //   if (state?.message) {
  //     toast.error(state.message);
  //   }
  // }, [state?.message]);

  return (
    <div className='w-full max-w-md'>
      {/* Card */}
      <div
        className='rounded-2xl border shadow-xl p-8'
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
            Create your account
          </h1>
          <p
            className='mt-1 text-sm'
            style={{ color: 'var(--muted-foreground)' }}
          >
            Join GearUp and start renting gear today
          </p>
        </div>

        {/* Error banner */}
        {/* {state?.message && (
          <div
            className='flex items-center gap-2 rounded-lg px-4 py-3 mb-5 text-sm'
            style={{
              backgroundColor: 'color-mix(in srgb, #ef4444 12%, transparent)',
              color: '#dc2626',
              border: '1px solid color-mix(in srgb, #ef4444 25%, transparent)',
            }}
          >
            <AlertCircle className='h-4 w-4 shrink-0' />
            {state.message}
          </div>
        )} */}

        {/* Form */}
        <form className='flex flex-col gap-5'>
          {/* Hidden role field */}
          <input type='hidden' name='role' value={selectedRole} />

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
              name='email'
              type='email'
              autoComplete='email'
              placeholder='Enter your email'
              className='w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors'
              style={{
                backgroundColor: 'var(--input-bg)',
                // borderColor: state?.errors?.email
                //   ? '#ef4444'
                //   : 'var(--input-border)',
                // color: 'var(--card-foreground)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow =
                  '0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent)';
              }}
              onBlur={(e) => {
                // e.currentTarget.style.borderColor = state?.errors?.email
                //   ? '#ef4444'
                //   : 'var(--input-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {/* {state?.errors?.email && (
              <p className='text-xs' style={{ color: '#ef4444' }}>
                {state.errors.email[0]}
              </p>
            )} */}
          </div>

          {/* Password */}
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='password'
              className='text-sm font-medium'
              style={{ color: 'var(--card-foreground)' }}
            >
              Password
            </label>
            <div className='relative'>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='new-password'
                placeholder='Min. 6 characters'
                className='w-full rounded-lg border px-4 py-2.5 pr-11 text-sm outline-none transition-colors'
                style={{
                  backgroundColor: 'var(--input-bg)',
                  // borderColor: state?.errors?.password
                  //   ? '#ef4444'
                  //   : 'var(--input-border)',
                  color: 'var(--card-foreground)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent)';
                }}
                onBlur={(e) => {
                  // e.currentTarget.style.borderColor = state?.errors?.password
                  //   ? '#ef4444'
                  //   : 'var(--input-border)';
                  e.currentTarget.style.boxShadow = 'none';
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
            {/* {state?.errors?.password && (
              <p className='text-xs' style={{ color: '#ef4444' }}>
                {state.errors.password[0]}
              </p>
            )} */}
          </div>

          {/* Role Selection */}
          <div className='flex flex-col gap-2'>
            <span
              className='text-sm font-medium'
              style={{ color: 'var(--card-foreground)' }}
            >
              I want to…
            </span>
            <div className='grid grid-cols-2 gap-3'>
              {roles.map((role) => {
                const isSelected = selectedRole === role.value;
                return (
                  <button
                    key={role.value}
                    type='button'
                    onClick={() => setSelectedRole(role.value)}
                    className='relative flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 text-center transition-all cursor-pointer'
                    style={{
                      borderColor: isSelected
                        ? 'var(--primary)'
                        : 'var(--border)',
                      backgroundColor: isSelected
                        ? 'color-mix(in srgb, var(--primary) 8%, transparent)'
                        : 'var(--muted)',
                      color: isSelected
                        ? 'var(--primary)'
                        : 'var(--card-foreground)',
                    }}
                  >
                    {/* Check badge */}
                    {isSelected && (
                      <span
                        className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full'
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        <Check className='h-3 w-3 text-white' />
                      </span>
                    )}
                    <span
                      style={{
                        color: isSelected
                          ? 'var(--primary)'
                          : 'var(--muted-foreground)',
                      }}
                    >
                      {role.icon}
                    </span>
                    <div>
                      <div className='text-sm font-semibold'>{role.label}</div>
                      <div
                        className='text-xs mt-0.5'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {role.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {/* {state?.errors?.role && (
              <p className='text-xs' style={{ color: '#ef4444' }}>
                {state.errors.role[0]}
              </p>
            )} */}
          </div>

          {/* Submit */}
          <button
            type='submit'
            // disabled={pending}
            className='mt-1 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-70'
            style={{ backgroundColor: 'var(--primary)' }}
            // onMouseEnter={(e) => {
            //   if (!pending)
            //     (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            //       'var(--primary-hover)';
            // }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                'var(--primary)';
            }}
          >
            {/* {pending ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Creating account…
              </>
            ) : (
              'Create Account'
            )} */}
            Create Account
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
            Already a member?
          </span>
          <div
            className='flex-1 h-px'
            style={{ backgroundColor: 'var(--border)' }}
          />
        </div>

        {/* Login link */}
        <p
          className='text-center text-sm'
          style={{ color: 'var(--muted-foreground)' }}
        >
          Already have an account?{' '}
          <Link
            href='/login'
            className='font-semibold hover:underline'
            style={{ color: 'var(--primary)' }}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
