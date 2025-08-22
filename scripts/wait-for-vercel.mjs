import fetch from 'node-fetch';
import fs from 'fs';
const { VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, GITHUB_SHA, GITHUB_OUTPUT } = process.env;
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function find() {
	const res = await fetch(`https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&teamId=${VERCEL_ORG_ID}&limit=20`, {
		headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
	});
	if (!res.ok) throw new Error(`List deployments failed: ${res.status}`);
	const { deployments = [] } = await res.json();
	const d = deployments.find(x =>
		(x.meta?.githubCommitSha === GITHUB_SHA || x.meta?.commitSha === GITHUB_SHA || x.gitSource?.commitSha === GITHUB_SHA) &&
		x.readyState === 'READY' && x.target === 'preview'
	);
	return d?.url ? `https://${d.url}` : null;
}
const start = Date.now(), timeout = 8 * 60 * 1000;
while (Date.now() - start < timeout) {
	const u = await find();
	if (u) {
		console.log(`Preview ready: ${u}`);
		fs.appendFileSync(GITHUB_OUTPUT, `preview_url=${u}\n`);
		process.exit(0);
	}
	console.log('Waiting for Vercel preview to be READY…');
	await sleep(8000);
}
console.error('Timed out waiting for Vercel preview deployment');
process.exit(1);