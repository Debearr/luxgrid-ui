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
