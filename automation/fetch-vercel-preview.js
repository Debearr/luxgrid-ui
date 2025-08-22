const https = require('https');

const { VERCEL_TOKEN, GITHUB_REPOSITORY, GITHUB_REF_NAME, PR_NUMBER } = process.env;

function fail(message) {
	console.error(message);
	process.exit(1);
}

if (!VERCEL_TOKEN) fail('Missing VERCEL_TOKEN');

// Determine PR number reliably
const prNumber = PR_NUMBER || (GITHUB_REF_NAME && GITHUB_REF_NAME.replace(/^[^0-9]+/, '')) || '';

function api(path) {
	const options = {
		hostname: 'api.vercel.com',
		path,
		method: 'GET',
		headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
	};
	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			let data = '';
			res.on('data', (chunk) => (data += chunk));
			res.on('end', () => {
				if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
					try {
						resolve(JSON.parse(data));
					} catch (e) {
						reject(new Error('Failed to parse Vercel API response'));
					}
				} else {
					reject(new Error(`Vercel API ${res.statusCode}: ${data}`));
				}
			});
		});
		req.on('error', reject);
		req.end();
	});
}

async function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

async function fetchLatestPreviewUrlWithRetries({ projectId, orgId, maxAttempts = 10, baseDelayMs = 3000 }) {
	let attempt = 0;
	let lastError = null;
	while (attempt < maxAttempts) {
		attempt += 1;
		try {
			// Vercel deployments list
			const query = new URLSearchParams({ projectId, teamId: orgId, limit: '20' }).toString();
			const res = await api(`/v6/deployments?${query}`);
			const deployments = Array.isArray(res.deployments) ? res.deployments : res;

			// Filter preview deployments linked to this PR if PR number is available
			const candidates = deployments.filter((d) => {
				const isPreview = d?.target === 'preview' || d?.meta?.githubCommitRef?.startsWith('refs/pull/');
				const prMatch = prNumber
					? (d?.meta?.githubPrNumber && String(d.meta.githubPrNumber) === String(prNumber))
					: true;
				return isPreview && prMatch;
			});

			// Sort by created descending
			candidates.sort((a, b) => (b?.createdAt || 0) - (a?.createdAt || 0));
			const latest = candidates[0] || deployments[0];
			if (!latest) throw new Error('No deployments found yet');

			const alias = latest?.alias || latest?.aliases || latest?.readyState === 'READY' ? latest?.url : null;
			const url = typeof alias === 'string' ? `https://${alias}` : latest?.url ? `https://${latest.url}` : null;
			if (!url) throw new Error('Deployment exists but missing URL');

			return { url, deploymentId: latest.uid || latest.id, readyState: latest.readyState };
		} catch (err) {
			lastError = err;
			const delay = baseDelayMs * Math.pow(1.5, attempt - 1);
			console.log(`Attempt ${attempt} failed: ${err.message}. Retrying in ${Math.round(delay)}ms...`);
			await sleep(delay);
		}
	}
	throw lastError || new Error('Unknown error fetching preview URL');
}

(async () => {
	try {
		const projectId = process.env.VERCEL_PROJECT_ID;
		const orgId = process.env.VERCEL_ORG_ID;
		if (!projectId || !orgId) fail('Missing VERCEL_PROJECT_ID or VERCEL_ORG_ID');
		const result = await fetchLatestPreviewUrlWithRetries({ projectId, orgId });
		console.log(`Preview URL: ${result.url}`);
		// GitHub Actions output
		if (process.env.GITHUB_OUTPUT) {
			const fs = require('fs');
			fs.appendFileSync(process.env.GITHUB_OUTPUT, `url=${result.url}\n`);
		}
		process.exit(0);
	} catch (e) {
		console.error('Failed to fetch Vercel preview URL:', e.message);
		process.exit(1);
	}
})();