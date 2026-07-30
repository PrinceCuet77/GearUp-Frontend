import { DUMMY_ADMIN } from '@/lib/dummy-data';
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
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ── DEMO MODE: real auth commented out ──────────────────────────────────
  // const user = await getCurrentUser();
  // if (!user) redirect('/login');
  const user = DUMMY_ADMIN;
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <DashboardShell navItems={navItems} user={user}>
      {children}
    </DashboardShell>
  );
}
