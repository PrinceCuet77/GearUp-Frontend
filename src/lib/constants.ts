import {
  ClipboardList,
  CreditCard,
  Package,
  ShoppingBag,
  Star,
  Tag,
  Users,
} from 'lucide-react';

export type AvailableRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

/**
 * Public navigation lives in `@/lib/site` alongside the rest of the marketing
 * content. Re-exported here so existing imports keep working.
 */
export { PUBLIC_LINKS } from './site';

export const ROLE_LINKS: Record<
  AvailableRole,
  Array<{ href: string; label: string; icon: React.ElementType }>
> = {
  CUSTOMER: [
    {
      href: '/customer/rental-orders',
      label: 'Rental Orders',
      icon: ShoppingBag,
    },
    { href: '/customer/payments', label: 'Payments', icon: CreditCard },
    { href: '/customer/reviews', label: 'My Reviews', icon: Star },
  ],
  PROVIDER: [
    { href: '/provider/gears', label: 'My Gears', icon: Package },
    {
      href: '/provider/rental-orders',
      label: 'Rental Orders',
      icon: ClipboardList,
    },
  ],
  ADMIN: [
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/gears', label: 'All Gears', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: Tag },
  ],
};

export const ROLE_COLORS: Record<AvailableRole, { bg: string; color: string }> =
  {
    CUSTOMER: { bg: 'rgba(59,130,246,0.12)', color: '#2563eb' },
    PROVIDER: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
    ADMIN: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
  };
