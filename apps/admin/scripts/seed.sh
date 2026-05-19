#!/bin/bash
set -e

echo "Generating seed SQL..."
bun run scripts/generate-seed-sql.ts > scripts/seed.sql

echo "Applying seed data to local D1..."
wrangler d1 execute affiliate-admin --local --file=scripts/seed.sql

echo "Seed complete!"
