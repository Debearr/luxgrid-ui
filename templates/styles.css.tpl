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
