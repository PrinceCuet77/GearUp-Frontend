import type { RentalStatus, PaymentStatus, UserStatus } from '@/lib/types';

const RENTAL_STATUS: Record<
  RentalStatus,
  { label: string; bg: string; color: string }
> = {
  PLACED: {
    label: 'Placed',
    bg: 'rgba(251,191,36,0.14)',
    color: '#b45309',
  },
  CONFIRMED: {
    label: 'Confirmed',
    bg: 'rgba(59,130,246,0.14)',
    color: '#2563eb',
  },
  PAID: {
    label: 'Paid',
    bg: 'rgba(139,92,246,0.14)',
    color: '#7c3aed',
  },
  PICKED_UP: {
    label: 'Picked Up',
    bg: 'rgba(34,197,94,0.14)',
    color: '#16a34a',
  },
  RETURNED: {
    label: 'Returned',
    bg: 'rgba(100,116,139,0.14)',
    color: '#475569',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'rgba(239,68,68,0.14)',
    color: '#dc2626',
  },
};

const PAYMENT_STATUS: Record<
  PaymentStatus,
  { label: string; bg: string; color: string }
> = {
  PENDING: {
    label: 'Pending',
    bg: 'rgba(251,191,36,0.14)',
    color: '#b45309',
  },
  COMPLETED: {
    label: 'Success',
    bg: 'rgba(34,197,94,0.14)',
    color: '#16a34a',
  },
  FAILED: {
    label: 'Failed',
    bg: 'rgba(239,68,68,0.14)',
    color: '#dc2626',
  },
};

const USER_STATUS: Record<
  UserStatus,
  { label: string; bg: string; color: string }
> = {
  ACTIVE: {
    label: 'Active',
    bg: 'rgba(34,197,94,0.14)',
    color: '#16a34a',
  },
  SUSPENDED: {
    label: 'Suspended',
    bg: 'rgba(239,68,68,0.14)',
    color: '#dc2626',
  },
};

function Badge({
  label,
  bg,
  color,
}: {
  label: string;
  bg: string;
  color: string;
}) {
  return (
    <span
      className='inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold'
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  const cfg = RENTAL_STATUS[status] ?? {
    label: status,
    bg: 'var(--muted)',
    color: 'var(--muted-foreground)',
  };
  return <Badge {...cfg} />;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_STATUS[status] ?? {
    label: status,
    bg: 'var(--muted)',
    color: 'var(--muted-foreground)',
  };
  return <Badge {...cfg} />;
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const cfg = USER_STATUS[status] ?? {
    label: status,
    bg: 'var(--muted)',
    color: 'var(--muted-foreground)',
  };
  return <Badge {...cfg} />;
}
