/**
 * Dummy data for UI design & route exploration.
 * All API calls are commented out across the app — these constants power the UI.
 * Replace with real API calls when integrating the backend.
 */

import type { User, Category, GearItem } from './types';

const DUMMY_PROVIDER: User = {
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
