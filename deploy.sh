#!/bin/bash
set -e

echo "========================================="
echo "   Plesk Automated Deployment Triggered  "
echo "========================================="

# Navigate to application directory
if [ -d "platform" ]; then
  cd platform
fi

echo "Current Directory: $(pwd)"

# Ensure all dependencies are in sync
echo "Step 1: Installing dependencies..."
npm install

# Run database sync and production Next.js build
echo "Step 2: Building application & updating database schema..."
npm run plesk-deploy

# Restart Node.js Phusion Passenger process automatically
echo "Step 3: Restarting Node.js application..."
mkdir -p tmp
touch tmp/restart.txt

echo "========================================="
echo "   Deployment Completed Successfully!    "
echo "========================================="
