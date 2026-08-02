import { redirect } from 'next/navigation';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';
import {
  DashboardShell,
  type NavItem,
} from '@/components/dashboard/DashboardShell';

const navItems: NavItem[] = [
  { href: '/provider', label: 'Overview', icon: 'LayoutDashboard' },
  { href: '/provider/gear', label: 'My Gear', icon: 'Package' },
  { href: '/provider/orders', label: 'Orders', icon: 'ClipboardList' },
  { href: '/provider/profile', label: 'Profile', icon: 'User' },
  { href: '/provider/change-password', label: 'Change Password', icon: 'Lock' },
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

  return <DashboardShell navItems={navItems}>{children}</DashboardShell>;
}
