'use server';

import { getProviderDashboardInfo } from './getProviderDashboardInfo';
import { getAllRentalOrdersForProvider } from '../rental-orders/_actions/getAllRentalOrdersForProvider';
import { getSelfListedAllGearsByProvider } from '../gears/_actions/getSelfListedAllGearsByProvider';
import type { GearItem, RentalOrder } from '@/lib/types';

const CHART_SAMPLE = 100;

export interface ProviderOverview {
  stats: {
    totalGearListed: number;
    totalOrders: number;
    needsConfirmation: number;
    readyForPickup: number;
  };
  orders: RentalOrder[];
  gears: GearItem[];
  /** True when there are more orders than the charts sampled. */
  sampled: boolean;
  errors: string[];
}

/**
 * Provider dashboard data: headline stats plus the order and inventory records
 * the charts and tables are derived from.
 */
export const getProviderOverview = async (): Promise<ProviderOverview> => {
  const [dashboard, orders, gears] = await Promise.all([
    getProviderDashboardInfo(),
    getAllRentalOrdersForProvider({ page: 1, limit: CHART_SAMPLE }),
    getSelfListedAllGearsByProvider({ page: 1, limit: CHART_SAMPLE }),
  ]);

  const errors = [dashboard.error, orders.error, gears.error].filter(
    (message): message is string => Boolean(message),
  );

  return {
    stats: dashboard.data?.stats ?? {
      totalGearListed: gears.meta?.total ?? gears.data.length,
      totalOrders: orders.meta?.total ?? orders.data.length,
      needsConfirmation: 0,
      readyForPickup: 0,
    },
    orders: orders.data,
    gears: gears.data,
    sampled: (orders.meta?.total ?? 0) > orders.data.length,
    errors,
  };
};
