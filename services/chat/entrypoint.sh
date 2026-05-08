#!/bin/sh

# Stop execution if any error occurs (technical security specification)
set -e

echo "--- VENTO CHAT SERVICE: INIT... ---"

# 1. Regenerate Prisma client to match runtime platform
echo "[1/3] Generating Prisma client..."
npx prisma generate

# 2. Apply pending migrations
echo "[2/3] Applying database migrations..."
set +e
migrate_output="$(npx prisma migrate deploy 2>&1)"
migrate_status=$?
set -e
echo "$migrate_output"

if [ $migrate_status -ne 0 ]; then
	if echo "$migrate_output" | grep -q "Error: P3005"; then
		echo "P3005 detected (existing non-empty schema without baseline). Applying schema with prisma db push..."
		npx prisma db push
	else
		echo "Migration failed with an unrecoverable error."
		exit $migrate_status
	fi
fi

# 3. Execute the main command (defined in the Dockerfile CMD)
echo "[3/3] Starting Node.js server..."
echo "Command: $@"
exec "$@"