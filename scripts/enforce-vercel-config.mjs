import fs from 'fs';
const p = 'vercel.json';
if (!fs.existsSync(p)) process.exit(0);
let j; try { j = JSON.parse(fs.readFileSync(p, 'utf8')); }
catch { console.error('vercel.json is not valid JSON'); process.exit(1); }
const banned = ['routes','redirects','headers','cleanUrls','trailingSlash','outputDirectory','buildCommand','installCommand'];
const offenders = banned.filter(k => k in j);
if (offenders.length) {
	console.error(`❌ vercel.json contains disallowed keys: ${offenders.join(', ')}`);
	process.exit(1);
}
if (Object.keys(j).some(k => k !== 'framework') || j.framework !== 'nextjs') {
	console.error('❌ vercel.json must be exactly { "framework": "nextjs" }');
	process.exit(1);
}
console.log('✅ vercel.json passes config guard.');