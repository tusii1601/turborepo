# Production Deployment Guide

## Overview

This guide covers everything needed to deploy the URL Shortener monorepo to production.

## Environment Setup

### Prerequisites

- Node.js 18+
- pnpm 9.0+
- PostgreSQL 14+
- Redis (recommended for production rate limiting)
- GitHub OAuth App credentials
- Google OAuth App credentials (optional)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/url_shortener"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# OAuth Providers
GITHUB_ID="your_github_oauth_id"
GITHUB_SECRET="your_github_oauth_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Application
NODE_ENV="production"
```

### Database Setup

1. **Create PostgreSQL database:**
   ```bash
   createdb url_shortener
   ```

2. **Run migrations:**
   ```bash
   pnpm db:migrate
   ```

3. **Seed database (optional):**
   ```bash
   pnpm db:seed
   ```

## Build and Deployment

### Local Build

```bash
# Install dependencies
pnpm install

# Build all apps
pnpm build

# Start production server
pnpm start
```

### Docker Deployment

Create `Dockerfile` in root:

```dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000 3001 3002

CMD ["pnpm", "start"]
```

### Vercel Deployment

1. **Connect repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Configure build settings:**
   - Build command: `pnpm build`
   - Install command: `pnpm install --frozen-lockfile`
   - Output directory: `.next`

### Railway/Render Deployment

1. **Connect repository**
2. **Set environment variables**
3. **Configure commands:**
   - Build: `pnpm install && pnpm build`
   - Start: `pnpm start`
4. **Connect PostgreSQL service**

## Running Applications

### Web App (Port 3000)
```bash
pnpm dev --filter @repo/web
```

### Dashboard App (Port 3001)
```bash
pnpm dev --filter @repo/dashboard
```

### Admin App (Port 3002)
```bash
pnpm dev --filter @repo/admin
```

## Production Checks

### Security
- [ ] HTTPS enabled on all domains
- [ ] Environment secrets configured
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] SQL injection protection (Prisma/Zod)
- [ ] XSS protection (React/Next.js)
- [ ] CSRF protection (NextAuth)

### Performance
- [ ] Database indexes applied
- [ ] Connection pooling configured
- [ ] Caching enabled (Redis)
- [ ] Static assets optimized
- [ ] Images optimized
- [ ] Bundle analyzed and optimized

### Monitoring
- [ ] Error tracking (Sentry/LogRocket)
- [ ] Performance monitoring (Vercel/New Relic)
- [ ] Database monitoring
- [ ] Application logs aggregation
- [ ] Uptime monitoring

## Troubleshooting

### Database Connection Errors
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check migrations
pnpm db:status
```

### OAuth Not Working
- Verify `NEXTAUTH_URL` matches deployment domain
- Check OAuth app callback URLs in GitHub/Google console
- Verify secrets are correctly configured

### Build Failures
```bash
# Clear build cache
rm -rf .next
pnpm clean

# Rebuild
pnpm build
```

## Maintenance

### Database Backups
```bash
# Daily backup to S3
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Log Rotation
Configure log rotation in systemd or Docker:
```bash
# Systemd service with log rotation
journalctl --unit=url-shortener --vacuum-time=30d
```

### Updates and Patches
```bash
# Check outdated dependencies
pnpm outdated

# Update dependencies safely
pnpm update
```

## Scaling Considerations

### Horizontal Scaling
- Stateless application design
- Session storage in database
- Use Redis for rate limiting across instances
- Load balancer for traffic distribution

### Database Optimization
- Connection pooling (PgBouncer)
- Read replicas for analytics queries
- Archive old click data
- Regular VACUUM and ANALYZE

### Caching Strategy
- Redis for session storage
- Browser caching for static assets
- Database query caching for analytics
- CDN for static files

## Rollback Procedures

```bash
# Rollback database migration
pnpm db:rollback

# Rollback deployment
# Use platform's built-in rollback (Vercel, Railway, etc.)

# Check current version
git log --oneline -1
```

## Performance Metrics

Target metrics for production:
- Page load time: < 2s
- API response time: < 200ms
- Database query time: < 100ms
- Error rate: < 0.1%
- Uptime: > 99.9%

## Support and Troubleshooting

For issues:
1. Check application logs
2. Verify environment configuration
3. Check database connectivity
4. Review error tracking platform
5. Check GitHub issues for known problems
