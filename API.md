# API Documentation

## Overview

Complete API documentation for the URL Shortener application.

## Authentication

All authenticated endpoints require a valid session cookie (managed by NextAuth).

### Public Endpoints
- `POST /api/shorten` - Create short link (rate limited)
- `GET /s/[slug]` - Redirect and track click

### User Endpoints
- All `/api/dashboard/` endpoints

### Admin Endpoints
- All `/api/admin/` endpoints

## API Endpoints

### URL Shortening

#### Create Short Link
```
POST /api/shorten
Content-Type: application/json

{
  "originalUrl": "https://www.example.com/very/long/url",
  "customSlug": "my-link",  // optional, 3-20 chars, a-z0-9-
  "expirationMinutes": 1440  // optional, minutes until expiration
}

Response 201:
{
  "slug": "abc123",
  "originalUrl": "https://www.example.com/very/long/url",
  "expiresAt": "2024-09-15T12:00:00Z",
  "shortUrl": "https://yourdomain.com/s/abc123"
}

Response 400: Invalid input
{
  "error": "URL must be a valid HTTP/HTTPS URL"
}

Response 429: Rate limited
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

#### Redirect and Track Click
```
GET /s/[slug]

Response 302: Redirect to original URL
Location: https://www.example.com/very/long/url

Note: Click is automatically tracked with:
- User agent
- Referrer
- IP address
- Device type
- Timestamp
```

### Dashboard

#### Get User Statistics
```
GET /api/dashboard/stats
Authorization: Required (user session)

Response 200:
{
  "totalLinks": 42,
  "activeLinks": 38,
  "totalClicks": 1250
}
```

#### Get User Links
```
GET /api/dashboard/links
Authorization: Required (user session)

Response 200:
[
  {
    "id": "uuid",
    "slug": "abc123",
    "originalUrl": "https://example.com",
    "clickCount": 150,
    "createdAt": "2024-08-15T10:30:00Z",
    "expiresAt": "2024-09-15T10:30:00Z",
    "isActive": true
  }
]
```

#### Delete User Link
```
DELETE /api/dashboard/links/[id]
Authorization: Required (link owner)

Response 200:
{
  "message": "Link deleted"
}

Response 403: Not authorized
{
  "error": "Link not found or unauthorized"
}
```

#### Update Link
```
PATCH /api/dashboard/links/[id]/edit
Authorization: Required (link owner)
Content-Type: application/json

{
  "isActive": false,  // optional
  "expiresAt": "2024-12-31T23:59:59Z"  // optional, ISO 8601 format
}

Response 200:
{
  "id": "uuid",
  "slug": "abc123",
  "isActive": false,
  "expiresAt": "2024-12-31T23:59:59Z",
  ...
}

Response 400: Invalid input
{
  "error": "Invalid input",
  "details": [...]
}
```

#### Get Link Analytics
```
GET /api/dashboard/links/[id]/analytics
Authorization: Required (link owner)

Response 200:
{
  "link": {
    "id": "uuid",
    "slug": "abc123",
    "originalUrl": "https://example.com",
    "clickCount": 150,
    "isActive": true,
    "createdAt": "2024-08-15T10:30:00Z",
    "expiresAt": "2024-09-15T10:30:00Z"
  },
  "clicks": [
    {
      "id": "uuid",
      "userAgent": "Mozilla/5.0...",
      "referer": "https://twitter.com",
      "ipAddress": "192.168.1.1",
      "deviceType": "mobile",
      "createdAt": "2024-09-01T15:45:00Z"
    }
  ],
  "deviceBreakdown": {
    "mobile": 75,
    "desktop": 60,
    "tablet": 15
  },
  "topReferrers": [
    {
      "referrer": "twitter.com",
      "count": 45
    }
  ]
}
```

#### Get User Profile
```
GET /api/dashboard/profile
Authorization: Required (authenticated user)

Response 200:
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Update User Profile
```
PUT /api/dashboard/profile
Authorization: Required (authenticated user)
Content-Type: application/json

{
  "name": "Jane Doe"
}

Response 200:
{
  "id": "uuid",
  "name": "Jane Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Admin APIs

#### Get System Statistics
```
GET /api/admin/stats
Authorization: Required (admin role)

Response 200:
{
  "totalUsers": 1000,
  "totalLinks": 5000,
  "totalClicks": 100000,
  "inactiveLinks": 150
}
```

#### Get All Users
```
GET /api/admin/users
Authorization: Required (admin role)

Response 200:
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00Z",
    "_count": {
      "shortLinks": 42
    }
  }
]
```

#### Delete User
```
DELETE /api/admin/users/[id]
Authorization: Required (admin role)

Response 200:
{
  "message": "User deleted"
}

Note: Cascade deletes all user's links and clicks
```

#### Get All Links
```
GET /api/admin/links
Authorization: Required (admin role)

Response 200:
[
  {
    "id": "uuid",
    "slug": "abc123",
    "originalUrl": "https://example.com",
    "clickCount": 150,
    "isActive": true,
    "createdAt": "2024-08-15T10:30:00Z",
    "user": {
      "email": "john@example.com"
    }
  }
]
```

#### Delete Link (Admin)
```
DELETE /api/admin/links/[id]
Authorization: Required (admin role)

Response 200:
{
  "message": "Link deleted"
}
```

#### Get System Analytics
```
GET /api/admin/analytics
Authorization: Required (admin role)

Response 200:
{
  "topLinks": [
    {
      "slug": "viral-link",
      "clickCount": 10000
    }
  ],
  "topUsers": [
    {
      "email": "john@example.com",
      "linkCount": 100
    }
  ],
  "averageClicks": 20,
  "clicksPerDay": []
}
```

## Error Handling

All endpoints follow standard HTTP status codes:

- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Authorization failed
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limited
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "error": "Human-readable error message"
}
```

## Rate Limiting

The `/api/shorten` endpoint is rate limited:
- **Limit:** 10 requests per minute per IP
- **Response:** 429 Too Many Requests
- **Retry-After** header indicates seconds to wait

## Data Types

### ShortLink
```typescript
{
  id: string          // UUID
  slug: string        // 3-20 chars, a-z0-9-
  originalUrl: string // Valid HTTP/HTTPS URL
  userId: string      // UUID or null
  clickCount: number  // Integer >= 0
  isActive: boolean   // Link enabled/disabled
  expiresAt: Date | null  // Expiration datetime or never
  createdAt: Date     // Creation timestamp
}
```

### Click
```typescript
{
  id: string
  shortLinkId: string
  userAgent: string | null
  referer: string | null
  ipAddress: string | null
  deviceType: string  // "desktop", "mobile", "tablet"
  createdAt: Date
}
```

### User
```typescript
{
  id: string
  email: string
  name: string | null
  password: string | null  // null for OAuth users
  emailVerified: Date | null
  role: "USER" | "ADMIN"
  createdAt: Date
}
```
