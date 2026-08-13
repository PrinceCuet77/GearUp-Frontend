'use server';

import { getCustomerDashboardInfo } from './getCustomerDashboardInfo';
import { getAllRentalOrders } from '../rental-orders/_actions/getAllRentalOrders';
import { getAllPayments } from '../payments/_actions/getAllPayments';
import type { Payment, RentalOrder } from '@/lib/types';

/**
 * How many records the charts read. Headline counts still come from the API's
 * own totals - only the trend/breakdown charts work off this sample.
 */
const CHART_SAMPLE = 100;

export interface CustomerOverview {
  stats: {
    totalOrders: number;
    activeRentals: number;
    paymentsMade: number;
    reviewsGiven: number;
  };
  orders: RentalOrder[];
  payments: Payment[];
  /** True when there is more history than the charts sampled. */
  sampled: boolean;
  errors: string[];
}

/**
 * Everything the customer overview renders, in one round of parallel requests.
 *
 * Partial failures degrade rather than blank the page: whichever calls succeed
 * still render, and the rest surface as messages the page can show.
 */
export const getCustomerOverview = async (): Promise<CustomerOverview> => {
  const [dashboard, orders, payments] = await Promise.all([
    getCustomerDashboardInfo(),
    getAllRentalOrders({ page: 1, limit: CHART_SAMPLE }),
    getAllPayments({ page: 1, limit: CHART_SAMPLE }),
  ]);

  const errors = [dashboard.error, orders.error, payments.error].filter(
    (message): message is string => Boolean(message),
  );

  return {
    stats: dashboard.data?.stats ?? {
      totalOrders: orders.meta?.total ?? orders.data.length,
      activeRentals: 0,
      paymentsMade: payments.meta?.total ?? payments.data.length,
      reviewsGiven: 0,
    },
    orders: orders.data,
    payments: payments.data,
    sampled: (orders.meta?.total ?? 0) > orders.data.length,
    errors,
  };
};
