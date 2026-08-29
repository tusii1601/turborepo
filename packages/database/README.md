# Database setup instructions

The database package contains:

## Files:
- prisma/schema.prisma: Database schema definition
- src/client.ts: Prisma client singleton
- src/validation.ts: URL and slug validation helpers, expiration utilities
- src/index.ts: Exports all database utilities

## Models:
1. User - User accounts with roles (USER, ADMIN)
2. Account - OAuth provider accounts (NextAuth)
3. Session - Session management (NextAuth)
4. VerificationToken - Email verification tokens
5. ShortLink - Shortened URLs with analytics
6. Click - Click tracking and analytics
7. Role - User role enum (USER, ADMIN)

## Key Features:
- Automatic timestamps (createdAt, updatedAt)
- Cascade deletes for data integrity
- Indexes on frequently queried fields
- Support for nullable user IDs (anonymous links)
- Expiration tracking for short links
- Click analytics with device/referrer tracking

## Setup:
1. Create PostgreSQL database
2. Set DATABASE_URL in .env.local
3. Run: pnpm db:generate
4. Run: pnpm db:migrate
5. Database will be ready for use
