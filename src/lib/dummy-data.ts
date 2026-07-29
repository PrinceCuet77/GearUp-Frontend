/**
 * Dummy data for UI design & route exploration.
 * All API calls are commented out across the app — these constants power the UI.
 * Replace with real API calls when integrating the backend.
 */

import type {
  User,
  Category,
  GearItem,
  RentalOrder,
  Payment,
  Review,
} from './api';

// ── Users ─────────────────────────────────────────────────────────────────────

export const DUMMY_ADMIN: User = {
  id: 'user-admin-001',
  name: 'Alex Morgan',
  email: 'admin@gearup.com',
  role: 'ADMIN',
  status: 'ACTIVE',
  avatarUrl: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const DUMMY_CUSTOMER: User = {
  id: 'user-customer-001',
  name: 'Jordan Smith',
  email: 'jordan@example.com',
  role: 'CUSTOMER',
  status: 'ACTIVE',
  avatarUrl: null,
  createdAt: '2024-02-15T00:00:00Z',
  updatedAt: '2024-02-15T00:00:00Z',
};

export const DUMMY_PROVIDER: User = {
  id: 'user-provider-001',
  name: 'Sam Rodriguez',
  email: 'sam@gearshop.com',
  role: 'PROVIDER',
  status: 'ACTIVE',
  avatarUrl: null,
  createdAt: '2024-01-20T00:00:00Z',
  updatedAt: '2024-01-20T00:00:00Z',
};

const PROVIDER_2: User = {
  id: 'user-provider-002',
  name: 'GearHouse Pro',
  email: 'info@gearhouse.com',
  role: 'PROVIDER',
  status: 'ACTIVE',
  avatarUrl: null,
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

export const DUMMY_USERS: User[] = [
  DUMMY_ADMIN,
  DUMMY_CUSTOMER,
  DUMMY_PROVIDER,
  {
    id: 'user-customer-002',
    name: 'Morgan Lee',
    email: 'morgan@example.com',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    avatarUrl: null,
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'user-customer-003',
    name: 'Casey Brown',
    email: 'casey@example.com',
    role: 'CUSTOMER',
    status: 'SUSPENDED',
    avatarUrl: null,
    createdAt: '2024-03-22T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
  },
  PROVIDER_2,
  {
    id: 'user-customer-004',
    name: 'Taylor Kim',
    email: 'taylor@example.com',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    avatarUrl: null,
    createdAt: '2024-04-05T00:00:00Z',
    updatedAt: '2024-04-05T00:00:00Z',
  },
  {
    id: 'user-customer-005',
    name: null,
    email: 'unknown@example.com',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    avatarUrl: null,
    createdAt: '2024-04-12T00:00:00Z',
    updatedAt: '2024-04-12T00:00:00Z',
  },
];

// ── Categories ────────────────────────────────────────────────────────────────

export const DUMMY_CATEGORIES: Category[] = [
  {
    id: 'cat-001',
    name: 'Cycling',
    description: 'Bicycles, helmets, and cycling accessories',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-002',
    name: 'Camping & Hiking',
    description: 'Tents, sleeping bags, and outdoor essentials',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-003',
    name: 'Water Sports',
    description: 'Kayaks, surfboards, and aquatic gear',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-004',
    name: 'Fitness & Gym',
    description: 'Weights, resistance bands, and fitness equipment',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-005',
    name: 'Winter Sports',
    description: 'Skis, snowboards, and cold-weather gear',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-006',
    name: 'Team Sports',
    description: 'Football, basketball, and team equipment',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ── Gear Items ────────────────────────────────────────────────────────────────

export const DUMMY_GEARS: GearItem[] = [
  {
    id: 'gear-001',
    name: 'Trek Mountain Bike Pro 29"',
    description:
      'High-performance 29er mountain bike with full suspension, hydraulic disc brakes, and Shimano XT drivetrain. Perfect for trail and enduro riding. Includes helmet and gloves.',
    price: '45.00',
    stock: 3,
    images:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    isActive: true,
    providerId: 'user-provider-001',
    categoryId: 'cat-001',
    category: DUMMY_CATEGORIES[0],
    provider: DUMMY_PROVIDER,
    reviews: [
      {
        id: 'rev-g001-1',
        rating: 5,
        comment: 'Amazing bike! Perfect for trails.',
        createdAt: '2024-04-10T00:00:00Z',
        updatedAt: '2024-04-10T00:00:00Z',
      },
      {
        id: 'rev-g001-2',
        rating: 4,
        comment: 'Great condition, very fun to ride.',
        createdAt: '2024-04-15T00:00:00Z',
        updatedAt: '2024-04-15T00:00:00Z',
      },
    ],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'gear-002',
    name: 'Coleman 6-Person Camping Tent',
    description:
      'Spacious 6-person dome tent with WeatherTec system for complete weatherproofing. Sets up in under 10 minutes. Includes rainfly, carry bag, and stakes.',
    price: '28.00',
    stock: 5,
    images:
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    isActive: true,
    providerId: 'user-provider-001',
    categoryId: 'cat-002',
    category: DUMMY_CATEGORIES[1],
    provider: DUMMY_PROVIDER,
    reviews: [
      {
        id: 'rev-g002-1',
        rating: 5,
        comment: 'Perfect tent — set up in minutes!',
        createdAt: '2024-04-12T00:00:00Z',
        updatedAt: '2024-04-12T00:00:00Z',
      },
    ],
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
  },
  {
    id: 'gear-003',
    name: 'Ocean Kayak Prowler 13',
    description:
      'Sit-on-top kayak perfect for fishing or recreational paddling. Extremely stable and easy to re-board. Includes paddle, life vest, and dry bag.',
    price: '65.00',
    stock: 2,
    images:
      'https://images.unsplash.com/photo-1519639669987-eefd2c27de1c?w=800&q=80',
    isActive: true,
    providerId: 'user-provider-002',
    categoryId: 'cat-003',
    category: DUMMY_CATEGORIES[2],
    provider: PROVIDER_2,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'gear-004',
    name: 'Adjustable Dumbbell Set (5–52.5 lbs)',
    description:
      'Space-efficient adjustable dumbbell set that replaces 15 traditional dumbbells. Quick-select dial mechanism. Perfect for home workouts and training sessions.',
    price: '18.00',
    stock: 4,
    images:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    isActive: true,
    providerId: 'user-provider-001',
    categoryId: 'cat-004',
    category: DUMMY_CATEGORIES[3],
    provider: DUMMY_PROVIDER,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 'gear-005',
    name: 'Rossignol All-Mountain Ski Set',
    description:
      'Complete all-mountain ski package with skis, bindings, and boots. Suitable for intermediate to advanced skiers. Helmet and poles included.',
    price: '85.00',
    stock: 3,
    images:
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80',
    isActive: true,
    providerId: 'user-provider-002',
    categoryId: 'cat-005',
    category: DUMMY_CATEGORIES[4],
    provider: PROVIDER_2,
    reviews: [
      {
        id: 'rev-g005-1',
        rating: 4,
        comment: 'Great ski package, everything included.',
        createdAt: '2024-04-20T00:00:00Z',
        updatedAt: '2024-04-20T00:00:00Z',
      },
      {
        id: 'rev-g005-2',
        rating: 5,
        comment: 'Excellent quality skis!',
        createdAt: '2024-04-25T00:00:00Z',
        updatedAt: '2024-04-25T00:00:00Z',
      },
      {
        id: 'rev-g005-3',
        rating: 3,
        comment: 'Good but boots were a bit tight.',
        createdAt: '2024-05-01T00:00:00Z',
        updatedAt: '2024-05-01T00:00:00Z',
      },
    ],
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  },
  {
    id: 'gear-006',
    name: 'Cannondale Road Bike Carbon',
    description:
      'Lightweight carbon frame road bike with Ultegra groupset. Ideal for long-distance rides and sportives. Includes cycling computer mount and rear rack.',
    price: '55.00',
    stock: 2,
    images:
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
    isActive: true,
    providerId: 'user-provider-001',
    categoryId: 'cat-001',
    category: DUMMY_CATEGORIES[0],
    provider: DUMMY_PROVIDER,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'gear-007',
    name: 'SUP Paddleboard Complete Kit',
    description:
      'Stand-up paddleboard with adjustable paddle, leash, fin, and pump. Perfect for flat water paddling, yoga, and fitness. Easy to inflate and transport.',
    price: '55.00',
    stock: 4,
    images:
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
    isActive: true,
    providerId: 'user-provider-002',
    categoryId: 'cat-003',
    category: DUMMY_CATEGORIES[2],
    provider: PROVIDER_2,
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
  },
  {
    id: 'gear-008',
    name: 'Backpacking Sleeping Bag (−10 °C)',
    description:
      'Lightweight mummy-style sleeping bag rated to −10 °C. Compresses to the size of a water bottle. Includes compression sack and basic repair kit.',
    price: '15.00',
    stock: 8,
    images:
      'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&q=80',
    isActive: true,
    providerId: 'user-provider-001',
    categoryId: 'cat-002',
    category: DUMMY_CATEGORIES[1],
    provider: DUMMY_PROVIDER,
    reviews: [
      {
        id: 'rev-g008-1',
        rating: 5,
        comment: 'Kept me warm all night — incredibly compact!',
        createdAt: '2024-04-18T00:00:00Z',
        updatedAt: '2024-04-18T00:00:00Z',
      },
      {
        id: 'rev-g008-2',
        rating: 4,
        comment: 'Very light and packs down small.',
        createdAt: '2024-04-22T00:00:00Z',
        updatedAt: '2024-04-22T00:00:00Z',
      },
    ],
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'gear-009',
    name: 'Surfboard 7ft Funboard',
    description:
      'Classic funboard shape ideal for beginner to intermediate surfers. Durable epoxy construction with multiple fin setups. Leash and wax included.',
    price: '40.00',
    stock: 3,
    images:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    isActive: false,
    providerId: 'user-provider-002',
    categoryId: 'cat-003',
    category: DUMMY_CATEGORIES[2],
    provider: PROVIDER_2,
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'gear-010',
    name: 'Burton Custom Snowboard 158 cm',
    description:
      'All-mountain snowboard suited for groomed runs and light powder. Medium flex. Includes bindings, boots, and helmet. Great for intermediate riders.',
    price: '70.00',
    stock: 2,
    images:
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&q=80',
    isActive: true,
    providerId: 'user-provider-001',
    categoryId: 'cat-005',
    category: DUMMY_CATEGORIES[4],
    provider: DUMMY_PROVIDER,
    reviews: [
      {
        id: 'rev-g010-1',
        rating: 4,
        comment: 'Awesome board, great for intermediates.',
        createdAt: '2024-04-28T00:00:00Z',
        updatedAt: '2024-04-28T00:00:00Z',
      },
      {
        id: 'rev-g010-2',
        rating: 5,
        comment: 'Best snowboard rental experience!',
        createdAt: '2024-05-02T00:00:00Z',
        updatedAt: '2024-05-02T00:00:00Z',
      },
    ],
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
  },
  {
    id: 'gear-011',
    name: 'Battle Ropes Set 15 m',
    description:
      'Heavy-duty 15-meter battle ropes for high-intensity interval training. Includes wall anchor, carrying bag, and exercise guide card.',
    price: '12.00',
    stock: 6,
    images:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    isActive: true,
    providerId: 'user-provider-001',
    categoryId: 'cat-004',
    category: DUMMY_CATEGORIES[3],
    provider: DUMMY_PROVIDER,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'gear-012',
    name: 'Camping Hammock with Stand',
    description:
      'Ultra-light double hammock with portable steel stand. Sets up in under 5 minutes. Supports up to 400 lbs. Perfect for no-tree camping spots.',
    price: '20.00',
    stock: 5,
    images:
      'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800&q=80',
    isActive: true,
    providerId: 'user-provider-002',
    categoryId: 'cat-002',
    category: DUMMY_CATEGORIES[1],
    provider: PROVIDER_2,
    createdAt: '2024-04-05T00:00:00Z',
    updatedAt: '2024-04-05T00:00:00Z',
  },
];

// ── Rental Orders ─────────────────────────────────────────────────────────────

export const DUMMY_ORDERS: RentalOrder[] = [
  {
    id: 'order-001aabbcc',
    status: 'RETURNED',
    startDate: '2024-04-01T00:00:00Z',
    endDate: '2024-04-05T00:00:00Z',
    amount: '249.00',
    customerId: 'user-customer-001',
    customer: DUMMY_CUSTOMER,
    items: [
      {
        id: 'oi-001',
        quantity: 1,
        price: '45.00',
        rentalOrderId: 'order-001aabbcc',
        gearItemId: 'gear-001',
        gearItem: DUMMY_GEARS[0],
      },
      {
        id: 'oi-002',
        quantity: 2,
        price: '28.00',
        rentalOrderId: 'order-001aabbcc',
        gearItemId: 'gear-002',
        gearItem: DUMMY_GEARS[1],
      },
    ],
    createdAt: '2024-03-28T00:00:00Z',
    updatedAt: '2024-04-06T00:00:00Z',
  },
  {
    id: 'order-002ddeeff',
    status: 'PICKED_UP',
    startDate: '2024-04-10T00:00:00Z',
    endDate: '2024-04-15T00:00:00Z',
    amount: '325.00',
    customerId: 'user-customer-001',
    customer: DUMMY_CUSTOMER,
    items: [
      {
        id: 'oi-003',
        quantity: 1,
        price: '65.00',
        rentalOrderId: 'order-002ddeeff',
        gearItemId: 'gear-003',
        gearItem: DUMMY_GEARS[2],
      },
    ],
    createdAt: '2024-04-08T00:00:00Z',
    updatedAt: '2024-04-10T00:00:00Z',
  },
  {
    id: 'order-003gghhii',
    status: 'CONFIRMED',
    startDate: '2024-04-20T00:00:00Z',
    endDate: '2024-04-25T00:00:00Z',
    amount: '425.00',
    customerId: 'user-customer-001',
    customer: DUMMY_CUSTOMER,
    items: [
      {
        id: 'oi-004',
        quantity: 1,
        price: '85.00',
        rentalOrderId: 'order-003gghhii',
        gearItemId: 'gear-005',
        gearItem: DUMMY_GEARS[4],
      },
    ],
    createdAt: '2024-04-17T00:00:00Z',
    updatedAt: '2024-04-18T00:00:00Z',
  },
  {
    id: 'order-004jjkkll',
    status: 'PLACED',
    startDate: '2024-05-01T00:00:00Z',
    endDate: '2024-05-03T00:00:00Z',
    amount: '110.00',
    customerId: 'user-customer-002',
    customer: DUMMY_USERS[3],
    items: [
      {
        id: 'oi-005',
        quantity: 1,
        price: '55.00',
        rentalOrderId: 'order-004jjkkll',
        gearItemId: 'gear-006',
        gearItem: DUMMY_GEARS[5],
      },
    ],
    createdAt: '2024-04-28T00:00:00Z',
    updatedAt: '2024-04-28T00:00:00Z',
  },
  {
    id: 'order-005mmnnoo',
    status: 'CANCELLED',
    startDate: '2024-03-15T00:00:00Z',
    endDate: '2024-03-18T00:00:00Z',
    amount: '120.00',
    customerId: 'user-customer-001',
    customer: DUMMY_CUSTOMER,
    items: [
      {
        id: 'oi-006',
        quantity: 2,
        price: '20.00',
        rentalOrderId: 'order-005mmnnoo',
        gearItemId: 'gear-012',
        gearItem: DUMMY_GEARS[11],
      },
    ],
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-11T00:00:00Z',
  },
  {
    id: 'order-006ppqqrr',
    status: 'PAID',
    startDate: '2024-04-22T00:00:00Z',
    endDate: '2024-04-26T00:00:00Z',
    amount: '220.00',
    customerId: 'user-customer-004',
    customer: DUMMY_USERS[6],
    items: [
      {
        id: 'oi-007',
        quantity: 1,
        price: '55.00',
        rentalOrderId: 'order-006ppqqrr',
        gearItemId: 'gear-007',
        gearItem: DUMMY_GEARS[6],
      },
    ],
    createdAt: '2024-04-20T00:00:00Z',
    updatedAt: '2024-04-21T00:00:00Z',
  },
];

// ── Payments ──────────────────────────────────────────────────────────────────

export const DUMMY_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    transactionId: 'TXN-20240401-8F2A',
    amount: '249.00',
    status: 'COMPLETED',
    paidAt: '2024-04-01T10:30:00Z',
    rentalOrderId: 'order-001aabbcc',
    rentalOrder: DUMMY_ORDERS[0],
    createdAt: '2024-04-01T10:25:00Z',
    updatedAt: '2024-04-01T10:30:00Z',
  },
  {
    id: 'pay-002',
    transactionId: 'TXN-20240410-3C9D',
    amount: '325.00',
    status: 'COMPLETED',
    paidAt: '2024-04-10T09:15:00Z',
    rentalOrderId: 'order-002ddeeff',
    rentalOrder: DUMMY_ORDERS[1],
    createdAt: '2024-04-10T09:10:00Z',
    updatedAt: '2024-04-10T09:15:00Z',
  },
  {
    id: 'pay-003',
    transactionId: 'TXN-20240420-7E1B',
    amount: '425.00',
    status: 'PENDING',
    paidAt: null,
    rentalOrderId: 'order-003gghhii',
    rentalOrder: DUMMY_ORDERS[2],
    createdAt: '2024-04-20T00:00:00Z',
    updatedAt: '2024-04-20T00:00:00Z',
  },
  {
    id: 'pay-004',
    transactionId: 'TXN-20240315-2A5F',
    amount: '120.00',
    status: 'FAILED',
    paidAt: null,
    rentalOrderId: 'order-005mmnnoo',
    rentalOrder: DUMMY_ORDERS[4],
    createdAt: '2024-03-10T14:00:00Z',
    updatedAt: '2024-03-10T14:05:00Z',
  },
];

// ── Reviews ───────────────────────────────────────────────────────────────────

export const DUMMY_REVIEWS: Review[] = [
  {
    id: 'review-001',
    rating: 5,
    comment:
      'Amazing mountain bike! Extremely well-maintained and the suspension was perfect for the trails. Would definitely rent again.',
    customerId: 'user-customer-001',
    gearItemId: 'gear-001',
    rentalOrderId: 'order-001aabbcc',
    gearItem: DUMMY_GEARS[0],
    customer: DUMMY_CUSTOMER,
    createdAt: '2024-04-07T00:00:00Z',
    updatedAt: '2024-04-07T00:00:00Z',
  },
  {
    id: 'review-002',
    rating: 4,
    comment:
      'The tent was spacious and easy to set up. Slightly heavy for backpacking but great for car camping. All poles and pegs were included.',
    customerId: 'user-customer-001',
    gearItemId: 'gear-002',
    rentalOrderId: 'order-001aabbcc',
    gearItem: DUMMY_GEARS[1],
    customer: DUMMY_CUSTOMER,
    createdAt: '2024-04-07T01:00:00Z',
    updatedAt: '2024-04-07T01:00:00Z',
  },
  {
    id: 'review-003',
    rating: 5,
    comment:
      'Perfect kayak for a day trip! Very stable even in choppy water. The included life vest fit well.',
    customerId: 'user-customer-002',
    gearItemId: 'gear-003',
    rentalOrderId: 'order-002ddeeff',
    gearItem: DUMMY_GEARS[2],
    customer: DUMMY_USERS[3],
    createdAt: '2024-04-16T00:00:00Z',
    updatedAt: '2024-04-16T00:00:00Z',
  },
  {
    id: 'review-004',
    rating: 3,
    comment:
      'Decent ski set but the boots were a bit worn. Overall still functional. The skis themselves were in great condition.',
    customerId: 'user-customer-004',
    gearItemId: 'gear-005',
    rentalOrderId: 'order-006ppqqrr',
    gearItem: DUMMY_GEARS[4],
    customer: DUMMY_USERS[6],
    createdAt: '2024-04-27T00:00:00Z',
    updatedAt: '2024-04-27T00:00:00Z',
  },
];
