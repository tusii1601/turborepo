# Testing Guide

## Overview

Comprehensive testing strategy for the URL Shortener application.

## Unit Tests

### Database Validation

```bash
# Test validation functions
pnpm test --filter @repo/database
```

Tests cover:
- URL validation
- Slug validation
- Expiration calculations
- Link expiration checking
- Slug generation

### Auth Package

```bash
pnpm test --filter @repo/auth
```

Tests cover:
- Password strength validation
- Password hashing
- Authorization checks
- Admin role verification

## Integration Tests

### API Endpoints

```bash
pnpm test:integration --filter @repo/web
```

Test scenarios:
- Create short link
- Redirect and click tracking
- Link expiration validation
- Authorization checks
- Rate limiting

### Database Operations

```bash
# Test database transactions
pnpm test:db
```

Coverage:
- User creation
- Link creation
- Click tracking
- Cascade deletes
- Transaction rollback

## End-to-End Tests

### Authentication Flow

```bash
# Test login, signup, OAuth
pnpm test:e2e --spec=auth
```

Scenarios:
- Email/password login
- User registration
- Password validation
- OAuth login (Google/GitHub)
- Session persistence

### URL Shortening Flow

```bash
pnpm test:e2e --spec=shorten
```

Scenarios:
- Create short link
- Custom slug validation
- Expiration selection
- Link redirect
- Click tracking

### Dashboard Features

```bash
pnpm test:e2e --spec=dashboard
```

Scenarios:
- View links
- Delete links
- View analytics
- Update profile
- Settings management

### Admin Panel

```bash
pnpm test:e2e --spec=admin
```

Scenarios:
- View users
- View all links
- Delete users
- Delete links
- View analytics

## Performance Tests

### Load Testing

```bash
# Test shorten endpoint under load
ab -n 1000 -c 10 https://yourdomain.com/api/shorten
```

Success criteria:
- 200 requests/second
- < 500ms response time (p95)
- < 1% error rate

### Database Performance

```bash
# Test query performance
EXPLAIN ANALYZE SELECT * FROM "ShortLink" WHERE slug = 'abc123';
```

Indexes should be:
- slug (unique)
- userId (for user links query)
- expiresAt (for expiration cleanup)
- createdAt (for sorting)

## Security Tests

### Input Validation

```bash
# Test XSS prevention
curl -X POST https://yourdomain.com/api/shorten \
  -d '{"originalUrl":"<script>alert(1)</script>","customSlug":"xss"}'
```

Expected: 400 Bad Request

### SQL Injection

```bash
# Test Prisma protection
# Prisma prevents this automatically
curl -X POST https://yourdomain.com/api/shorten \
  -d '{"originalUrl":"http://test.com","customSlug":"1; DROP TABLE users;--"}'
```

Expected: 400 Bad Request (slug validation)

### Rate Limiting

```bash
# Test rate limit (10 requests per minute)
for i in {1..15}; do
  curl https://yourdomain.com/api/shorten \
    -d '{"originalUrl":"http://test.com"}'
done
```

Expected: 429 Too Many Requests after 10 requests

### Authorization

```bash
# Test unauthorized access
curl -X GET https://yourdomain.com/api/admin/stats
```

Expected: 401 Unauthorized

## Regression Tests

### Critical User Flows

Automated tests for:
1. User registration and email verification
2. Short link creation with all options
3. Link redirect and click tracking
4. Dashboard analytics display
5. Admin user management

### Database Integrity

- Foreign key constraints enforced
- Cascade deletes working
- Unique constraints on slugs
- Expiration cleanup jobs

## Deployment Verification

### Pre-Production Checklist

- [ ] All tests passing
- [ ] Build succeeds without warnings
- [ ] No console errors in browser
- [ ] Database migrations applied
- [ ] OAuth credentials configured
- [ ] Environment variables set
- [ ] Security headers configured
- [ ] Rate limiting working
- [ ] Logging configured

### Post-Deployment Tests

```bash
# Health check
curl https://yourdomain.com/health

# Create test link
curl -X POST https://yourdomain.com/api/shorten \
  -d '{"originalUrl":"https://www.example.com","customSlug":"test-link"}'

# Test redirect
curl -I https://yourdomain.com/s/test-link

# Verify dashboard
curl -H "Cookie: ..." https://yourdomain.com/dashboard/stats
```

## Monitoring in Production

### Key Metrics

```javascript
// Track in application
- Page load time
- API response time
- Error rate
- User count
- Links created
- Clicks tracked
- Admin actions
```

### Log Aggregation

Log all:
- API requests and responses
- Database queries (slow queries > 100ms)
- Authentication events
- Authorization failures
- Rate limit hits
- Errors and exceptions

### Alerts

Set up alerts for:
- Error rate > 1%
- Response time > 1000ms
- Database connection pool exhausted
- Disk space low
- Memory usage > 80%
- Rate limit abuse

## Test Maintenance

- Update tests quarterly
- Add tests for new features
- Remove tests for deprecated features
- Monitor test execution time
- Keep test data fresh and realistic
