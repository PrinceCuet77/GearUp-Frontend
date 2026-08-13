import { redirect } from 'next/navigation';
import { getProfileAction } from '@/app/(auth)/_actions/getProfileActions';
import {
  DashboardShell,
  type NavItem,
} from '@/components/dashboard/DashboardShell';

const navItems: NavItem[] = [
  {
    href: '/admin',
    label: 'Overview',
    icon: 'LayoutDashboard',
    group: 'Dashboard',
    exact: true,
  },
  {
    href: '/admin/users',
    label: 'Manage Users',
    icon: 'Users',
    group: 'Management',
  },
  {
    href: '/admin/gears',
    label: 'Manage Gear',
    icon: 'Package',
    group: 'Management',
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: 'Tag',
    group: 'Management',
  },
  {
    href: '/admin/profile',
    label: 'Profile',
    icon: 'User',
    group: 'Account',
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: 'Settings',
    group: 'Account',
  },
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

  return (
    <DashboardShell navItems={navItems} basePath='/admin' roleLabel='Admin'>
      {children}
    </DashboardShell>
  );
}
