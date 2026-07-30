'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  loginSchema,
  registerSchema,
  type LoginFormState,
  type RegisterFormState,
} from '@/lib/validations/auth';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://gear-up-self.vercel.app';

function setAuthCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  accessToken: string,
  refreshToken: string,
) {
  const isProduction = process.env.NODE_ENV === 'production';
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

function getRoleDashboard(role: string): string {
  switch (role) {
    case 'PROVIDER':
      return '/dashboard/provider';
    case 'ADMIN':
      return '/dashboard/admin';
    default:
      return '/dashboard/customer';
  }
}

export async function login(
  state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validated = loginSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // ── DEMO MODE: API call commented out ─────────────────────────────────────
  // Real auth — uncomment when integrating the backend.
  //
  // let responseData: { success: boolean; message: string; data?: { accessToken?: string; refreshToken?: string; user?: { role: string } } };
  // try {
  //   const res = await fetch(`${API_URL}/api/auth/login`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(validated.data),
  //     cache: 'no-store',
  //   });
  //   responseData = await res.json();
  //   if (!res.ok) {
  //     return { message: responseData.message || 'Invalid email or password.' };
  //   }
  // } catch {
  //   return { message: 'Could not connect to server. Please try again.' };
  // }
  // const { accessToken, refreshToken, user } = responseData.data ?? {};
  // if (accessToken && refreshToken) {
  //   const cookieStore = await cookies();
  //   setAuthCookies(cookieStore, accessToken, refreshToken);
  // }
  // redirect(getRoleDashboard(user?.role ?? 'CUSTOMER'));
  // ─────────────────────────────────────────────────────────────────────────

  // Demo: simulate successful login → redirect to customer dashboard
  redirect('/dashboard/customer');
}

export async function register(
  state: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    role: formData.get('role') as string,
  };

  const validated = registerSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // ── DEMO MODE: API call commented out ─────────────────────────────────────
  // Real registration — uncomment when integrating the backend.
  //
  // const payload = { name: validated.data.name, email: validated.data.email, password: validated.data.password, role: validated.data.role };
  // let responseData: { success: boolean; message: string; data?: { accessToken?: string; refreshToken?: string; user?: { role: string } } };
  // try {
  //   const res = await fetch(`${API_URL}/api/auth/register`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload),
  //     cache: 'no-store',
  //   });
  //   responseData = await res.json();
  //   if (!res.ok) {
  //     return { message: responseData.message || 'Registration failed. Please try again.' };
  //   }
  // } catch {
  //   return { message: 'Could not connect to server. Please try again.' };
  // }
  // const { accessToken, refreshToken, user } = responseData.data ?? {};
  // if (accessToken && refreshToken) {
  //   const cookieStore = await cookies();
  //   setAuthCookies(cookieStore, accessToken, refreshToken);
  //   redirect(getRoleDashboard(user?.role ?? validated.data.role));
  // }
  // ─────────────────────────────────────────────────────────────────────────

  // Demo: simulate successful registration → redirect to login
  redirect('/login?registered=true');
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();

  // Call backend logout (best-effort)
  const token = cookieStore.get('accessToken')?.value;
  if (token) {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
    } catch {
      // Ignore — always clear local cookies
    }
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  redirect('/login');
}
