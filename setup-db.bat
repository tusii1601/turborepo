@echo off
REM Database Setup Script for URL Shortener (Windows)

setlocal enabledelayedexpansion

echo 🚀 Starting URL Shortener Database Setup...

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found!
    echo Please copy .env.example to .env and configure your database URL
    exit /b 1
)

echo 📦 Installing dependencies...
call pnpm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo 🗄️  Generating Prisma Client...
call pnpm db:generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma Client
    exit /b 1
)

echo 🔄 Running database migrations...
call pnpm db:migrate
if errorlevel 1 (
    echo ❌ Failed to run migrations
    exit /b 1
)

echo ✅ Database setup complete!
echo.
echo Next steps:
echo 1. Update .env with your OAuth credentials
echo 2. Run 'pnpm dev' to start development servers
echo 3. Visit http://localhost:3000 for the web app
