#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { render, read, write } from "./lib/template.mjs";

const PUB="public", TPL="templates";

async function loadBrand(){
  const defaults={
    name:"Noidlux", tagline:"Quiet luxury interfaces.", email:"hello@noidlux.com",
    hero_title:"Interfaces, distilled.",
    hero_subtitle:"Quiet luxury UI components and patterns engineered for durability and grace.",
    og_image:"/favicon.svg",
    palette:{ bg:"#0b0f1a", panel:"#121828", text:"#e9efff", muted:"#8ca0c8", brand:"#6ea0ff" },
    typography:{
      font_serif:"ui-serif, Georgia, 'Times New Roman', Times, serif",
      font_sans:"Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
    }
  };
  try{
    const raw=await fs.readFile(path.join(PUB,"_brand.json"),"utf8");
    return { ...defaults, ...JSON.parse(raw) };
  }catch(e){
    console.log("⚠️  Using defaults (public/_brand.json missing/invalid).");
    return defaults;
  }
}

async function findShots(){
  try{
    const files=await fs.readdir(PUB);
    return files.filter(f=>/^shot\d+\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})).map(f=>`/${f}`);
  }catch{ return []; }
}

function galleryHTML(shots){
  const list = shots.length?shots:[null,null,null];
  return list.map((src,i)=> src
    ? `<div class="card"><img src="${src}" alt="Showcase ${i+1}" loading="lazy"/></div>`
    : `<div class="card"><div class="placeholder">Drop <code>/shot${i+1}.jpg</code> into <code>public/</code> and replace me.</div></div>`
  ).join("\n          ");
}

async function build(){
  const brand=await loadBrand();
  await fs.mkdir(PUB,{recursive:true});

  const cssTpl=await read(`${TPL}/styles.css.tpl`);
  await write(`${PUB}/styles.css`, render(cssTpl, brand));

  const htmlTpl=await read(`${TPL}/index.html.tpl`);
  const html=render(htmlTpl,{...brand, gallery_chunk:galleryHTML(await findShots()), year:new Date().getFullYear()});
  await write(`${PUB}/index.html`, html);

  const monoTpl=await read(`${TPL}/logo-monogram.svg.tpl`);
  await write(`${PUB}/logo-noidlux.svg`, render(monoTpl, brand));

  const wordTpl=await read(`${TPL}/logo-wordmark.svg.tpl`);
  await write(`${PUB}/logo-wordmark.svg`, render(wordTpl, brand));

  await write(`${PUB}/favicon.svg`, render(monoTpl, brand));

  console.log("✅ Site polished: index.html, styles.css, logo-noidlux.svg, logo-wordmark.svg, favicon.svg");
}
build().catch(e=>{ console.error("❌ Build failed:", e.message); process.exit(1); });

