#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../');

async function readText(filePath) {
  return fs.readFile(filePath, 'utf8');
}

function checkStrokeAttributes(svg, label) {
  const hasStroke = /stroke="#[0-9a-fA-F]{3,8}|stroke=\"var\(/.test(svg);
  const hasWidth = /stroke-width="(3(\.[0-9]+)?|4(\.[0-9]+)?|5)"/.test(svg);
  if (hasStroke && hasWidth) {
    console.log(`✅ ${label}: stroke present and within expected width`);
    return true;
  }
  console.warn(`⚠️ ${label}: stroke attributes look unusual`);
  return false;
}

async function main() {
  const publicDir = path.join(repoRoot, 'public');
  const monoPath = path.join(publicDir, 'logo-noidlux.svg');
  const wordPath = path.join(publicDir, 'logo-wordmark.svg');
  const favPath = path.join(publicDir, 'favicon.svg');

  let ok = true;
  for (const [label, filePath] of [
    ['monogram', monoPath],
    ['wordmark', wordPath],
    ['favicon', favPath],
  ]) {
    try {
      const svg = await readText(filePath);
      ok = checkStrokeAttributes(svg, label) && ok;
    } catch (e) {
      console.warn(`⚠️ ${label}: missing at ${filePath}`);
      ok = false;
    }
  }

  if (!ok) {
    console.warn('Geometry check found potential issues.');
  } else {
    console.log('✅ Geometry checks passed.');
  }
}

main().catch((error) => {
  console.error('check-geometry failed:', error);
  process.exit(1);
});

