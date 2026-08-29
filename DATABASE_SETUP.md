# Database Setup & Migration Guide

## Prerequisites

- PostgreSQL 14+ installed and running
- pnpm installed
- Node.js 18+

## Setup Steps

### 1. Create PostgreSQL Database

```bash
# Using psql
psql -U postgres

# Inside psql:
CREATE DATABASE url_shortener_dev;
CREATE USER url_shortener WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE url_shortener_dev TO url_shortener;
\q
```

Or using Docker:

```bash
docker run --name postgres-db \
  -e POSTGRES_DB=url_shortener_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and set DATABASE_URL:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/url_shortener_dev"
```

### 3. Generate Prisma Client

```bash
pnpm db:generate
```

This generates the TypeScript Prisma client based on the schema.

### 4. Run Migrations

```bash
# Create initial migration and apply it
pnpm db:migrate
```

When prompted, give the migration a name like "init"

### 5. Verify Setup

```bash
# Open Prisma Studio to view your database
pnpm db:studio
```

This opens a visual database browser at http://localhost:5555

## Migrations

### Create a Migration

After modifying `prisma/schema.prisma`:

```bash
pnpm db:migrate
```

This will:
1. Create a SQL migration file
2. Apply it to your database
3. Regenerate the Prisma client

### View Migrations

```bash
# List all migrations
ls packages/database/prisma/migrations/
```

### Reset Database (Development Only)

```bash
# ⚠️ WARNING: This deletes all data
pnpm db:push --force-reset
```

## Deployment

### Production Database Setup

1. Create a PostgreSQL instance (Heroku, AWS RDS, etc.)
2. Set `DATABASE_URL` to production database
3. Run migrations:

```bash
pnpm db:migrate deploy
```

## Troubleshooting

### Connection Refused
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Check firewall settings

### Migration Conflicts
```bash
# Reset local database
pnpm db:push --force-reset

# Re-run migrations
pnpm db:migrate
```

### Schema Out of Sync
```bash
# Regenerate client
pnpm db:generate

# Check schema status
npx prisma migrate status
```
