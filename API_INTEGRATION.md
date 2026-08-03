# API Integration Guide

> Mapping of frontend components/actions to backend endpoints.
> All endpoints use `process.env.BACKEND_API_URL` as the base URL.
> Authentication is handled via httpOnly cookies (`accessToken`, `refreshToken`).

---

## Authentication

| Method          | Endpoint             | Frontend File                                   | Description                                                          |
| --------------- | -------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| `POST`          | `/api/auth/login`    | `src/app/(auth)/_actions/loginActions.ts`       | Authenticates user, sets access & refresh tokens in httpOnly cookies |
| `POST`          | `/api/auth/register` | `src/app/(auth)/_actions/registerActions.ts`    | Registers a new user with email, password, and role                  |
| `GET`           | `/api/user/me`       | `src/app/(auth)/_actions/getProfileActions.ts`  | Fetches the authenticated user's profile                             |
| `POST`          | `/api/auth/refresh`  | `src/app/(auth)/_actions/refreshTokenAction.ts` | Refreshes an expired access token using the refresh token cookie     |
| _(no endpoint)_ | _(client-side only)_ | `src/app/(auth)/_actions/logoutActions.ts`      | Clears cookies and revalidates cache                                 |

**Related Components:**

- `src/app/(auth)/login/page.tsx` — Login form
- `src/app/(auth)/register/page.tsx` — Registration form
- `src/components/Navbar.tsx` — Logout via `logoutAction()` + `clearUser()`
- `src/components/UserInitializer.tsx` — Syncs server profile into Zustand store
- `src/store/useAuthStore.ts` — Zustand auth store (client-side state)

---

## Admin Dashboard

| Method | Endpoint               | Frontend File                                                  | Description                                                                            |
| ------ | ---------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `GET`  | `/api/admin/dashboard` | `src/app/(dashboards)/admin/_actions/getAdminDashboardInfo.ts` | Fetches admin dashboard stats (totalUsers, activeGears, totalRentals, totalCategories) |

**Related Components:**

- `src/app/(dashboards)/admin/page.tsx` — Admin dashboard overview
- `src/components/dashboard/StatsCard.tsx` — Displays individual stats

---

## Admin — Categories

| Method  | Endpoint                            | Frontend File                                                      | Description                               |
| ------- | ----------------------------------- | ------------------------------------------------------------------ | ----------------------------------------- |
| `POST`  | `/api/admin/categories`             | `src/app/(dashboards)/admin/categories/_actions/createCategory.ts` | Creates a new category                    |
| `PATCH` | `/api/admin/categories/:categoryId` | `src/app/(dashboards)/admin/categories/_actions/updateCategory.ts` | Updates a category's name and description |

**Related Components:**

- `src/app/(dashboards)/admin/categories/page.tsx` — Category management page
- `src/app/(dashboards)/admin/categories/_components/` — Category form/modal components

---

## Admin — Gears

| Method | Endpoint           | Frontend File                                                      | Description                                                                                |
| ------ | ------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `GET`  | `/api/admin/gears` | `src/app/(dashboards)/admin/gears/_actions/getAllGearsForAdmin.ts` | Lists all gears with optional filters (category, price range, search, pagination, sorting) |

**Related Components:**

- `src/app/(dashboards)/admin/gears/page.tsx` — Admin gear listing

---

## Admin — Users

| Method  | Endpoint                         | Frontend File                                                   | Description                                                                       |
| ------- | -------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `GET`   | `/api/admin/users`               | `src/app/(dashboards)/admin/users/_actions/getAllUsers.ts`      | Lists all users with optional filters (search, role, status, pagination, sorting) |
| `PATCH` | `/api/admin/user/:userId/status` | `src/app/(dashboards)/admin/users/_actions/changeUserStatus.ts` | Toggles a user's status between `SUSPENDED` and `ACTIVE`                          |

**Related Components:**

- `src/app/(dashboards)/admin/users/page.tsx` — User management page

---

## Customer Dashboard

| Method | Endpoint              | Frontend File                                                        | Description                     |
| ------ | --------------------- | -------------------------------------------------------------------- | ------------------------------- |
| `GET`  | `/api/user/dashboard` | `src/app/(dashboards)/customer/_actions/getCustomerDashboardInfo.ts` | Fetches customer dashboard info |

**Related Components:**

- `src/app/(dashboards)/customer/page.tsx` — Customer dashboard overview
- `src/app/(dashboards)/customer/_components/` — Dashboard UI components

---

## Customer — Profile

| Method  | Endpoint                | Frontend File                                                              | Description                              |
| ------- | ----------------------- | -------------------------------------------------------------------------- | ---------------------------------------- |
| `PATCH` | `/api/user/me`          | `src/app/(dashboards)/customer/profile/_actions/updateProfile.ts`          | Updates the user's name and/or avatarUrl |
| `PATCH` | `/api/user/me/password` | `src/app/(dashboards)/customer/change-password/_actions/passwordChange.ts` | Changes the user's password (old + new)  |

**Related Components:**

- `src/app/(dashboards)/customer/profile/page.tsx` — Profile view/edit
- `src/app/(dashboards)/customer/change-password/page.tsx` — Password change form
- `src/components/dashboard/ProfileContent.tsx` — Profile display
- `src/components/dashboard/ChangePasswordForm.tsx` — Password form

---

## Customer — Rental Orders

| Method  | Endpoint                        | Frontend File                                                                       | Description                                                                   |
| ------- | ------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `POST`  | `/api/rentals`                  | `src/app/(public)/gears/[id]/_actions/createRentalOrder.ts`                         | Creates a new rental order (startDate, endDate, items[])                      |
| `GET`   | `/api/rentals`                  | `src/app/(dashboards)/customer/rental-orders/_actions/getAllRentalOrders.ts`        | Lists all rental orders for the current customer (pagination & status filter) |
| `GET`   | `/api/rentals/:rentalId`        | `src/app/(dashboards)/customer/rental-orders/[id]/_actions/getSingleRentalOrder.ts` | Fetches a single rental order by ID                                           |
| `PATCH` | `/api/rentals/:rentalId/cancel` | `src/app/(dashboards)/customer/rental-orders/[id]/_actions/cancelRentalOrder.ts`    | Cancels a rental order                                                        |
| `PATCH` | `/api/rentals/:rentalId/return` | `src/app/(dashboards)/customer/rental-orders/[id]/_actions/returnRentalOrder.ts`    | Marks a rental order as returned                                              |

**Related Components:**

- `src/app/(dashboards)/customer/rental-orders/page.tsx` — Rental orders listing
- `src/app/(public)/gears/[id]/` — Gear detail page (creates rental order)
- `src/components/dashboard/StatusBadge.tsx` — Order status display
- `src/components/dashboard/UpdateOrderStatusModal.tsx` — Status update modal
- `src/store/useRentalStore.ts` — Client-side rental state

---

## Customer — Payments

| Method | Endpoint               | Frontend File                                                                | Description                                                                  |
| ------ | ---------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `GET`  | `/api/payments`        | `src/app/(dashboards)/customer/payments/_actions/getAllPayments.ts`          | Lists all payments for the current customer (pagination & status filter)     |
| `POST` | `/api/payments/create` | `src/app/(dashboards)/customer/rental-orders/[id]/_actions/createPayment.ts` | Creates a payment for a rental order (returns `gatewayPageURL` for redirect) |

**Related Components:**

- `src/app/(dashboards)/customer/payments/page.tsx` — Payments listing

---

## Customer — Reviews

| Method   | Endpoint                 | Frontend File                                                               | Description                                                                |
| -------- | ------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `GET`    | `/api/reviews`           | `src/app/(dashboards)/customer/reviews/_actions/getAllReviews.ts`           | Lists all reviews for the current customer (pagination)                    |
| `POST`   | `/api/reviews`           | `src/app/(dashboards)/customer/reviews/_actions/createReview.ts`            | Creates a review (rating, comment, gearItemId, rentalOrderId)              |
| `POST`   | `/api/reviews`           | `src/app/(dashboards)/customer/rental-orders/[id]/_actions/createReview.ts` | Creates a review from rental order detail (rating, comment, rentalOrderId) |
| `PATCH`  | `/api/reviews/:reviewId` | `src/app/(dashboards)/customer/reviews/_actions/updateReview.ts`            | Updates a review's rating and/or comment                                   |
| `DELETE` | `/api/reviews/:reviewId` | `src/app/(dashboards)/customer/reviews/_actions/deleteReview.ts`            | Deletes a review by ID                                                     |

**Related Components:**

- `src/app/(dashboards)/customer/reviews/page.tsx` — Reviews listing
- `src/components/dashboard/ReviewFormModal.tsx` — Review create/edit modal

---

## Provider Dashboard

| Method | Endpoint                  | Frontend File                                                        | Description                     |
| ------ | ------------------------- | -------------------------------------------------------------------- | ------------------------------- |
| `GET`  | `/api/provider/dashboard` | `src/app/(dashboards)/provider/_actions/getProviderDashboardInfo.ts` | Fetches provider dashboard info |

**Related Components:**

- `src/app/(dashboards)/provider/page.tsx` — Provider dashboard overview

---

## Provider — Profile

| Method  | Endpoint                | Frontend File                                                              | Description                              |
| ------- | ----------------------- | -------------------------------------------------------------------------- | ---------------------------------------- |
| `PATCH` | `/api/user/me`          | `src/app/(dashboards)/provider/profile/_actions/updateProfile.ts`          | Updates provider's name and/or avatarUrl |
| `PATCH` | `/api/user/me/password` | `src/app/(dashboards)/provider/change-password/_actions/passwordChange.ts` | Changes the provider's password          |

**Related Components:**

- `src/app/(dashboards)/provider/profile/page.tsx` — Profile page
- `src/app/(dashboards)/provider/change-password/page.tsx` — Password change

---

## Provider — Gears

| Method   | Endpoint                      | Frontend File                                                                     | Description                                                   |
| -------- | ----------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `POST`   | `/api/provider/gears`         | `src/app/(dashboards)/provider/gears/_actions/createGear.ts`                      | Creates a new gear item                                       |
| `GET`    | `/api/provider/gears`         | `src/app/(dashboards)/provider/gears/_actions/getSelfListedAllGearsByProvider.ts` | Lists the provider's own gears (pagination, filters, sorting) |
| `PATCH`  | `/api/provider/gears/:gearId` | `src/app/(dashboards)/provider/gears/_actions/updateGearById.ts`                  | Updates a gear item                                           |
| `DELETE` | `/api/provider/gears/:gearId` | `src/app/(dashboards)/provider/gears/_actions/deleteGear.ts`                      | Deletes a gear item                                           |
| `GET`    | `/api/categories`             | `src/app/(dashboards)/provider/gears/_actions/getCategories.ts`                   | Fetches all categories (used in gear creation form)           |

**Related Components:**

- `src/app/(dashboards)/provider/gears/page.tsx` — Provider gear listing
- `src/components/dashboard/GearForm.tsx` — Gear create/edit form

---

## Provider — Rental Orders

| Method  | Endpoint                         | Frontend File                                                                           | Description                                                                         |
| ------- | -------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `GET`   | `/api/provider/orders`           | `src/app/(dashboards)/provider/rental-orders/_actions/getAllRentalOrdersForProvider.ts` | Lists all rental orders involving the provider's gears (pagination & status filter) |
| `PATCH` | `/api/provider/orders/:rentalId` | `src/app/(dashboards)/provider/rental-orders/_actions/updateRentalOrderForProvider.ts`  | Updates a rental order's status (approve, ship, etc.)                               |

**Related Components:**

- `src/app/(dashboards)/provider/rental-orders/page.tsx` — Provider order listing
- `src/components/dashboard/UpdateOrderStatusModal.tsx` — Status update modal

---

## Public — Gears & Categories

| Method | Endpoint                     | Frontend File                                                             | Description                                                                   |
| ------ | ---------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `GET`  | `/api/categories`            | `src/app/(public)/_actions/getAllCategories.ts`                           | Fetches all categories (public browsing)                                      |
| `GET`  | `/api/gears`                 | `src/app/(public)/_actions/getAllGears.ts`                                | Lists gears with filters (category, price range, search, pagination, sorting) |
| `GET`  | `/api/gears/:gearId`         | `src/app/(public)/gears/[id]/_actions/getSingleGear.ts`                   | Fetches a single gear item by ID                                              |
| `GET`  | `/api/gears/:gearId/reviews` | `src/app/(public)/gears/[id]/reviews/_actions/getReviewsForSingleGear.ts` | Fetches reviews for a specific gear item (pagination & sorting)               |

**Related Components:**

- `src/app/(public)/page.tsx` — Homepage
- `src/app/(public)/gears/page.tsx` — Gear browsing page
- `src/app/(public)/gears/[id]/page.tsx` — Gear detail page
- `src/app/(public)/_components/GearBrowseContent.tsx` — Gear browsing UI
- `src/app/(public)/_components/GearCard.tsx` — Gear card component
- `src/app/(public)/_components/GearFilters.tsx` — Filter sidebar
- `src/app/(public)/_components/AddToCartModal.tsx` — Add to cart modal
- `src/components/cart/CartSidebar.tsx` — Cart sidebar
- `src/store/useCartStore.ts` — Client-side cart state

---

## Endpoint Summary

| Method     | Count | Endpoints                                                                                                                                                                                                                                                                                                                         |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GET**    | 18    | `/api/user/me`, `/api/admin/dashboard`, `/api/admin/gears`, `/api/admin/users`, `/api/user/dashboard`, `/api/payments`, `/api/rentals`, `/api/rentals/:id`, `/api/reviews`, `/api/provider/dashboard`, `/api/provider/gears`, `/api/provider/orders`, `/api/categories`, `/api/gears`, `/api/gears/:id`, `/api/gears/:id/reviews` |
| **POST**   | 8     | `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, `/api/admin/categories`, `/api/rentals`, `/api/payments/create`, `/api/reviews`, `/api/provider/gears`                                                                                                                                                              |
| **PATCH**  | 9     | `/api/admin/categories/:id`, `/api/admin/user/:id/status`, `/api/user/me`, `/api/user/me/password`, `/api/rentals/:id/cancel`, `/api/rentals/:id/return`, `/api/reviews/:id`, `/api/provider/gears/:id`, `/api/provider/orders/:id`                                                                                               |
| **DELETE** | 2     | `/api/reviews/:reviewId`, `/api/provider/gears/:gearId`                                                                                                                                                                                                                                                                           |

---

## Architecture Notes

- **Base URL**: All requests use `process.env.BACKEND_API_URL` (server-side only, never exposed to client).
- **Auth Pattern**: httpOnly cookies (`accessToken`, `refreshToken`) set on login, included via `Cookie` header in server actions.
- **Server Actions**: All API calls are made through Next.js server actions in `_actions/` directories, following the pattern: try/catch, return `{ success, message, data }`, never throw.
- **Token Refresh**: `src/proxy.ts` middleware calls `refreshTokenAction()` for expired tokens and redirects based on user role.
- **Client Stores**: `useAuthStore`, `useCartStore`, `useRentalStore` are Zustand stores for client-side state — they contain no direct API calls.
