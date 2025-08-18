#!/usr/bin/env node
import fs from "fs/promises";
(async()=>{
  try{
    const svg=await fs.readFile("public/logo-noidlux.svg","utf8");
    const hasCircle=/<circle[^>]+r="/.test(svg);
    const hasSlash=/L\s*228\s*160/.test(svg)||/45/.test(svg);
    const strokeOk=/stroke-width="1[48]"/.test(svg);
    const viewOk=/viewBox="0 0 256 256"/.test(svg);
    console.log("🔍 Geometry check:");
    console.log(`• 45° slash: ${hasSlash?"✅":"⚠️ inspect"}`);
    console.log(`• Circle present: ${hasCircle?"✅":"⚠️ missing"}`);
    console.log(`• Stroke widths 14/18: ${strokeOk?"✅":"⚠️ review"}`);
    console.log(`• viewBox 256: ${viewOk?"✅":"⚠️ prefer 256x256"}`);
  }catch{ console.error("❌ Could not read public/logo-noidlux.svg"); process.exit(1); }
})();

