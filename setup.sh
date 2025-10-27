#!/bin/bash
# Setup script for local development
set -e

# Start Postgres via Docker Compose
docker-compose up -d db

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
dotenv -e .env npx prisma migrate dev --name init

# Seed exercises
dotenv -e .env npx ts-node src/seed.ts

echo "Setup complete!"
