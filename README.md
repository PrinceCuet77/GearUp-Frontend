# GearUp — Sports & Outdoor Gear Rental Platform

## Project Overview

GearUp is a backend API for a sports and outdoor equipment rental service. Customers can browse available gear, place rental orders, and return equipment. Providers manage their gear inventory and fulfill rental orders. Admins oversee the platform, manage users, and moderate listings.

> A full-featured, role-based gear rental marketplace built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Zustand** for state management.

[🔗 Live Demo](https://gearup-rent.netlify.app/)

## 📋 Table of Contents

- [GearUp — Sports \& Outdoor Gear Rental Platform](#gearup--sports--outdoor-gear-rental-platform)
  - [Project Overview](#project-overview)
  - [📋 Table of Contents](#-table-of-contents)
  - [Overview](#overview)
  - [Tech Stack](#tech-stack)
  - [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [Features](#features)
    - [🛒 Public](#-public)
    - [👤 Customer](#-customer)
    - [🏪 Provider](#-provider)
    - [🛡️ Admin](#️-admin)
  - [User Roles \& Access](#user-roles--access)
  - [Pages \& Routes](#pages--routes)
  - [State Management](#state-management)
  - [Authentication \& Security](#authentication--security)
  - [API Integration](#api-integration)
  - [Validation](#validation)
  - [Theming](#theming)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Available Scripts](#available-scripts)
  - [Author](#author)

## Overview

**GearUp** is a multi-role gear rental platform where customers can browse and rent sports & outdoor equipment, providers can list and manage their inventory, and admins oversee the entire marketplace. The application communicates with a RESTful backend API exclusively through Next.js Server Actions — no API keys or tokens are ever exposed to the client.

**Currency:** Bangladeshi Taka (৳) · **Timezone:** `Asia/Dhaka`

## Tech Stack

| Layer                | Technology              | Purpose                                       |
| -------------------- | ----------------------- | --------------------------------------------- |
| **Framework**        | Next.js 16 (App Router) | SSR, Server Actions, Middleware, Routing      |
| **UI Library**       | React 19                | Component architecture                        |
| **Styling**          | Tailwind CSS v4         | Utility-first responsive styling              |
| **State Management** | Zustand 5               | Client-side global state (auth, cart, rental) |
| **Form Handling**    | React Hook Form + Zod   | Form state & schema validation                |
| **Authentication**   | JWT (httpOnly cookies)  | Secure token-based auth                       |
| **Icons**            | Lucide React            | Consistent iconography                        |
| **Notifications**    | Sonner                  | Toast notifications                           |
| **Language**         | TypeScript 5            | End-to-end type safety                        |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
├─────────────────────────────────────────────────────────────┤
│  Middleware (proxy.ts)                                       │
│  ├── Auth guard — redirects unauthenticated users            │
│  ├── Role-based access control (CUSTOMER / PROVIDER / ADMIN) │
│  └── Automatic JWT token refresh                             │
├─────────────────────────────────────────────────────────────┤
│  Server Actions (_actions/)                                  │
│  ├── Auth: login, register, logout, getProfile, refreshToken │
│  ├── Admin: dashboard, users, gears, categories              │
│  ├── Customer: orders, payments, reviews, profile            │
│  ├── Provider: gears, orders, dashboard, profile             │
│  └── Public: getAllGears, getAllCategories                    │
├─────────────────────────────────────────────────────────────┤
│  Client State (Zustand)                                      │
│  ├── useAuthStore   — persisted user & auth status           │
│  ├── useCartStore   — persisted cart items & subtotal         │
│  └── useRentalStore — transient order creation state          │
├─────────────────────────────────────────────────────────────┤
│  Validation (Zod)                                            │
│  ├── auth.ts     — login, register schemas                   │
│  ├── gear.ts     — create & update gear schemas              │
│  └── category.ts — create & update category schemas          │
└─────────────────────────────────────────────────────────────┘
```

**Key Design Patterns:**

- **Server-first authentication** — User profile is fetched server-side in the root layout and synced to Zustand via `UserInitializer`, eliminating auth-related UI flicker.
- **Cookie-based JWT** — Tokens are stored as `httpOnly` cookies and passed to backend via `Cookie` header in server actions. No secrets reach the client bundle.
- **Consistent error handling** — All server actions return `{ success, data, error }` and never throw, providing uniform error surfaces.
- **URL-driven filters** — Gear browsing state (search, category, price range, sort, page) lives in search params, making filters shareable and bookmarkable.
- **CSS variable theming** — All colors use CSS custom properties (`var(--primary)`, `var(--foreground)`, etc.) with seamless dark mode support.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout (server auth, theme, navbar, footer)
│   ├── page.tsx                    # Landing page
│   ├── not-found.tsx               # Custom 404
│   ├── globals.css                 # Tailwind + CSS variables
│   │
│   ├── (auth)/                     # Auth route group
│   │   ├── layout.tsx              # Centered auth layout
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── _actions/               # Auth server actions
│   │       ├── loginActions.ts
│   │       ├── registerActions.ts
│   │       ├── logoutActions.ts
│   │       ├── getProfileActions.ts
│   │       └── refreshTokenAction.ts
│   │
│   ├── (dashboards)/               # Protected dashboard route groups
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Admin guard + sidebar nav
│   │   │   ├── page.tsx            # Admin overview
│   │   │   ├── users/              # User management
│   │   │   ├── gears/              # Gear moderation
│   │   │   ├── categories/         # Category CRUD
│   │   │   ├── analytics/          # Platform analytics & charts
│   │   │   ├── profile/            # Admin profile
│   │   │   └── settings/
│   │   ├── customer/
│   │   │   ├── layout.tsx          # Customer guard + sidebar nav
│   │   │   ├── page.tsx            # Customer overview
│   │   │   ├── rental-orders/      # Order history & tracking
│   │   │   ├── payments/           # Payment records
│   │   │   ├── reviews/            # Review management
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   └── provider/
│   │       ├── layout.tsx          # Provider guard + sidebar nav
│   │       ├── page.tsx            # Provider overview
│   │       ├── gears/              # Inventory management
│   │       ├── rental-orders/      # Order processing
│   │       ├── analytics/          # Provider analytics & charts
│   │       ├── profile/
│   │       └── settings/
│   │
│   └── (public)/                   # Public route group
│       ├── _actions/               # Public server actions
│       ├── _components/            # GearBrowseContent, GearCard, Filters, etc.
│       └── gears/
│           ├── page.tsx            # Gear browsing with filters
│           └── [id]/               # Gear detail page
│
├── components/
│   ├── Navbar.tsx                  # Responsive nav with role-based links
│   ├── footer.tsx
│   ├── ThemeProvider.tsx           # Dark/light theme context
│   ├── UserInitializer.tsx         # Server → Zustand auth sync
│   ├── Modal.tsx / ImageModal.tsx
│   ├── cart/CartSidebar.tsx        # Slide-out rental cart
│   ├── dashboard/
│   │   ├── DashboardShell.tsx      # Sidebar layout for all dashboards
│   │   ├── GearForm.tsx            # Create/edit gear form
│   │   ├── ProfileForm.tsx         # User profile editing
│   │   ├── ChangePasswordForm.tsx
│   │   ├── ReviewFormModal.tsx
│   │   ├── UpdateOrderStatusModal.tsx
│   │   ├── PageHeader.tsx / StatsCard.tsx / StatusBadge.tsx
│   │   └── ErrorBanner.tsx / ProfileSkeleton.tsx
│   └── ui/Skeleton.tsx
│
├── contexts/CartContext.tsx         # Legacy cart context (Zustand store is primary)
├── store/
│   ├── useAuthStore.ts             # Auth state (persisted to localStorage)
│   ├── useCartStore.ts             # Cart state (persisted to localStorage)
│   └── useRentalStore.ts           # Rental order creation state
├── lib/
│   ├── constants.ts                # Roles, nav links, role colors
│   ├── types.ts                    # TypeScript interfaces & API types
│   ├── gear-utils.ts               # Currency formatting, image parsing, sort options
│   ├── jwt.ts                      # JWT decode utilities
│   ├── dummy-data.ts               # Placeholder / seed data
│   └── validations/
│       ├── auth.ts                 # Login & register schemas
│       ├── gear.ts                 # Create & update gear schemas
│       └── category.ts             # Create & update category schemas
└── proxy.ts                        # Next.js middleware (auth, RBAC, token refresh)
```

## Features

### 🛒 Public

- Browse gear catalog with **search, category filter, price range, sorting, and pagination**
- View gear details, ratings, and availability
- Responsive design with mobile-friendly filter drawer
- Dark / light theme toggle

### 👤 Customer

- Add gear to cart with rental date selection
- Place rental orders
- Track order status (`PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED`)
- View payment history
- Write and manage gear reviews
- Profile & password management

### 🏪 Provider

- List, edit, and delete gear inventory
- View and manage incoming rental orders
- Update order status (confirm, mark ready, mark returned)
- Dashboard with stats (total gear, orders, pending confirmations)
- Profile & password management

### 🛡️ Admin

- Full dashboard with platform-wide statistics
- Manage users (view, suspend/activate)
- Moderate all gears across providers
- CRUD for gear categories
- Profile & password management

## User Roles & Access

| Role         | Access        | Color |
| ------------ | ------------- | ----- |
| **CUSTOMER** | `/customer/*` | Blue  |
| **PROVIDER** | `/provider/*` | Green |
| **ADMIN**    | `/admin/*`    | Red   |

Access is enforced at the **middleware level** (`proxy.ts`). Unauthorized role access redirects to `/not-found`. Unauthenticated users are redirected to `/login`.

## Pages & Routes

| Route                       | Access   | Description              |
| --------------------------- | -------- | ------------------------ |
| `/`                         | Public   | Landing page             |
| `/gears`                    | Public   | Browse gear catalog      |
| `/gears/[id]`               | Public   | Gear detail page         |
| `/login`                    | Public   | User login               |
| `/register`                 | Public   | User registration        |
| `/admin`                    | Admin    | Admin dashboard overview |
| `/admin/users`              | Admin    | User management          |
| `/admin/gears`              | Admin    | Gear moderation          |
| `/admin/categories`         | Admin    | Category management      |
| `/admin/profile`            | Admin    | Admin profile            |
| `/admin/analytics`          | Admin    | Platform analytics       |
| `/admin/settings`           | Admin    | Account settings         |
| `/customer`                 | Customer | Dashboard overview       |
| `/customer/rental-orders`   | Customer | Rental order history     |
| `/customer/payments`        | Customer | Payment records          |
| `/customer/reviews`         | Customer | Review management        |
| `/customer/profile`         | Customer | Customer profile         |
| `/customer/settings`        | Customer | Account settings         |
| `/provider`                 | Provider | Dashboard overview       |
| `/provider/gears`           | Provider | Inventory management     |
| `/provider/rental-orders`   | Provider | Order processing         |
| `/provider/profile`         | Provider | Provider profile         |
| `/provider/analytics`       | Provider | Provider analytics       |
| `/provider/settings`        | Provider | Account settings         |

## State Management

All client state is managed via **Zustand** stores:

| Store            | Persistence                    | Purpose                                                    |
| ---------------- | ------------------------------ | ---------------------------------------------------------- |
| `useAuthStore`   | `localStorage` (`gearup-auth`) | Current user, auth status, profile fetching                |
| `useCartStore`   | `localStorage` (`gearup-cart`) | Cart items, quantities, rental dates, subtotal calculation |
| `useRentalStore` | None (transient)               | Order creation loading/error state                         |

**Derived state:**

- `cartStore.itemCount` — total number of items in cart
- `cartStore.subtotal` — `Σ(price × quantity × rental days)`

## Authentication & Security

- **JWT tokens** stored as `httpOnly` cookies (`accessToken` — 1 day, `refreshToken` — 7 days)
- **Automatic token refresh** in middleware when access token expires
- **Server-side profile verification** on every protected route via `getProfileAction()`
- **No secrets in client bundle** — all API calls go through server actions
- **Role-based access control** enforced at the middleware layer

## API Integration

The application communicates with a RESTful backend via **37 endpoints**. All calls are made through Next.js Server Actions using the `BACKEND_API_URL` environment variable.

| Method   | Count | Key Endpoints                                                                                                             |
| -------- | ----- | ------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | 18    | `/api/user/me`, `/api/gears`, `/api/categories`, `/api/rentals`, `/api/payments`, `/api/reviews`, dashboards              |
| `POST`   | 8     | `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, `/api/rentals`, `/api/payments/create`, `/api/reviews`      |
| `PATCH`  | 9     | `/api/user/me`, `/api/user/me/password`, `/api/rentals/:id/cancel`, `/api/rentals/:id/return`, `/api/provider/orders/:id` |
| `DELETE` | 2     | `/api/reviews/:id`, `/api/provider/gears/:id`                                                                             |

All server actions return a consistent response shape:

```ts
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}
```

## Validation

Form validation uses **Zod** schemas integrated with **React Hook Form** via `@hookform/resolvers`:

| Schema                 | Fields                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `loginSchema`          | `email` (valid email), `password` (required)                                                                                   |
| `registerSchema`       | `email` (valid email), `password` (6–20 chars), `role` (optional enum)                                                         |
| `createGearSchema`     | `name` (1–100), `description` (1–255), `price` (positive), `stock` (non-negative int), `images` (URL), `categoryId` (required) |
| `updateGearSchema`     | Same as create, all fields optional                                                                                            |
| `createCategorySchema` | `name` (1–100), `description` (optional, max 100)                                                                              |
| `updateCategorySchema` | Same as create, all fields optional                                                                                            |

## Theming

The app supports **dark and light modes** via CSS custom properties:

- Theme preference is stored in `localStorage('theme')` and respects `prefers-color-scheme`
- An inline `<script>` in the root layout prevents flash of unstyled content (FOUC) on initial load
- All component colors reference CSS variables (`var(--primary)`, `var(--foreground)`, `var(--background)`, etc.)
- Toggle available in the Navbar

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A running instance of the GearUp backend API

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd gearup-next-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local    # or create .env.local manually

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL (server-side only — never exposed to the client)
BACKEND_API_URL=https://your-backend-api.com
```

> ⚠️ This variable is only used in server actions and is **never bundled** into the client JavaScript.

## Available Scripts

| Script  | Command         | Description                      |
| ------- | --------------- | -------------------------------- |
| `dev`   | `npm run dev`   | Start Next.js development server |
| `build` | `npm run build` | Create production build          |
| `start` | `npm run start` | Start production server          |
| `lint`  | `npm run lint`  | Run ESLint                       |

## Author

- Rezoan Shakil Prince
- Senior Software Engineer (SSE)
- BJIT Ltd
