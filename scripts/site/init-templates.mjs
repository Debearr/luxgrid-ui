#!/usr/bin/env node
import fs from "fs/promises";
import { write } from "./lib/template.mjs";

async function ensure(p, content){
  try{ await fs.access(p); }catch{ await write(p, content.trimStart()); console.log("• created", p); }
}

await ensure("templates/styles.css.tpl", `
:root{ --bg: {{palette.bg}}; --panel: {{palette.panel}}; --muted: {{palette.muted}}; --text: {{palette.text}}; --brand: {{palette.brand}}; --radius:16px; --pad:20px; --max:1100px; --header:72px; }
*{box-sizing:border-box} html{scroll-behavior:smooth}
body{margin:0;background:radial-gradient(1100px 600px at 70% -10%, #18223a 10%, transparent 60%), var(--bg); color:var(--text); font:16px/1.6 {{typography.font_sans}}}
a{color:var(--brand); text-decoration:none}
.container{max-width:var(--max); margin:0 auto; padding:0 var(--pad)}
.header{position:sticky; top:0; z-index:50; height:var(--header); background:rgba(10,14,24,.7); backdrop-filter:saturate(1.2) blur(10px); border-bottom:1px solid rgba(255,255,255,.06)}
.header .wrap{display:flex; align-items:center; justify-content:space-between; height:var(--header)}
.brand{display:flex; gap:12px; align-items:center}
.brand img{height:30px; width:30px; border-radius:8px}
.brand .name{font-weight:700; letter-spacing:.3px}
.brand .tag{color:var(--muted); font-size:14px}
.nav a{color:var(--text); opacity:.85; margin-left:16px; padding:8px 10px; border-radius:12px}
.nav a:hover{background:rgba(255,255,255,.06); opacity:1}
.hero{padding:56px 0 20px}
.hero .card{background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02)); border:1px solid rgba(255,255,255,.08); border-radius:28px; padding:28px}
.hero h1{margin:0; font-size:32px; line-height:1.15; font-family: {{typography.font_serif}}}
.hero p{margin:.35rem 0 0; color:var(--muted)}
.hero .cta a{display:inline-block; margin-right:10px; padding:12px 16px; border-radius:14px; border:1px solid rgba(255,255,255,.14)}
.hero .cta a.primary{background:var(--brand); color:#0b0f1a; border:0}
.section{padding:32px 0}
.panel{background:var(--panel); border:1px solid rgba(255,255,255,.06); border-radius:22px; padding:20px}
h2{margin:0 0 12px; font-family: {{typography.font_serif}}}
.grid{display:grid; gap:14px}
.grid.cols-3{grid-template-columns:repeat(3, 1fr)}
@media (max-width:900px){ .grid.cols-3{grid-template-columns:1fr} }
.card{background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.06); border-radius:18px; padding:16px}
.placeholder{display:flex; align-items:center; justify-content:center; height:120px; color:var(--muted); border:1px dashed rgba(255,255,255,.15); border-radius:14px}
.gallery img{width:100%; height:220px; object-fit:cover; border-radius:12px; display:block}
footer{padding:30px 0 60px; color:var(--muted); text-align:center}
[id]{scroll-margin-top: calc(var(--header) + 12px)}
`);

await ensure("templates/index.html.tpl", `
<!doctype html><html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>{{name}} — {{tagline}}</title>
<meta name="description" content="{{hero_subtitle}}"/>
<meta property="og:title" content="{{name}} — {{tagline}}"/><meta property="og:description" content="{{hero_subtitle}}"/>
<meta property="og:type" content="website"/><meta property="og:image" content="{{og_image}}"/>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/><link rel="stylesheet" href="/styles.css"/>
</head><body>
<header class="header"><div class="container wrap">
  <div class="brand"><img src="/logo-noidlux.svg" alt="{{name}} monogram"/><div><div class="name">{{name}}</div><div class="tag">{{tagline}}</div></div></div>
  <nav class="nav"><a href="#features">Features</a><a href="#gallery">Gallery</a><a href="#contact">Contact</a></nav>
</div></header>
<main class="container">
  <section class="hero"><div class="card">
    <h1>{{hero_title}}</h1><p>{{hero_subtitle}}</p>
    <div class="cta" style="margin-top:12px"><a class="primary" href="#features">Explore Features</a><a href="#gallery">See Gallery</a><small>Deployed on Vercel • <code>public/index.html</code></small></div>
  </div></section>
  <section id="features" class="section"><div class="panel"><h2>Features</h2>
    <div class="grid cols-3">
      <div class="card"><b>Fast</b><br/>Static HTML at the edge. No build step.</div>
      <div class="card"><b>Simple</b><br/>Edit one file in GitHub and you're done.</div>
      <div class="card"><b>Extend</b><br/>Add images/JS now, frameworks later.</div>
    </div></div></section>
  <section id="gallery" class="section"><div class="panel gallery"><h2>Gallery</h2>
    <div class="grid cols-3">{{gallery_chunk}}</div></div></section>
  <section id="contact" class="section"><div class="panel"><h2>Contact</h2><p>Email us: <a href="mailto:{{email}}">{{email}}</a></p></div></section>
</main>
<footer>© {{year}} {{name}} • Built with HTML</footer>
</body></html>
`);

await ensure("templates/logo-monogram.svg.tpl", `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="{{name}} monogram">
  <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#9fb7ff" offset="0"/><stop stop-color="#7aa7ff" offset=".5"/><stop stop-color="#3f79ff" offset="1"/></linearGradient></defs>
  <rect width="256" height="256" rx="40" fill="url(#g)"/>
  <g fill="none" stroke="#fff" stroke-linecap="square" stroke-linejoin="miter">
    <path d="M64 64 L64 192 M64 192 L160 64 M160 64 L160 192" stroke-width="18"/>
    <circle cx="196" cy="128" r="44" stroke-width="18"/>
    <path d="M164 96 L228 160" stroke-width="14"/>
  </g>
  </svg>
`);

await ensure("templates/logo-wordmark.svg.tpl", `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 160" role="img" aria-label="{{name}} wordmark">
  <style>.w{font:700 84px {{typography.font_serif}}; letter-spacing:.16em; fill:#e9efff}</style>
  <rect width="900" height="160" fill="none"/><text class="w" x="28" y="112">NOIDLUX</text>
  <path d="M28 126H870" stroke="#e9efff" stroke-width="8" opacity=".12" fill="none"/>
</svg>
`);

console.log("✅ Templates ready. Run: npm run cursor:site:polish");

