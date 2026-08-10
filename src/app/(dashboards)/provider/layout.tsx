import { redirect } from 'next/navigation';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';
import {
  DashboardShell,
  type NavItem,
} from '@/components/dashboard/DashboardShell';

const navItems: NavItem[] = [
  {
    href: '/provider',
    label: 'Overview',
    icon: 'LayoutDashboard',
    group: 'Dashboard',
    exact: true,
  },
  {
    href: '/provider/analytics',
    label: 'Analytics',
    icon: 'ChartColumn',
    group: 'Dashboard',
  },
  {
    href: '/provider/gears',
    label: 'My Gear',
    icon: 'Package',
    group: 'Business',
  },
  {
    href: '/provider/rental-orders',
    label: 'Rental Orders',
    icon: 'ClipboardList',
    group: 'Business',
  },
  {
    href: '/provider/profile',
    label: 'Profile',
    icon: 'User',
    group: 'Account',
  },
  {
    href: '/provider/settings',
    label: 'Settings',
    icon: 'Settings',
    group: 'Account',
  },
];

export default async function ProviderDashboardLayout({
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
      basePath='/provider'
      roleLabel='Provider'
    >
      {children}
    </DashboardShell>
  );
}
