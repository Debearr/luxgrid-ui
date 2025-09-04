#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function runCommand(command) {
  execSync(command, { stdio: 'inherit' });
}

function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const assetsDir = path.join(repoRoot, 'assets', 'brand', 'social');
  const distDir = path.join(repoRoot, 'dist');
  const zipName = 'brand-kit-v2.zip';
  const zipPath = path.join(distDir, zipName);

  ensureDirectoryExists(distDir);

  if (!fs.existsSync(assetsDir)) {
    console.error(`Assets directory not found: ${assetsDir}`);
    process.exit(1);
  }

  // Create a temporary packaging directory to preserve structure
  const tempPackageDir = path.join(distDir, 'brand-kit-v2');
  if (fs.existsSync(tempPackageDir)) {
    fs.rmSync(tempPackageDir, { recursive: true, force: true });
  }
  ensureDirectoryExists(tempPackageDir);

  // Copy assets directory into the package directory
  const copyCommand = `cp -r "${assetsDir}" "${tempPackageDir}/social"`;
  runCommand(copyCommand);

  // Include a README file with brief instructions
  const readmeContent = [
    '# LuxGrid Brand Kit v2',
    '',
    'This archive contains platform-ready brand assets for NØID / LuxGrid.',
    '',
    '- Variants: Minimal, Edgy',
    '- Structure: social/<Platform>/*.png',
    '',
    'Naming convention: Platform_Type_Variant_v2.png',
    '',
    'If any platform is missing, contact Design Ops.'
  ].join('\n');
  fs.writeFileSync(path.join(tempPackageDir, 'README.md'), readmeContent, 'utf8');

  // Zip the package directory
  const cwd = process.cwd();
  try {
    process.chdir(distDir);
    // zip -r brand-kit-v2.zip brand-kit-v2
    runCommand(`zip -r "${zipName}" "brand-kit-v2"`);
  } finally {
    process.chdir(cwd);
  }

  console.log(`Packaged brand kit at: ${zipPath}`);
}

main();

