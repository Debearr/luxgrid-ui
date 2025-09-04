#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function copyRecursive(source, destination) {
  ensureDirectoryExists(destination);
  const entries = fs.readdirSync(source, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(repoRoot, 'assets', 'brand', 'social');
  const destDir = path.join(repoRoot, 'public', 'assets', 'brand', 'social');

  if (!fs.existsSync(srcDir)) {
    console.error(`Source assets not found: ${srcDir}`);
    process.exit(1);
  }

  copyRecursive(srcDir, destDir);
  console.log(`Synced assets to: ${destDir}`);
}

main();

