import { DUMMY_PROVIDER } from '@/lib/dummy-data';
import {
  DashboardShell,
  type NavItem,
} from '@/components/dashboard/DashboardShell';

const navItems: NavItem[] = [
  { href: '/provider', label: 'Overview', icon: 'LayoutDashboard' },
  { href: '/provider/gear', label: 'My Gear', icon: 'Package' },
  { href: '/provider/orders', label: 'Orders', icon: 'ClipboardList' },
  { href: '/provider/profile', label: 'Profile', icon: 'User' },
];

export default async function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = DUMMY_PROVIDER;

  return (
    <DashboardShell navItems={navItems} user={user}>
      {children}
    </DashboardShell>
  );
}
