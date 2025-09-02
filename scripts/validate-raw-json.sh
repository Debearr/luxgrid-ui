#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob
cd /workspace
STATUS=0
for f in audit/RAW_*.json; do
  echo "Checking $f"
  if ! jq -e . "$f" >/dev/null 2>&1; then
    echo "❌ Invalid JSON: $f"; STATUS=1; continue
  fi
  t=$(jq -r 'type' "$f")
  if [ "$t" = "object" ] && [ "$(jq 'length' "$f")" -eq 0 ]; then
    echo "❌ Empty JSON object: $f"; STATUS=1; continue
  fi
  if [ "$t" = "array" ] && [ "$(jq 'length' "$f")" -eq 0 ]; then
    echo "❌ Empty JSON array: $f"; STATUS=1; continue
  fi
  echo "✅ OK: $f"
done
exit $STATUS
