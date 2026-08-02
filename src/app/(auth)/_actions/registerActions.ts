'use server';

import { registerSchema } from '@/lib/validations/auth';

export const registerAction = async (
  _prevState: unknown,
  formData: FormData,
) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = (formData.get('role') as string) || 'CUSTOMER';

  const parsed = registerSchema.safeParse({ email, password, role });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }

  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
      },
    );

    const result = await response.json();

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
};
