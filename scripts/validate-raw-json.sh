#!/usr/bin/env bash
set -euo pipefail

# Validate all audit/RAW_*.json files using jq

shopt -s nullglob

RAW_FILES=(audit/RAW_*.json)

if [[ ${#RAW_FILES[@]} -eq 0 ]]; then
  echo "No RAW JSON files found under audit/. Nothing to validate."
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required but not installed. Please install jq and re-run."
  exit 2
fi

had_errors=0

for file_path in "${RAW_FILES[@]}"; do
  echo "Validating: ${file_path}"

  if [[ ! -s "${file_path}" ]]; then
    echo "  ✖ File is empty"
    had_errors=1
    continue
  fi

  if ! jq . "${file_path}" >/dev/null 2>&1; then
    echo "  ✖ Invalid JSON syntax"
    had_errors=1
    continue
  fi

  # Optional: ensure top-level is an object
  if ! jq -e 'type == "object"' "${file_path}" >/dev/null 2>&1; then
    echo "  ✖ Top-level JSON must be an object"
    had_errors=1
    continue
  fi

  echo "  ✔ OK"
done

if [[ ${had_errors} -ne 0 ]]; then
  echo "One or more files failed validation."
  exit 1
fi

echo "All RAW JSON files are valid."
exit 0

