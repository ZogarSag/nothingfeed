#!/bin/bash

# Deployment Script für NOTHINGFEED auf Hetzner Server
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Build the application
echo "📦 Building application..."
npm run build

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Create production build
echo "🏗️ Creating production build..."
npm run build

echo "✅ Build completed successfully!"

echo ""
echo "📋 Next steps for Hetzner deployment:"
echo "1. Push to GitHub: git push origin main"
echo "2. SSH to your Hetzner server"
echo "3. Clone the repository: git clone <your-repo-url>"
echo "4. Install dependencies: npm ci --only=production"
echo "5. Set up environment variables"
echo "6. Set up PostgreSQL database"
echo "7. Run: npm run db:push"
echo "8. Start the application: npm start"
echo ""
echo "🌐 Or use Docker: docker-compose up -d"
