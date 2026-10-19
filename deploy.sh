#!/bin/bash
set -e

echo "========================================="
echo "   Plesk Automated Deployment Triggered  "
echo "========================================="

# 1. Initialize complete standard system PATH
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

# 2. Add all Plesk Node.js versions to PATH using pure bash globbing (no external tools like sort/ls)
for node_dir in /opt/plesk/node/*/bin; do
  if [ -d "$node_dir" ]; then
    export PATH="$node_dir:$PATH"
  fi
done

echo "Path configured: $PATH"

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm could not be found."
  exit 1
fi

echo "Using Node: $(node -v)"
echo "Using NPM:  $(npm -v)"

# 3. Navigate to application directory
if [ -d "platform" ]; then
  cd platform
fi

echo "Working directory: $(pwd)"

# 4. Run database sync and Next.js production build
echo "Running plesk-deploy..."
npm run plesk-deploy

# 5. Restart Phusion Passenger automatically
echo "Restarting Node.js application..."
mkdir -p tmp
touch tmp/restart.txt

echo "========================================="
echo "   Deployment Completed Successfully!    "
echo "========================================="
