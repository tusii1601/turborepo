# URL Shortener Monorepo

A production-quality URL shortener built with Turborepo, Next.js, Prisma, and Auth.js.

## Project Structure

```
url-shortener-monorepo/
├── apps/
│   ├── web/              # Public URL shortener website
│   ├── dashboard/        # Authenticated user dashboard
│   └── admin/            # Admin-only dashboard
├── packages/
│   ├── ui/               # Shared React UI components
│   ├── auth/             # Authentication configuration
│   ├── database/         # Prisma ORM & database client
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configuration
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
└── .env.example
```

## Technology Stack

- **Turborepo** - Monorepo management
- **pnpm** - Package manager with workspace support
- **Next.js 15** - React framework with App Router
- **TypeScript** - Strict type checking
- **Prisma** - ORM for database management
- **PostgreSQL** - Database
- **Auth.js** - Authentication (email, Google, GitHub)
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library
- **Zod** - Schema validation
- **React Hook Form** - Form management

## Features (Planned)

### Web App (Public)
- URL shortening with custom slugs
- Expiration settings (10min, 1h, 1d, 7d, 30d, never)
- Anonymous and authenticated URL creation
- QR code generation
- Link preview

### Dashboard (Authenticated Users)
- View all user links
- Analytics (clicks, referrers, devices)
- Edit/delete links
- Copy to clipboard
- Link expiration management

### Admin Panel (Admin Users Only)
- User management
- System analytics
- Link moderation
- Admin settings

## Prerequisites

- Node.js 18+
- pnpm 9+
- PostgreSQL 14+

## Getting Started

### 1. Install pnpm (if needed)

```bash
npm install -g pnpm@9.12.0
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio
```

### 5. OAuth Setup (Optional)

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable OAuth 2.0
4. Create credentials (Web application)
5. Add redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

#### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env`

## Development Commands

```bash
# Start all dev servers in parallel
pnpm dev

# Build all packages and apps
pnpm build

# Run linting
pnpm lint

# Type checking
pnpm typecheck

# Format code
pnpm format

# Database commands
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Prisma Studio
```

## Application URLs (Development)

- **Web app**: http://localhost:3000
- **Dashboard**: http://localhost:3001
- **Admin**: http://localhost:3002
- **Prisma Studio**: http://localhost:5555

## Architecture Overview

### Shared Packages

**@repo/database**
- Prisma schema definition
- Exported Prisma client for all apps
- Database migrations and types

**@repo/auth**
- NextAuth/Auth.js configuration
- Authentication providers setup
- Authorization helpers (`requireUser`, `requireAdmin`)

**@repo/ui**
- Reusable React components
- Tailwind CSS configuration
- Design system components

**@repo/types**
- Shared TypeScript interfaces
- Type definitions used across apps

**@repo/config**
- ESLint configuration
- Shared TypeScript settings

### Applications

Each app (`web`, `dashboard`, `admin`) is a separate Next.js application that:
- Uses the shared packages
- Has its own routes and pages
- Runs on a separate port
- Can be deployed independently

## Development Workflow

1. **Create a feature branch**: `git checkout -b feature/my-feature`
2. **Make changes** in apps or packages
3. **Test changes**: `pnpm dev`
4. **Commit changes**: `git commit -am "feat: add feature"`
5. **Create pull request**

## Security

- Passwords are hashed with bcrypt
- All routes are protected server-side
- Environment variables are not exposed to client
- User ownership is verified on all operations
- Input validation with Zod

## Deployment

The monorepo can be deployed to Vercel with:
1. Each app as a separate Vercel project
2. Shared packages automatically included
3. Environment variables configured in Vercel dashboard

## Learning Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Auth.js Docs](https://authjs.dev)

## License

MIT

## Authors

This monorepo is built with education in mind for learning Turborepo, Next.js, Prisma, and modern authentication patterns.