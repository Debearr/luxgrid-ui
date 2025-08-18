#!/usr/bin/env node
/**
 * Noidlux – Site Polish
 * - Writes/overwrites public/index.html and public/styles.css
 * - Drops a minimal logo + favicon (SVG)
 * - Fixes anchor offsets/smooth scrolling
 * - Removes rocket hero + top cutoff
 */
import fs from 'fs/promises'
import path from 'path'

const PUB = 'public'
await fs.mkdir(PUB, { recursive: true })

// ---- 1) Logo + favicon (SVG) ----
const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#9fb7ff" offset="0"/>
      <stop stop-color="#7aa7ff" offset="0.5"/>
      <stop stop-color="#3f79ff" offset="1"/>
    </linearGradient>
  </defs>
  <rect rx="48" ry="48" width="256" height="256" fill="url(#g)"/>
  <g fill="white" transform="translate(52,60)">
    <!-- stylized N -->
    <path d="M22 132V18h18l72 78V18h20v114h-18L40 54v78H22z" opacity="0.96"/>
  </g>
  <style>@media(prefers-color-scheme:dark){:root{color-scheme:light only}}</style>
  <!-- simple, license-free logo for favicon/wordmark -->
</svg>
`.trim()

await fs.writeFile(path.join(PUB, 'logo-noidlux.svg'), LOGO_SVG, 'utf8')
await fs.writeFile(path.join(PUB, 'favicon.svg'), LOGO_SVG, 'utf8')

// ---- 2) CSS ----
const CSS = `
:root{
  --bg:#0b0f1a; --panel:#121828; --muted:#8ca0c8; --text:#e9efff; --brand:#6ea0ff;
  --radius:16px; --pad:20px; --max:1100px; --header:72px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:radial-gradient(1100px 600px at 70% -10%, #18223a 10%, transparent 60%) , var(--bg); color:var(--text); font:16px/1.6 Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial}
a{color:var(--brand); text-decoration:none}
.container{max-width:var(--max); margin:0 auto; padding:0 var(--pad)}
.header{
  position:sticky; top:0; z-index:50; height:var(--header);
  background:rgba(10,14,24,.7); backdrop-filter:saturate(1.2) blur(10px);
  border-bottom:1px solid rgba(255,255,255,.06)
}
.header .wrap{display:flex; align-items:center; justify-content:space-between; height:var(--header)}
.brand{display:flex; gap:12px; align-items:center}
.brand img{height:30px; width:30px; border-radius:8px}
.brand .name{font-weight:700; letter-spacing:.3px}
.brand .tag{color:var(--muted); font-size:14px}
.nav a{color:var(--text); opacity:.85; margin-left:16px; padding:8px 10px; border-radius:12px}
.nav a:hover{background:rgba(255,255,255,.06); opacity:1}

.hero{padding:56px 0 20px}
.hero .card{
  background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
  border:1px solid rgba(255,255,255,.08); border-radius:28px; padding:28px;
  display:flex; align-items:center; justify-content:space-between; gap:18px
}
.hero h1{margin:0; font-size:32px; line-height:1.15}
.hero p{margin:.35rem 0 0; color:var(--muted)}
.hero .cta a{display:inline-block; margin-right:10px; padding:12px 16px; border-radius:14px; border:1px solid rgba(255,255,255,.14)}
.hero .cta a.primary{background:var(--brand); color:#0b0f1a; border:0}
.hero small{display:block; margin-top:10px; color:var(--muted)}

.section{padding:32px 0}
.panel{
  background:var(--panel); border:1px solid rgba(255,255,255,.06);
  border-radius:22px; padding:20px;
}
h2{margin:0 0 12px}

.grid{display:grid; gap:14px}
.grid.cols-3{grid-template-columns:repeat(3, 1fr)}
@media (max-width:900px){ .grid.cols-3{grid-template-columns:1fr} }

.card{background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06); border-radius:18px; padding:16px}
.placeholder{display:flex; align-items:center; justify-content:center; height:120px; color:var(--muted); border:1px dashed rgba(255,255,255,.15); border-radius:14px}

footer{padding:30px 0 60px; color:var(--muted); text-align:center}

/* Anchor offset fix */
[id]{scroll-margin-top: calc(var(--header) + 12px)}
`.trim()

await fs.writeFile(path.join(PUB, 'styles.css'), CSS, 'utf8')

// ---- 3) HTML ----
const HTML = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Noidlux — Quiet luxury interfaces.</title>
  <meta name="description" content="Noidlux crafts quiet-luxury UI and market-grade components. Simple. Fast. Elegant."/>
  <meta property="og:title" content="Noidlux — Quiet luxury interfaces."/>
  <meta property="og:description" content="Quiet-luxury UI and market-grade components."/>
  <meta property="og:type" content="website"/>
  <meta property="og:image" content="/favicon.svg"/>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
  <link rel="stylesheet" href="/styles.css"/>
  <meta name="theme-color" content="#0b0f1a"/>
  <meta name="robots" content="index,follow"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="Noidlux — Quiet luxury interfaces."/>
  <meta name="twitter:description" content="Quiet-luxury UI and market-grade components."/>
  <meta name="twitter:image" content="/favicon.svg"/>
  <link rel="canonical" href="https://noidlux.com/"/>
</head>
<body>
  <!-- Sticky header; rocket removed -->
  <header class="header">
    <div class="container wrap">
      <div class="brand">
        <img src="/logo-noidlux.svg" alt="Noidlux logo"/>
        <div>
          <div class="name">Noidlux</div>
          <div class="tag">Quiet luxury interfaces.</div>
        </div>
      </div>
      <nav class="nav">
        <a href="#features">Features</a>
        <a href="#gallery">Gallery</a>
        <a href="#contact">Contact</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <!-- Hero (no emoji, no top cutoff) -->
    <section class="hero">
      <div class="card">
        <div>
          <h1>Welcome to Noidlux</h1>
          <p>Deploy a refined, static site today. Extend later with frameworks—no rebuild required.</p>
          <div class="cta" style="margin-top:12px">
            <a class="primary" href="#features">Explore Features</a>
            <a href="#gallery">See Gallery</a>
            <small>Deployed on Vercel • <code>public/index.html</code></small>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="section">
      <div class="panel">
        <h2>Features</h2>
        <div class="grid cols-3">
          <div class="card"><b>Fast</b><br/>Static HTML at the edge. No build step.</div>
          <div class="card"><b>Simple</b><br/>Edit one file in GitHub and you're done.</div>
          <div class="card"><b>Extend</b><br/>Add images/JS now, frameworks later.</div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section id="gallery" class="section">
      <div class="panel">
        <h2>Gallery</h2>
        <div class="grid cols-3">
          <div class="card">
            <div class="placeholder">Drop <code>/shot1.jpg</code> into <code>public/</code> and replace me.</div>
          </div>
          <div class="card">
            <div class="placeholder">Drop <code>/shot2.jpg</code> into <code>public/</code> and replace me.</div>
          </div>
          <div class="card">
            <div class="placeholder">Drop <code>/shot3.jpg</code> into <code>public/</code> and replace me.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="section">
      <div class="panel">
        <h2>Contact</h2>
        <p>Swap this for your email: <a href="mailto:hello@noidlux.com">hello@noidlux.com</a>.</p>
      </div>
    </section>
  </main>

  <footer>
    © <span id="y"></span> Noidlux • Built with HTML
  </footer>

  <script>
    // set year; no frameworks
    document.getElementById('y').textContent = new Date().getFullYear()
  </script>
</body>
</html>
`.trim()

await fs.writeFile(path.join(PUB, 'index.html'), HTML, 'utf8')

console.log('✅ Noidlux site polished:')
console.log('- public/index.html updated')
console.log('- public/styles.css written')
console.log('- public/logo-noidlux.svg + favicon.svg created')
console.log('\nTip: Commit & push to trigger your Vercel deploy.')

