#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../');

async function ensureDirectoryExists(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function writeFileIfMissing(filePath, content) {
  try {
    await fs.access(filePath);
    return false;
  } catch {
    await ensureDirectoryExists(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
    return true;
  }
}

async function main() {
  const templatesDir = path.join(repoRoot, 'templates');
  const publicDir = path.join(repoRoot, 'public');

  await ensureDirectoryExists(templatesDir);
  await ensureDirectoryExists(publicDir);

  const brandPath = path.join(publicDir, '_brand.json');
  const brandDefault = JSON.stringify(
    {
      site_title: 'Noidlux — Quiet luxury interfaces.',
      hero_title: 'Quiet luxury interfaces',
      hero_subtitle: 'Deliberately minimal components for discerning products.',
      palette: {
        background: '#0B0B0C',
        surface: '#121214',
        text: '#EAEAEA',
        muted: '#9A9AA0',
        accent: '#C7A36B'
      }
    },
    null,
    2
  );

  const wroteBrand = await writeFileIfMissing(brandPath, brandDefault);

  const indexTplPath = path.join(templatesDir, 'index.html.tpl');
  const stylesTplPath = path.join(templatesDir, 'styles.css.tpl');
  const monoTplPath = path.join(templatesDir, 'logo-monogram.svg.tpl');
  const wordTplPath = path.join(templatesDir, 'logo-wordmark.svg.tpl');
  const faviconTplPath = path.join(templatesDir, 'favicon.svg.tpl');

  const indexTpl = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{site_title}}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header class="site-header">
      <a href="#top" class="brand"><img src="/logo-noidlux.svg" alt="Noidlux" height="28" /></a>
      <nav>
        <a href="#features">Features</a>
        <a href="#gallery">Gallery</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main id="top">
      <section class="hero">
        <h1>{{hero_title}}</h1>
        <p class="subtitle">{{hero_subtitle}}</p>
        <img class="wordmark" src="/logo-wordmark.svg" alt="Noidlux wordmark" />
      </section>
      <section id="features" class="features">
        <h2>Features</h2>
        <ul>
          <li>Quiet, restrained aesthetic</li>
          <li>Accessible, performant components</li>
          <li>Dark luxury palette</li>
        </ul>
      </section>
      <section id="gallery" class="gallery">
        <h2>Gallery</h2>
        <div class="grid">
          {{gallery_items}}
        </div>
      </section>
      <section id="contact" class="contact">
        <h2>Contact</h2>
        <p>Contact us at <a href="mailto:hello@noidlux.com">hello@noidlux.com</a></p>
      </section>
    </main>
    <footer class="site-footer">© {{year}} Noidlux</footer>
  </body>
</html>`;

  const stylesTpl = `:root{--bg: {{palette.background}}; --surface: {{palette.surface}}; --text: {{palette.text}}; --muted: {{palette.muted}}; --accent: {{palette.accent}}}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--bg);color:var(--text);font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif}
.site-header{position:sticky;top:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:12px 20px;background:rgba(18,18,20,.75);backdrop-filter:saturate(160%) blur(8px);border-bottom:1px solid rgba(255,255,255,.06)}
.site-header nav a{color:var(--muted);margin-left:16px;text-decoration:none}
.site-header nav a:hover{color:var(--text)}
.hero{padding:96px 20px 48px;max-width:960px;margin:0 auto;text-align:center}
.hero h1{font-size:48px;letter-spacing:.2px;margin:0 0 10px}
.hero .subtitle{color:var(--muted);font-size:18px;margin:0 0 20px}
.hero .wordmark{height:28px;opacity:.9}
section{scroll-margin-top:72px}
.features,.gallery,.contact{max-width:960px;margin:0 auto;padding:48px 20px;border-top:1px solid rgba(255,255,255,.06)}
.gallery .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
.gallery .grid img{width:100%;height:180px;object-fit:cover;border-radius:10px;border:1px solid rgba(255,255,255,.06);background:var(--surface)}
.site-footer{max-width:960px;margin:40px auto;padding:20px;color:var(--muted);border-top:1px solid rgba(255,255,255,.06)}
`;

  const monogramTpl = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="1" y="1" width="62" height="62" rx="10" fill="{{palette.surface}}" stroke="{{palette.accent}}"/>
  <path d="M16 48V16l16 22 16-22v32" fill="none" stroke="{{palette.accent}}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const wordmarkTpl = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 32">
  <text x="0" y="22" font-family="'Segoe UI', system-ui, sans-serif" font-size="22" fill="{{palette.text}}">Noidlux</text>
</svg>`;

  const faviconTpl = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="1" y="1" width="62" height="62" rx="10" fill="{{palette.surface}}" stroke="{{palette.accent}}"/>
  <path d="M16 48V16l16 22 16-22v32" fill="none" stroke="{{palette.accent}}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const wroteIndex = await writeFileIfMissing(indexTplPath, indexTpl);
  const wroteStyles = await writeFileIfMissing(stylesTplPath, stylesTpl);
  const wroteMono = await writeFileIfMissing(monoTplPath, monogramTpl);
  const wroteWord = await writeFileIfMissing(wordTplPath, wordmarkTpl);
  const wroteFavicon = await writeFileIfMissing(faviconTplPath, faviconTpl);

  const created = [];
  if (wroteBrand) created.push('public/_brand.json');
  if (wroteIndex) created.push('templates/index.html.tpl');
  if (wroteStyles) created.push('templates/styles.css.tpl');
  if (wroteMono) created.push('templates/logo-monogram.svg.tpl');
  if (wroteWord) created.push('templates/logo-wordmark.svg.tpl');
  if (wroteFavicon) created.push('templates/favicon.svg.tpl');

  if (created.length === 0) {
    console.log('Templates already present. Nothing to create.');
  } else {
    console.log('Created:', created.join(', '));
  }
}

main().catch((error) => {
  console.error('init-templates failed:', error);
  process.exit(1);
});

