<!doctype html>
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
</html>