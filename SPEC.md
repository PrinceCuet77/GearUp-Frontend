# Reviews API Documentation

Base path: `/api/reviews`

All endpoints require authentication via the `accessToken` cookie or an `Authorization: Bearer <token>` header, and are restricted to the `CUSTOMER` role.

---

## 1. Get My Reviews

`GET /api/reviews`

Returns a paginated list of the authenticated customer's reviews — one row per rental order (a review is written once per rental order but stored as one `Review` row per gear item in that order; this endpoint collapses those back to one representative row per order).

**Auth:** `CUSTOMER`

### Query Parameters

| Field       | Type   | Required | Default     | Description                                                              |
| ----------- | ------ | -------- | ----------- | ------------------------------------------------------------------------ |
| `page`      | number | No       | `1`         | Page number (min 1)                                                      |
| `limit`     | number | No       | `10`        | Items per page (min 1, max 100)                                          |
| `search`    | string | No       | –           | Case-insensitive search over the review `comment` and the gear item name |
| `sortBy`    | string | No       | `createdAt` | `createdAt` \| `rating`                                                  |
| `sortOrder` | string | No       | `desc`      | `asc` \| `desc`                                                          |

`search` matches if either the review's `comment` **or** the reviewed gear item's `name` contains the term (case-insensitive). `sortBy=rating` sorts pages of results by star rating instead of recency; combine with `sortOrder=asc` to surface lowest-rated reviews first.

### Request Examples

```
GET /api/reviews?search=tent&sortBy=rating&sortOrder=desc
GET /api/reviews?page=2&limit=5
```

### Response (200)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "id": "r-1a2b3c",
        "rating": 5,
        "comment": "Great tent, kept us dry the whole trip",
        "createdAt": "2026-08-01T10:00:00.000Z",
        "updatedAt": "2026-08-01T10:00:00.000Z",
        "customerId": "u-123",
        "gearItemId": "g-456",
        "rentalOrderId": "o-789",
        "gearItem": {
          "id": "g-456",
          "name": "4-Person Camping Tent"
        },
        "rentalOrder": {
          "id": "o-789",
          "status": "RETURNED"
        }
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Errors

| Status | Message      | Cause          |
| ------ | ------------ | -------------- |
| 401    | Unauthorized | No valid token |

---

## 2. Get Review By ID

`GET /api/reviews/:reviewId`

Returns a single review owned by the authenticated customer.

**Auth:** `CUSTOMER`

### Response (200)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Review retrieved successfully",
  "data": {
    "id": "r-1a2b3c",
    "rating": 5,
    "comment": "Great tent, kept us dry the whole trip",
    "createdAt": "2026-08-01T10:00:00.000Z",
    "updatedAt": "2026-08-01T10:00:00.000Z",
    "customerId": "u-123",
    "gearItemId": "g-456",
    "rentalOrderId": "o-789",
    "customer": { "id": "u-123", "name": "Jane Doe", "email": "jane@example.com" },
    "gearItem": { "id": "g-456", "name": "4-Person Camping Tent" },
    "rentalOrder": { "id": "o-789", "status": "RETURNED" }
  }
}
```

### Errors

| Status | Message                                          | Cause                          |
| ------ | ------------------------------------------------- | ------------------------------- |
| 401    | Unauthorized                                      | No valid token                  |
| 403    | You are not authorized to view this review        | Review belongs to another user  |
| 404    | Review not found                                  | `reviewId` doesn't exist        |

---

## 3. Create Review

`POST /api/reviews`

Creates a review for every gear item in a returned rental order (same `rating`/`comment` applied to each item).

**Auth:** `CUSTOMER`

### Request Body

| Field           | Type   | Required | Description                                        |
| --------------- | ------ | -------- | --------------------------------------------------- |
| `rentalOrderId` | string | Yes      | ID of the rental order being reviewed              |
| `rating`        | number | Yes      | Integer, 1–5                                        |
| `comment`       | string | Yes      | 1–1000 characters                                   |

### Request Example

```json
{
  "rentalOrderId": "o-789",
  "rating": 5,
  "comment": "Great tent, kept us dry the whole trip"
}
```

### Response (201)

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review created successfully for all gear items",
  "data": {
    "id": "r-1a2b3c",
    "rating": 5,
    "comment": "Great tent, kept us dry the whole trip",
    "customer": { "id": "u-123", "name": "Jane Doe", "email": "jane@example.com", "avatarUrl": null },
    "gearItem": { "id": "g-456", "name": "4-Person Camping Tent" },
    "rentalOrder": { "id": "o-789", "status": "RETURNED" }
  }
}
```

### Errors

| Status | Message                                                     | Cause                                          |
| ------ | ------------------------------------------------------------ | ------------------------------------------------ |
| 400    | You can only review after the order has been returned        | Order status isn't `RETURNED`                    |
| 400    | This rental order has no gear items to review                 | Order has zero items                              |
| 400    | You have already reviewed this rental order                   | Duplicate review for the same order               |
| 401    | Unauthorized                                                 | No valid token                                    |
| 403    | You are not authorized to review this rental order            | Order belongs to another customer                 |
| 404    | Rental order not found                                       | `rentalOrderId` doesn't exist                     |

---

## 4. Update Review

`PATCH /api/reviews/:reviewId`

Updates `rating` and/or `comment` on all review rows tied to the same rental order (keeps them in sync since they represent one logical review).

**Auth:** `CUSTOMER`

### Request Body

| Field     | Type   | Required | Description                     |
| --------- | ------ | -------- | -------------------------------- |
| `rating`  | number | No       | Integer, 1–5                     |
| `comment` | string | No       | 1–100 characters                 |

At least one field should be provided.

### Response (200)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Review updated successfully",
  "data": {
    "id": "r-1a2b3c",
    "rating": 4,
    "comment": "Updated: still great but a bit heavy",
    "customer": { "id": "u-123", "name": "Jane Doe", "email": "jane@example.com" },
    "gearItem": { "id": "g-456", "name": "4-Person Camping Tent" },
    "rentalOrder": { "id": "o-789", "status": "RETURNED" }
  }
}
```

### Errors

| Status | Message                                            | Cause                          |
| ------ | ---------------------------------------------------- | -------------------------------- |
| 401    | Unauthorized                                         | No valid token                   |
| 403    | You are not authorized to update this review         | Review belongs to another user   |
| 404    | Review not found                                     | `reviewId` doesn't exist         |

---

## 5. Delete Review

`DELETE /api/reviews/:reviewId`

Deletes all review rows tied to the same rental order.

**Auth:** `CUSTOMER`

### Response (200)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Review deleted successfully",
  "data": null
}
```

### Errors

| Status | Message                                            | Cause                          |
| ------ | ---------------------------------------------------- | -------------------------------- |
| 401    | Unauthorized                                         | No valid token                   |
| 403    | You are not authorized to delete this review         | Review belongs to another user   |
| 404    | Review not found                                     | `reviewId` doesn't exist         |
