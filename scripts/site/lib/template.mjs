import fs from "fs/promises";
export function render(t, data) {
  return t.replace(/\{\{\s*([a-zA-Z0-9_\.]+)\s*\}\}/g,(_,k)=>{
    return k.split(".").reduce((o,kk)=>o?.[kk], data) ?? "";
  });
}
export async function read(p){ return fs.readFile(p,"utf8"); }
export async function write(p, str){
  await fs.mkdir(p.split("/").slice(0,-1).join("/"),{recursive:true});
  return fs.writeFile(p,str,"utf8");
}

