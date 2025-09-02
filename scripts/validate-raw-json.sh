#!/usr/bin/env bash
set -euo pipefail

# Validate all tracked JSON files using Node's JSON parser

if ! command -v git >/dev/null 2>&1; then
  echo "git is required to enumerate JSON files" >&2
  exit 2
fi

node - <<'NODE'
const fs = require('fs');
const cp = require('child_process');

let files = [];
try {
  const all = cp.execSync("git ls-files '*.json'", { stdio: ['ignore','pipe','ignore'] })
    .toString()
    .split('\n')
    .filter(Boolean);
  files = all.filter(p => p.startsWith('.council/') || p.startsWith('council-reports/'));
} catch (e) {
  // Fallback to environment-provided file list if any
  files = process.env.JSON_FILES ? process.env.JSON_FILES.split('\n').filter(Boolean) : [];
}

if (files.length === 0) {
  console.log('No audit JSON files found (.council/ or council-reports/).');
  process.exit(0);
}

let ok = true;
for (const filePath of files) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    JSON.parse(raw);
  } catch (err) {
    ok = false;
    console.error('Invalid JSON:', filePath, '-', err.message);
  }
}

if (!ok) {
  process.exit(1);
} else {
  console.log(`Validated ${files.length} JSON files ✅`);
}
NODE

