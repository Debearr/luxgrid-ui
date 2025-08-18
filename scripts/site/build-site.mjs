#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../');

async function readJson(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text);
}

async function readText(filePath) {
  return fs.readFile(filePath, 'utf8');
}

function replaceTokens(template, tokens) {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, keyRaw) => {
    const key = keyRaw.trim();
    const pathParts = key.split('.');
    let value = tokens;
    for (const part of pathParts) {
      value = value?.[part];
    }
    if (value == null) return '';
    return String(value);
  });
}

async function ensureDirectoryExists(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function listGalleryImages(publicDir) {
  const entries = await fs.readdir(publicDir);
  const matches = entries.filter((name) => /^shot.*\.(jpg|jpeg|png|webp)$/i.test(name));
  return matches.sort();
}

async function main() {
  const publicDir = path.join(repoRoot, 'public');
  const templatesDir = path.join(repoRoot, 'templates');

  await ensureDirectoryExists(publicDir);

  const brandPath = path.join(publicDir, '_brand.json');
  const brand = await readJson(brandPath);

  const indexTpl = await readText(path.join(templatesDir, 'index.html.tpl'));
  const stylesTpl = await readText(path.join(templatesDir, 'styles.css.tpl'));
  const monogramTpl = await readText(path.join(templatesDir, 'logo-monogram.svg.tpl'));
  const wordmarkTpl = await readText(path.join(templatesDir, 'logo-wordmark.svg.tpl'));
  const faviconTpl = await readText(path.join(templatesDir, 'favicon.svg.tpl'));

  const images = await listGalleryImages(publicDir);
  const galleryHtml = images.length
    ? images.map((name) => `<img src="/${name}" alt="${name}" loading="lazy" />`).join('\n          ')
    : [1, 2, 3]
        .map(
          (i) =>
            `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23121214'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239A9AA0' font-family='system-ui' font-size='28'%3EPlaceholder ${i}%3C/text%3E%3C/svg%3E" alt="Placeholder ${i}" />`
        )
        .join('\n          ');

  const tokens = { ...brand, year: new Date().getFullYear(), gallery_items: galleryHtml };

  const indexOut = replaceTokens(indexTpl, tokens);
  const stylesOut = replaceTokens(stylesTpl, tokens);
  const monogramOut = replaceTokens(monogramTpl, tokens);
  const wordmarkOut = replaceTokens(wordmarkTpl, tokens);
  const faviconOut = replaceTokens(faviconTpl, tokens);

  await fs.writeFile(path.join(publicDir, 'index.html'), indexOut, 'utf8');
  await fs.writeFile(path.join(publicDir, 'styles.css'), stylesOut, 'utf8');
  await fs.writeFile(path.join(publicDir, 'logo-noidlux.svg'), monogramOut, 'utf8');
  await fs.writeFile(path.join(publicDir, 'logo-wordmark.svg'), wordmarkOut, 'utf8');
  await fs.writeFile(path.join(publicDir, 'favicon.svg'), faviconOut, 'utf8');

  console.log('Built public assets: index.html, styles.css, logo-noidlux.svg, logo-wordmark.svg, favicon.svg');
}

main().catch((error) => {
  console.error('build-site failed:', error);
  process.exit(1);
});

