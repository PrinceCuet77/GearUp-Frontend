'use server';

import { getAdminDashboardInfo } from './getAdminDashboardInfo';
import { getAllUsers, type AdminUser } from '../users/_actions/getAllUsers';
import { getAllGearsForAdmin } from '../gears/_actions/getAllGearsForAdmin';
import { getAllCategoriesAction } from '@/app/(public)/_actions/getAllCategories';
import type { Category, GearItem } from '@/lib/types';

const CHART_SAMPLE = 100;

export interface AdminOverview {
  stats: {
    totalUsers: number;
    activeGears: number;
    totalRentals: number;
    totalCategories: number;
  };
  users: AdminUser[];
  gears: GearItem[];
  categories: Category[];
  /** True when there are more users than the charts sampled. */
  sampled: boolean;
  errors: string[];
}

/**
 * Platform-wide data for the admin dashboards. The counters come from the
 * backend's own aggregate endpoint; the charts are derived from the most
 * recent records so they reflect real activity rather than a fixed series.
 */
export const getAdminOverview = async (): Promise<AdminOverview> => {
  const [dashboard, users, gears, categories] = await Promise.all([
    getAdminDashboardInfo(),
    getAllUsers({
      page: 1,
      limit: CHART_SAMPLE,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
    getAllGearsForAdmin({ page: 1, limit: CHART_SAMPLE }),
    getAllCategoriesAction(),
  ]);

  const errors = [
    dashboard.error,
    users.error,
    gears.error,
    categories.error,
  ].filter((message): message is string => Boolean(message));

  const userRows = users.data ?? [];
  const gearRows = gears.data ?? [];
  const categoryRows = categories.data ?? [];

  return {
    stats: dashboard.data?.stats ?? {
      totalUsers: users.meta?.total ?? userRows.length,
      activeGears: gears.meta?.total ?? gearRows.length,
      totalRentals: 0,
      totalCategories: categoryRows.length,
    },
    users: userRows,
    gears: gearRows,
    categories: categoryRows,
    sampled: (users.meta?.total ?? 0) > userRows.length,
    errors,
  };
};
