'use server';

import { cookies } from 'next/headers';

async function performLogin(email: string, password: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const result = await response.json();

    if (result.success) {
      const cookie = await cookies();
      cookie.set('accessToken', result.data.accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'lax',
      });

      cookie.set('refreshToken', result.data.refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
      });
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
    };
  }
}

export const loginAction = async (_prevState: unknown, formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  return performLogin(email, password);
};

export type DemoRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

const DEMO_CREDENTIALS: Record<
  DemoRole,
  { email?: string; password?: string }
> = {
  CUSTOMER: {
    email: process.env.DEMO_CUSTOMER_EMAIL,
    password: process.env.DEMO_CUSTOMER_PASSWORD,
  },
  PROVIDER: {
    email: process.env.DEMO_PROVIDER_EMAIL,
    password: process.env.DEMO_PROVIDER_PASSWORD,
  },
  ADMIN: {
    email: process.env.DEMO_ADMIN_EMAIL,
    password: process.env.DEMO_ADMIN_PASSWORD,
  },
};

export const demoLoginAction = async (role: DemoRole) => {
  const credentials = DEMO_CREDENTIALS[role];

  if (!credentials.email || !credentials.password) {
    return {
      success: false,
      message: 'Demo credentials are not configured.',
    };
  }

  return performLogin(credentials.email, credentials.password);
};
