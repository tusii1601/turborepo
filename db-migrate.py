#!/usr/bin/env python3
"""
Database migration helper script for development
Provides utilities for database setup and management
"""

import os
import subprocess
import sys

def run_command(cmd):
    """Run a shell command and return the output"""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"❌ Error: {result.stderr}")
        sys.exit(1)
    return result.stdout

def setup_database():
    """Setup the database"""
    print("🚀 Setting up database...")
    
    # Check if .env exists
    if not os.path.exists('.env'):
        print("❌ .env file not found!")
        print("Run: cp .env.example .env")
        return
    
    # Install dependencies
    print("📦 Installing dependencies...")
    run_command("pnpm install")
    
    # Generate Prisma Client
    print("🔧 Generating Prisma Client...")
    run_command("pnpm db:generate")
    
    # Run migrations
    print("🔄 Running migrations...")
    run_command("pnpm db:migrate")
    
    print("✅ Database setup complete!")

def reset_database():
    """Reset the database (development only)"""
    response = input("⚠️  This will delete all data. Continue? (yes/no): ")
    if response.lower() != 'yes':
        print("Cancelled.")
        return
    
    print("🔄 Resetting database...")
    run_command("pnpm db:push --force-reset")
    print("✅ Database reset complete!")

def open_studio():
    """Open Prisma Studio"""
    print("📊 Opening Prisma Studio...")
    print("Visit: http://localhost:5555")
    run_command("pnpm db:studio")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python db-migrate.py [setup|reset|studio]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "setup":
        setup_database()
    elif command == "reset":
        reset_database()
    elif command == "studio":
        open_studio()
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
