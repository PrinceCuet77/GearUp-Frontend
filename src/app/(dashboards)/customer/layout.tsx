import { DUMMY_CUSTOMER } from '@/lib/dummy-data';
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
  // ── DEMO MODE: real auth commented out ──────────────────────────────────
  // const user = await getCurrentUser();
  // if (!user) redirect('/login');
  const user = DUMMY_CUSTOMER;
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <DashboardShell navItems={navItems} user={user}>
      {children}
    </DashboardShell>
  );
}
