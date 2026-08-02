import { redirect } from 'next/navigation';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';
import {
  DashboardShell,
  type NavItem,
} from '@/components/dashboard/DashboardShell';

const navItems: NavItem[] = [
  { href: '/admin', label: 'Overview', icon: 'LayoutDashboard' },
  { href: '/admin/users', label: 'Users', icon: 'Users' },
  { href: '/admin/gears', label: 'All Gears', icon: 'Package' },
  { href: '/admin/categories', label: 'Categories', icon: 'Tag' },
  { href: '/admin/rentals', label: 'Rentals', icon: 'ClipboardList' },
  { href: '/admin/profile', label: 'Profile', icon: 'User' },
  { href: '/admin/change-password', label: 'Change Password', icon: 'Lock' },
];

export default async function AdminDashboardLayout({
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
