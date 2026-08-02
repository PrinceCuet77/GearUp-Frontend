import { redirect } from 'next/navigation';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';
import {
  DashboardShell,
  type NavItem,
} from '@/components/dashboard/DashboardShell';

const navItems: NavItem[] = [
  { href: '/customer', label: 'Overview', icon: 'LayoutDashboard' },
  {
    href: '/customer/rental-orders',
    label: 'My Rental Orders',
    icon: 'ShoppingBag',
  },
  {
    href: '/customer/payments',
    label: 'Payments',
    icon: 'CreditCard',
  },
  { href: '/customer/reviews', label: 'My Reviews', icon: 'Star' },
  { href: '/customer/profile', label: 'Profile', icon: 'User' },
  { href: '/customer/change-password', label: 'Change Password', icon: 'Lock' },
];

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const result = await getProfileAction();
    if (!result.success || !result.data) redirect('/login');
  } catch {
    redirect('/login');
  }

  return <DashboardShell navItems={navItems}>{children}</DashboardShell>;
}
