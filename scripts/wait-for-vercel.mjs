import fetch from 'node-fetch';
import fs from 'fs';

const {
	VERCEL_TOKEN,
	VERCEL_ORG_ID,
	VERCEL_PROJECT_ID,
	GITHUB_SHA,
	PR_NUMBER,
	GITHUB_OUTPUT
} = process.env;

function die(msg) { console.error(msg); process.exit(1); }

if (!VERCEL_TOKEN) die('Missing VERCEL_TOKEN');
if (!VERCEL_ORG_ID) die('Missing VERCEL_ORG_ID');
if (!VERCEL_PROJECT_ID) die('Missing VERCEL_PROJECT_ID');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function list() {
	const url = `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&teamId=${VERCEL_ORG_ID}&limit=50`;
	const r = await fetch(url, { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } });
	if (!r.ok) die(`Vercel list failed: ${r.status} ${r.statusText}`);
	return r.json();
}

function match(d) {
	// Try several ways Vercel may tag the commit/PR
	const m = d.meta || {};
	return (
		d.target === 'preview' &&
		(
			m.githubCommitSha === GITHUB_SHA ||
			m.commitSha === GITHUB_SHA ||
			(PR_NUMBER && (m.githubPrId == PR_NUMBER || m.githubPrNumber == PR_NUMBER))
		)
	);
}

const deadline = Date.now() + 10 * 60 * 1000; // 10 minutes
let foundUrl = null;

while (Date.now() < deadline) {
	const { deployments = [] } = await list();
	const hits = deployments.filter(match);
	if (hits.length) {
		// Prefer READY, else keep waiting if BUILDING/QUEUED, else fail if ERROR
		const ready = hits.find(x => x.readyState === 'READY');
		const building = hits.find(x => ['BUILDING','QUEUED','INITIALIZING'].includes(x.readyState));
		const error = hits.find(x => x.readyState === 'ERROR');

		if (ready) {
			foundUrl = `https://${ready.url}`;
			console.log('Preview ready:', foundUrl);
			break;
		}
		if (error) die(`Vercel deployment error for this PR/commit. Check Vercel logs. (deployment=${error.uid})`);
		console.log('Waiting for Vercel preview…');
	} else {
		console.log('No matching preview yet…');
	}
	await sleep(8000);
}

if (!foundUrl) die('Timed out waiting for Vercel preview deployment.');
fs.appendFileSync(GITHUB_OUTPUT, `preview_url=${foundUrl}\n`);
console.log('Preview URL exported.');