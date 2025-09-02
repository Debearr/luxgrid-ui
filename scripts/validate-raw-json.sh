set -euo pipefail
shopt -s nullglob
cd /workspace
STATUS=0
for f in audit/RAW_*.json; do
  echo Checking
