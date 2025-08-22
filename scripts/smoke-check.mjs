#!/usr/bin/env node
import http from 'node:http';
import { setTimeout as sleep } from 'node:timers/promises';

const BASE_URL = process.env.SMOKE_BASE_URL || 'http://localhost:3000';

async function fetchPath(pathname) {
	return new Promise((resolve, reject) => {
		const req = http.get(new URL(pathname, BASE_URL), res => {
			let data = '';
			res.setEncoding('utf8');
			res.on('data', chunk => (data += chunk));
			res.on('end', () => resolve({ status: res.statusCode || 0, body: data }));
		});
		req.on('error', reject);
		req.setTimeout(10000, () => {
			req.destroy(new Error('Request timed out'));
		});
	});
}

async function waitForServer(maxMs = 30000) {
	const start = Date.now();
	while (Date.now() - start < maxMs) {
		try {
			const res = await fetchPath('/');
			if (res.status >= 200 && res.status < 500) return true;
		} catch {}
		await sleep(1000);
	}
	throw new Error('Server did not become ready on port 3000');
}

(async () => {
	await waitForServer();

	const home = await fetchPath('/');
	if (home.status < 200 || home.status >= 400) {
		console.error('Home page failed', home.status);
		process.exit(1);
	}

	const health = await fetchPath('/api/health');
	if (health.status < 200 || health.status >= 400) {
		console.error('Health endpoint failed', health.status);
		process.exit(1);
	}

	console.log('Smoke checks passed ✅');
	process.exit(0);
})().catch(err => {
	console.error(err?.stack || err?.message || String(err));
	process.exit(1);
});