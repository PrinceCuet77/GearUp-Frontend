import {
  ClipboardList,
  CreditCard,
  Package,
  ShoppingBag,
  Tag,
  Users,
} from 'lucide-react';

export type AvailableRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export const PUBLIC_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/gears', label: 'Browse Gear' },
];

export const ROLE_LINKS: Record<
  AvailableRole,
  Array<{ href: string; label: string; icon: React.ElementType }>
> = {
  CUSTOMER: [
    { href: '/rentals', label: 'Rentals', icon: ShoppingBag },
    { href: '/payments', label: 'Payments', icon: CreditCard },
  ],
  PROVIDER: [
    { href: '/provider/gears', label: 'My Gear', icon: Package },
    { href: '/orders', label: 'Orders', icon: ClipboardList },
  ],
  ADMIN: [
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/categories', label: 'Categories', icon: Tag },
  ],
};

export const ROLE_COLORS: Record<AvailableRole, { bg: string; color: string }> =
  {
    CUSTOMER: { bg: 'rgba(59,130,246,0.12)', color: '#2563eb' },
    PROVIDER: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
    ADMIN: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
  };
