<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>{{name}} — {{tagline}}</title>
  <meta name="description" content="{{seo.description}}"/>
  <meta property="og:title" content="{{name}} — {{tagline}}"/>
  <meta property="og:description" content="{{seo.description}}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:image" content="{{#if seo.ogImage}}{{seo.ogImage}}{{else}}/favicon.svg{{/if}}"/>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
  <link rel="stylesheet" href="/styles.css"/>
</head>
<body>
  <header class="header">
    <div class="container wrap">
      <div class="brand">
        <img src="{{#if assets.logoOverride}}{{assets.logoOverride}}{{else}}/logo-noidlux.svg{{/if}}" alt="{{assets.logoAlt}}"/>
        <div>
          <div class="name">{{name}}</div>
          <div class="tag">{{tagline}}</div>
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
    <section class="hero">
      <div class="card">
        <h1>{{content.heroTitle}}</h1>
        <p>{{content.heroBody}}</p>
        <div class="cta" style="margin-top:12px">
          <a class="primary" href="#features">Explore Features</a>
          <a href="#gallery">See Gallery</a>
          <small>Deployed on Vercel • <code>public/index.html</code></small>
        </div>
      </div>
    </section>

    <section id="features" class="section">
      <div class="panel">
        <h2>Features</h2>
        <div class="grid cols-3">
          {{#each content.features}}
            <div class="card"><b>{{this.title}}</b><br/>{{this.body}}</div>
          {{/each}}
        </div>
      </div>
    </section>

    <section id="gallery" class="section">
      <div class="panel gallery">
        <h2>Gallery</h2>
        <div class="grid cols-3">
          {{#if shots.length}}
            {{#each shots}}
              <div class="card"><img src="{{this}}" alt="Showcase {{@index}}" loading="lazy"/></div>
            {{/each}}
          {{else}}
            {{#each placeholders}}
              <div class="card"><div class="placeholder">{{this}}</div></div>
            {{/each}}
          {{/if}}
        </div>
      </div>
    </section>

    <section id="contact" class="section">
      <div class="panel">
        <h2>Contact</h2>
        <p>Reach us at <a href="mailto:{{email}}">{{email}}</a>.</p>
      </div>
    </section>
  </main>

  <footer>© <span id="y"></span> {{name}} • Built with HTML</footer>
  <script>document.getElementById('y').textContent = new Date().getFullYear()</script>
</body>
</html>

