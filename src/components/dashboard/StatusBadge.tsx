import type { RentalStatus, PaymentStatus, UserStatus } from '@/lib/types';
import { Badge, type BadgeTone } from '@/components/ui/Badge';

/**
 * Status → tone maps. Tones resolve to the brand/state token pairs, which are
 * declared in both themes, so every badge keeps its contrast in dark mode.
 *
 * Lifecycle: PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED
 */
const RENTAL_STATUS: Record<
  RentalStatus,
  { label: string; tone: BadgeTone }
> = {
  PLACED: { label: 'Placed', tone: 'warning' },
  CONFIRMED: { label: 'Confirmed', tone: 'accent' },
  PAID: { label: 'Paid', tone: 'secondary' },
  PICKED_UP: { label: 'Picked Up', tone: 'primary' },
  RETURNED: { label: 'Returned', tone: 'neutral' },
  CANCELLED: { label: 'Cancelled', tone: 'danger' },
};

const PAYMENT_STATUS: Record<
  PaymentStatus,
  { label: string; tone: BadgeTone }
> = {
  PENDING: { label: 'Pending', tone: 'warning' },
  COMPLETED: { label: 'Success', tone: 'secondary' },
  FAILED: { label: 'Failed', tone: 'danger' },
};

const USER_STATUS: Record<UserStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Active', tone: 'secondary' },
  SUSPENDED: { label: 'Suspended', tone: 'danger' },
};

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  const cfg = RENTAL_STATUS[status] ?? {
    label: status,
    tone: 'neutral' as const,
  };
  return (
    <Badge tone={cfg.tone} size='sm'>
      {cfg.label}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_STATUS[status] ?? {
    label: status,
    tone: 'neutral' as const,
  };
  return (
    <Badge tone={cfg.tone} size='sm'>
      {cfg.label}
    </Badge>
  );
}

/** Active/inactive state of a gear listing, shared by every gear table. */
export function GearStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge tone={isActive ? 'secondary' : 'neutral'} size='sm'>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const cfg = USER_STATUS[status] ?? {
    label: status,
    tone: 'neutral' as const,
  };
  return (
    <Badge tone={cfg.tone} size='sm'>
      {cfg.label}
    </Badge>
  );
}
