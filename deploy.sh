#!/bin/bash
set -e

echo "========================================="
echo "   Plesk Automated Deployment Triggered  "
echo "========================================="

# 1. Locate Node and NPM in Plesk's environment
if ! command -v npm >/dev/null 2>&1; then
  echo "npm not in default PATH. Searching Plesk Node.js installations..."
  for pdir in $(ls -d /opt/plesk/node/*/bin 2>/dev/null | sort -V -r) /usr/local/bin /usr/bin; do
    if [ -x "$pdir/npm" ] && [ -x "$pdir/node" ]; then
      export PATH="$pdir:$PATH"
      echo "Using Node & NPM from: $pdir"
      break
    fi
  done
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: Could not find npm. Available PATH: $PATH"
  exit 1
fi

echo "Node version: $(node -v)"
echo "NPM version:  $(npm -v)"

# 2. Navigate to application directory
if [ -d "platform" ]; then
  cd platform
fi

echo "Working directory: $(pwd)"

# 3. Ensure Prisma and Next build are executed
echo "Running plesk-deploy (Prisma & Next.js build)..."
npm run plesk-deploy

# 4. Restart Phusion Passenger automatically
echo "Restarting Node.js application..."
mkdir -p tmp
touch tmp/restart.txt

echo "========================================="
echo "   Deployment Completed Successfully!    "
echo "========================================="
