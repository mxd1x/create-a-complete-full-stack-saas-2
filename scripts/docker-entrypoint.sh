#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  ./node_modules/.bin/prisma db push --skip-generate
fi

exec node server.js
