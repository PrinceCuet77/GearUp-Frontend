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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER' | 'PROVIDER';
  status: 'ACTIVE' | 'INACTIVE';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResult {
  success: boolean;
  data: UserProfile | null;
  error: string | null;
}

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
export interface GearReview {
  id: string;
  rating: number;
  comment: string;
  customer?: Pick<User, 'id' | 'name' | 'email' | 'avatarUrl'>;
  createdAt: string;
  updatedAt: string;
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  images: string;
  isActive: boolean;
  providerId: string;
  categoryId: string;
  category?: Category;
  provider?: User;
  customer?: Pick<User, 'id' | 'name' | 'email' | 'avatarUrl'>;
  reviews?: GearReview[];
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
  payments?: Payment[];
  reviews?: Review[];
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
  rentalOrder?: Pick<RentalOrder, 'id' | 'status'>;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category[];
}

export interface CategoriesResult {
  success: boolean;
  data: Category[] | null;
  error: string | null;
}

export interface GearsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GearItem[];
  meta: ApiMeta;
}

export interface GearsResult {
  success: boolean;
  data: GearItem[] | null;
  meta: ApiMeta | null;
  error: string | null;
}

export interface AdminRentalsMeta extends ApiMeta {
  /** Count of every rental order in the system, unaffected by filters. */
  totalRentals: number;
  /** Count per `RentalStatus`, unaffected by filters. Zero-count statuses are omitted. */
  statusCounts: Partial<Record<RentalStatus, number>>;
}

export interface AdminRentalsResult {
  success: boolean;
  data: RentalOrder[] | null;
  meta: AdminRentalsMeta | null;
  error: string | null;
}

export interface CustomerRentalOrder {
  id: string;
  customerId: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDashboardInfo {
  stats: {
    totalOrders: number;
    activeRentals: number;
    paymentsMade: number;
    reviewsGiven: number;
  };
  recentOrders: CustomerRentalOrder[];
}

export interface CustomerDashboardResult {
  success: boolean;
  data: CustomerDashboardInfo | null;
  error: string | null;
}

export interface ProviderRentalOrder {
  id: string;
  customerId: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  status: RentalStatus;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderDashboardInfo {
  stats: {
    totalGearListed: number;
    totalOrders: number;
    needsConfirmation: number;
    readyForPickup: number;
  };
  recentOrders: ProviderRentalOrder[];
}

export interface ProviderDashboardResult {
  success: boolean;
  data: ProviderDashboardInfo | null;
  error: string | null;
}
