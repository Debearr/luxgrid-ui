:root{--bg: {{palette.background}}; --surface: {{palette.surface}}; --text: {{palette.text}}; --muted: {{palette.muted}}; --accent: {{palette.accent}}}
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
