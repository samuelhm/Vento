#!/bin/sh
set -e

# Ensure upload directory exists
mkdir -p /uploads

# Copy seeded assets to upload volume (overwrite existing files)
if [ -d "/app/assets" ]; then
  cp -rf /app/assets/. /uploads/
fi

# Install dependencies
npm install

# Start the application
exec npm run dev