import { redirect } from 'next/navigation';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';
import {
  DashboardShell,
  type NavItem,
} from '@/components/dashboard/DashboardShell';

const navItems: NavItem[] = [
  {
    href: '/customer',
    label: 'Overview',
    icon: 'LayoutDashboard',
    group: 'Dashboard',
    exact: true,
  },
  {
    href: '/customer/rental-orders',
    label: 'My Rentals',
    icon: 'ShoppingBag',
    group: 'Renting',
  },
  {
    href: '/customer/payments',
    label: 'Payments',
    icon: 'CreditCard',
    group: 'Renting',
  },
  {
    href: '/customer/reviews',
    label: 'My Reviews',
    icon: 'Star',
    group: 'Renting',
  },
  {
    href: '/customer/profile',
    label: 'Profile',
    icon: 'User',
    group: 'Account',
  },
  {
    href: '/customer/settings',
    label: 'Settings',
    icon: 'Settings',
    group: 'Account',
  },
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

  return (
    <DashboardShell
      navItems={navItems}
      basePath='/customer'
      roleLabel='Customer'
    >
      {children}
    </DashboardShell>
  );
}
