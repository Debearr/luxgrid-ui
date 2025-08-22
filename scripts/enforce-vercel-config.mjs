import fs from 'fs';

const path = 'vercel.json';
if (!fs.existsSync(path)) process.exit(0);

const txt = fs.readFileSync(path, 'utf8');
let json;
try { json = JSON.parse(txt); } catch (e) {
	console.error('vercel.json is not valid JSON'); process.exit(1);
}

const banned = ['routes', 'redirects', 'headers', 'cleanUrls', 'trailingSlash', 'outputDirectory', 'buildCommand', 'installCommand'];
const offenders = banned.filter(k => k in json);
if (offenders.length) {
	console.error(`❌ vercel.json contains disallowed keys for Next.js: ${offenders.join(', ')}`);
	console.error('Use next.config.mjs for headers/redirects; keep vercel.json minimal or delete it.');
	process.exit(1);
}

if (Object.keys(json).some(k => k !== 'framework') || json.framework !== 'nextjs') {
	console.error('❌ vercel.json must contain only: { "framework": "nextjs" }');
	process.exit(1);
}

console.log('✅ vercel.json passes config guard.');