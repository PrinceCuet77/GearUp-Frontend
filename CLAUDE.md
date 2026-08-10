# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GearUp is the frontend for a sports & outdoor gear rental marketplace, built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and Zustand. It talks to a separate RESTful backend exclusively through Next.js Server Actions — no API keys/tokens are ever exposed to the client. Three roles: `CUSTOMER`, `PROVIDER`, `ADMIN`.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (eslint-config-next core-web-vitals + typescript)
```

There is no test suite configured in this repo.

## Environment Variables

Required in `.env.local` (see `.env.example`):

- `BACKEND_API_URL` — backend base URL, used server-side only (server actions, middleware)
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — must match the backend's secrets; used in `src/proxy.ts` to verify tokens without a network call
- `NEXT_PUBLIC_BACKEND_API_URL` — public variant, only for cases needing a client-side base URL

## Architecture

### Request flow

1. **`src/proxy.ts`** (Next.js middleware) runs on every non-static request:
   - Decodes `accessToken`/`refreshToken` cookies with `jsonwebtoken` against `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET`.
   - If the access token is expired but the refresh token is valid, it calls `refreshTokenAction()` server-side and rewrites the `accessToken` cookie before continuing.
   - Enforces auth: unauthenticated users get redirected to `/login` for any non-public route; already-authenticated users are redirected away from `/login`/`/register` to their role's dashboard.
   - Enforces RBAC by pathname prefix: `/admin/*` requires `role === 'ADMIN'`, `/customer/*` requires `CUSTOMER`, `/provider/*` requires `PROVIDER` — mismatches redirect to `/not-found`.
   - `PUBLIC_ROUTES` (`/`, `/gears`) and `AUTH_ROUTES` (`/login`, `/register`) are hardcoded arrays at the top of the file — update them when adding new public/auth pages.
   - The middleware `matcher` excludes `/api`, `/_next/static`, `/_next/image`, and any request ending in a static asset extension (images, fonts, `.txt`/`.xml`/`.webmanifest`). Assets in `public/` must stay excluded — otherwise they are treated as protected routes and redirected to `/login`, which renders as a broken image.

2. **Server Actions** (`_actions/` folders colocated with routes) are the *only* way the app talks to the backend. Every action:
   - Is a `'use server'` module.
   - Calls `fetch(`${process.env.BACKEND_API_URL}/api/...`)` directly (no shared HTTP client wrapper).
   - Returns a consistent shape: `{ success, statusCode, message, data, meta? }` — it **never throws**; errors are caught and returned in the same shape.
   - For authenticated calls, reads the `accessToken` cookie via `cookies()` and forwards it as a `Cookie` header to the backend.
   - `loginActions.ts`/`refreshTokenAction.ts` are where cookies get *written* (`httpOnly`, `sameSite: 'lax'`, accessToken maxAge 1 day, refreshToken maxAge 7 days).
   - See `API_INTEGRATION.md` for the full endpoint-to-file mapping (37 endpoints across auth/admin/customer/provider/public).

3. **Server-first auth sync**: the root layout (`src/app/layout.tsx`) fetches the user profile server-side and hydrates it into Zustand via `UserInitializer` (`src/components/UserInitializer.tsx`), avoiding auth flicker on load.

### Route structure (`src/app/`)

Uses route groups to separate layout/guard concerns without affecting URLs:

- `(auth)/` — `/login`, `/register`, centered auth layout, own `_actions/`.
- `(dashboards)/{admin,customer,provider}/` — each `layout.tsx` re-checks the profile server-side (belt-and-suspenders with the middleware RBAC) and passes a `NavItem[]` to `DashboardShell`, plus its own `_actions/` and `_components/` colocated per route. Every role has `profile/` and `settings/` (settings hosts the password form); admin and provider also have `analytics/`.
- `(public)/` — landing/browsing pages (`/gears`, `/gears/[id]`) with their own `_actions/`/`_components/`.

Route groups each define their own `_actions/` — there is no single global actions directory. When adding a feature, colocate the server action inside the route group/page it serves, following the existing sibling files as the pattern.

### State (`src/store/`)

Three Zustand stores, all `'use client'`:

- `useAuthStore` — `user`, `isAuthenticated`; persisted to `localStorage` (`gearup-auth`, partialized to just `user`). `fetchUser()` short-circuits if a user is already set — call `clearUser()` on logout to force refetch.
- `useCartStore` — cart items (`{ gear, quantity, startDate, endDate }`), persisted to `localStorage` (`gearup-cart`). `itemCount`/`subtotal` are computed functions, not stored fields — call them, don't destructure as values. Rental duration is `daysBetween(startDate, endDate)`, minimum 1 day.
- `useRentalStore` — transient (unpersisted) loading/error state for order creation.

`src/contexts/CartContext.tsx` is a legacy React Context left over from before the Zustand cart store; treat `useCartStore` as the source of truth for cart state.

### Dashboard building blocks

Dashboard pages are assembled from a fixed set of pieces rather than bespoke markup — reach for these before writing a new card, table or chart:

- **`src/components/dashboard/`** — `DashboardShell` (sidebar + topbar + `ProfileMenu`), `PageHeader`/`SectionHeader`, `StatsCard`, `DataTable` + `Pagination` + `TableToolbar`, `StatusBadge`, `UserAvatar`, `GearListingsTable`. `DataTable` owns the surface, header, loading skeleton, empty state and footer slot; callers supply only columns and rows.
- **`src/components/charts/`** — dependency-free SVG charts (`LineChart`, `BarChart`, `DonutChart`, `RankedBars`) inside a `ChartCard`. They are `'use client'`, so **props must be serializable**: pass `format='count' | 'currency'`, never a formatter function (a Server Component rendering one will throw at runtime, not at build).
- **`src/lib/chart-data.ts`** — pure derivations (`byMonth`, `cumulative`, `countBy`, `sumBy`, `topEntries`, `distribute`, `monthOverMonth`, the status/role breakdowns). Every dashboard series is computed here from records the app already fetches; there is no sample or placeholder data anywhere in the dashboards.
- **`src/lib/hooks/`** — `useUrlQuery` (URL-driven filters/pagination for server-paginated tables), `useClientTable` (search/filter/sort/paginate an in-memory set), `useDebouncedValue`, `useClickOutside`.

Charts draw from `--chart-1/2/3`, re-stepped per theme so the categorical set passes the colourblind-separation and contrast checks against the card surface. Status colours in charts mirror `StatusBadge` exactly, so a status reads the same in a chart, a badge and a table row.

### Validation (`src/lib/validations/`)

Zod schemas paired with React Hook Form via `@hookform/resolvers`: `auth.ts` (login/register), `gear.ts` (create/update gear), `category.ts` (create/update category). Update schemas here matches both frontend field constraints and expected backend payload shape.

### Styling / theming

Tailwind v4 (`globals.css`), all colors expressed as CSS custom properties (`var(--primary)`, `var(--foreground)`, etc.) so dark/light mode works without duplicating utility classes. Theme choice is stored in `localStorage('theme')`; an inline script in the root layout applies it before hydration to avoid FOUC. Don't hardcode hex/rgb colors in components — add/use a CSS variable instead.

### Key conventions

- Path alias `@/*` maps to `src/*` (see `tsconfig.json`).
- Currency is Bangladeshi Taka (৳); timezone is `Asia/Dhaka` — format accordingly in any date/price-facing UI (see `src/lib/gear-utils.ts` for currency formatting helpers).
- Order status lifecycle: `PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED`.
- Gear browsing filters (search, category, price range, sort, page) live in URL search params, not component state — keep new filters URL-driven so they stay shareable/bookmarkable.
- `src/lib/types.ts` holds shared TS interfaces/API types (e.g. `User`, `GearItem`) — extend these rather than redefining shapes locally.
