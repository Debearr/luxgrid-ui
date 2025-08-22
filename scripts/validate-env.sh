#!/usr/bin/env bash
set -euo pipefail
required=(
  "VERCEL_TOKEN"
  "GITHUB_TOKEN"
  "NEXT_PUBLIC_BASE_URL"
)
missing=0
for k in "${required[@]}"; do
  if [ -z "${!k:-}" ]; then
    echo "❌ Missing required env: $k"
    missing=1
  fi
done
if [ "$missing" -eq 1 ]; then
  echo "Abort: set missing envs in Cursor User Secrets and Vercel."
  exit 1
fi
echo "✅ Env check passed."