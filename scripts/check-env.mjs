const required = [
	'VERCEL_TOKEN','VERCEL_ORG_ID','VERCEL_PROJECT_ID',
	'GITHUB_TOKEN','GH_OWNER','GH_REPO','GH_REF',
	'NODE_ENV','CI','DATABASE_URL','JWT_SECRET',
	'NEXT_PUBLIC_APP_URL','NEXT_PUBLIC_VERCEL_URL'
];

const missing = required.filter(k => !process.env[k] || String(process.env[k]).trim()==='');
if (missing.length) {
	console.error('❌ Missing required env vars:\n' + missing.map(k => ` - ${k}`).join('\n'));
	process.exit(1);
}
console.log('✅ Env preflight OK.');