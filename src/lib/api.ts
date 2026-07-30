import { cookies } from 'next/headers';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://gear-up-self.vercel.app';

// ─── Response types ───────────────────────────────────────────────────────────

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: ApiMeta;
}

// ─── Domain types ─────────────────────────────────────────────────────────────

export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';
export type RentalStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PAID'
  | 'PICKED_UP'
  | 'RETURNED'
  | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Lightweight review snapshot embedded in gear list / detail responses. */
export interface GearReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  /** Rental price per day in BDT (stored as numeric string). */
  price: string;
  stock: number;
  /** JSON-stringified array of image URLs, e.g. `'["https://..."]'`. */
  images: string;
  isActive: boolean;
  providerId: string;
  categoryId: string;
  category?: Category;
  provider?: User;
  /** Embedded review snapshots returned by the API. */
  reviews?: GearReview[];
  /** Embedded rental order item snapshots returned by the API. */
  rentalOrderItems?: Array<{ id: string; quantity: number; price: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface RentalOrderItem {
  id: string;
  quantity: number;
  price: string;
  rentalOrderId: string;
  gearItemId: string;
  gearItem?: GearItem;
}

export interface RentalOrder {
  id: string;
  status: RentalStatus;
  startDate: string;
  endDate: string;
  amount: string;
  customerId: string;
  customer?: User;
  items?: RentalOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  amount: string;
  status: PaymentStatus;
  paidAt: string | null;
  rentalOrderId: string;
  rentalOrder?: RentalOrder;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  customerId: string;
  gearItemId: string;
  rentalOrderId: string;
  gearItem?: GearItem;
  customer?: User;
  createdAt: string;
  updatedAt: string;
}

// ─── Fetch helper ─────────────────────────────────────────────────────────────

export async function serverFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
    cache: 'no-store',
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok) {
    throw new Error(json.message ?? `API ${res.status}: ${res.statusText}`);
  }

  return json;
}

// ─── Convenience helpers ──────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await serverFetch<User>('/api/user/me');
    return res.data;
  } catch {
    return null;
  }
}
