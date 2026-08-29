#!/bin/bash

# Database Setup Script for URL Shortener

set -e

echo "🚀 Starting URL Shortener Database Setup..."

# Check if .env file exists
if [ ! -f .env ]; then
  echo "❌ .env file not found!"
  echo "Please copy .env.example to .env and configure your database URL"
  exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo "📦 Installing dependencies..."
pnpm install

echo "🗄️  Generating Prisma Client..."
pnpm db:generate

echo "🔄 Running database migrations..."
pnpm db:migrate

echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your OAuth credentials"
echo "2. Run 'pnpm dev' to start development servers"
echo "3. Visit http://localhost:3000 for the web app"
