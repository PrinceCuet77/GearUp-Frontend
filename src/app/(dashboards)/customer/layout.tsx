import { redirect } from 'next/navigation';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';
import {
  DashboardShell,
  type NavItem,
} from '@/components/dashboard/DashboardShell';

const navItems: NavItem[] = [
  { href: '/customer', label: 'Overview', icon: 'LayoutDashboard' },
  {
    href: '/customer/orders',
    label: 'My Orders',
    icon: 'ShoppingBag',
  },
  {
    href: '/customer/payments',
    label: 'Payments',
    icon: 'CreditCard',
  },
  { href: '/customer/reviews', label: 'My Reviews', icon: 'Star' },
  { href: '/customer/profile', label: 'Profile', icon: 'User' },
];

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getProfileAction();
  if (!user) redirect('/login');

  return <DashboardShell navItems={navItems}>{children}</DashboardShell>;
}
