'use server';

import { cookies } from 'next/headers';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetAllUsersParams {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminUsersResult {
  success: boolean;
  data: AdminUser[] | null;
  meta: AdminUserMeta | null;
  error: string | null;
}

const statusMessages: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to view users.',
  404: 'Users not found. Please try again later.',
};

export const getAllUsers = async (
  params: GetAllUsersParams = {},
): Promise<AdminUsersResult> => {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return {
        success: false,
        data: null,
        meta: null,
        error: 'You are not logged in. Please log in to view users.',
      };
    }

    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.role) searchParams.set('role', params.role);
    if (params.status) searchParams.set('status', params.status);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const url = `${process.env.BACKEND_API_URL}/api/admin/users${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        meta: null,
        error:
          statusMessages[response.status] ??
          `Something went wrong (error ${response.status}). Please try again later.`,
      };
    }

    const result = await response.json();

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data as AdminUser[],
        meta: result.meta as AdminUserMeta,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      meta: null,
      error: result.message ?? 'Failed to load users.',
    };
  } catch {
    return {
      success: false,
      data: null,
      meta: null,
      error:
        'Unable to connect to the server. Please check your connection and try again.',
    };
  }
};
