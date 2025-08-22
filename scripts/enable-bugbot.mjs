#!/usr/bin/env node

import assert from 'node:assert/strict';
import process from 'node:process';
import fetch from 'node-fetch';

/**
 * Enable Bugbot for a GitHub repository by calling Cursor's automation endpoint.
 *
 * Required environment variables:
 * - GITHUB_TOKEN: GitHub PAT with repo read access (and org:read if needed)
 * - GITHUB_OWNER: GitHub user or org login to scan
 * - CURSOR_API_URL: Base URL for Cursor automation endpoint
 * - CURSOR_API_TOKEN: Bearer token for Cursor API
 *
 * Optional environment variables:
 * - INCLUDE_REPOS: comma-separated repository names to include (whitelist). If set, only these are processed.
 * - EXCLUDE_REPOS: comma-separated repository names to exclude (blacklist)
 * - DRY_RUN: if set to "true", only log intended actions without calling APIs that mutate state
 * - VISIBILITY: one of "all", "public", "private", "internal" (default: all)
 * - PER_PAGE: number of repos per page when listing (default: 100)
 */

function getEnv(name, { required = false, defaultValue = undefined } = {}) {
	const value = process.env[name] ?? defaultValue;
	if (required && (!value || String(value).trim() === '')) {
		throw new Error(`Missing required env var: ${name}`);
	}
	return value;
}

function parseCsv(name) {
	const raw = process.env[name];
	if (!raw) return null;
	return raw
		.split(',')
		.map((s) => s.trim())
		.filter((s) => s.length > 0);
}

function logJson(label, obj) {
	console.log(`[${new Date().toISOString()}] ${label}: ${JSON.stringify(obj)}`);
}

async function githubRequest(path, { token, query = {} } = {}) {
	const url = new URL(`https://api.github.com${path}`);
	for (const [k, v] of Object.entries(query)) {
		if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
	}
	const res = await fetch(url.toString(), {
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${token}`,
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'cursor-bugbot-auto-enable-script'
		}
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub API ${url} failed: ${res.status} ${res.statusText} - ${text}`);
	}
	return res.json();
}

async function listRepos({ owner, token, visibility = 'all', perPage = 100 }) {
	const repos = [];
	let page = 1;
	while (true) {
		const pageData = await githubRequest(`/users/${owner}/repos`, {
			token,
			query: { per_page: perPage, page, type: 'all', sort: 'created', direction: 'desc', visibility }
		});
		repos.push(...pageData);
		if (pageData.length < perPage) break;
		page += 1;
	}
	return repos;
}

async function enableBugbotForRepo({ cursorApiUrl, cursorApiToken, owner, repo, dryRun = false }) {
	const url = `${cursorApiUrl.replace(/\/$/, '')}/bugbot/enable`;
	const body = { owner, repo };
	logJson('EnableBugbotRequest', { url, body, dryRun });
	if (dryRun) return { ok: true, skipped: true };
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${cursorApiToken}`
		},
		body: JSON.stringify(body)
	});
	const text = await res.text();
	if (!res.ok) {
		throw new Error(`Cursor API failed for ${owner}/${repo}: ${res.status} ${res.statusText} - ${text}`);
	}
	return { ok: true, skipped: false, responseText: text };
}

function filterRepos(allRepos, { include, exclude }) {
	let filtered = allRepos;
	if (include && include.length > 0) {
		const set = new Set(include.map((s) => s.toLowerCase()));
		filtered = filtered.filter((r) => set.has(r.name.toLowerCase()));
	}
	if (exclude && exclude.length > 0) {
		const set = new Set(exclude.map((s) => s.toLowerCase()));
		filtered = filtered.filter((r) => !set.has(r.name.toLowerCase()));
	}
	return filtered;
}

async function main() {
	try {
		const githubToken = getEnv('GITHUB_TOKEN', { required: true });
		const owner = getEnv('GITHUB_OWNER', { required: true });
		const cursorApiUrl = getEnv('CURSOR_API_URL', { required: true });
		const cursorApiToken = getEnv('CURSOR_API_TOKEN', { required: true });
		const visibility = getEnv('VISIBILITY', { defaultValue: 'all' });
		const perPage = Number(getEnv('PER_PAGE', { defaultValue: '100' }));
		const include = parseCsv('INCLUDE_REPOS');
		const exclude = parseCsv('EXCLUDE_REPOS');
		const dryRun = String(getEnv('DRY_RUN', { defaultValue: 'false' })).toLowerCase() === 'true';

		logJson('Config', { owner, visibility, perPage, include, exclude, dryRun });

		const repos = await listRepos({ owner, token: githubToken, visibility, perPage });
		logJson('DiscoveredReposCount', { count: repos.length });

		const toProcess = filterRepos(repos, { include, exclude });
		logJson('FilteredReposCount', { count: toProcess.length });

		let successCount = 0;
		let skippedCount = 0;
		let errorCount = 0;

		for (const repo of toProcess) {
			try {
				const result = await enableBugbotForRepo({
					cursorApiUrl,
					cursorApiToken,
					owner,
					repo: repo.name,
					dryRun
				});
				if (result.skipped) skippedCount += 1; else successCount += 1;
				logJson('EnableBugbotResult', { repo: repo.full_name, ...result });
			} catch (err) {
				errorCount += 1;
				console.error(`[${new Date().toISOString()}] EnableBugbotError: ${repo.full_name} ->`, err.message);
			}
		}

		logJson('Summary', { successCount, skippedCount, errorCount, total: toProcess.length });
		if (errorCount > 0) process.exitCode = 1;
	} catch (err) {
		console.error(`[${new Date().toISOString()}] FatalError:`, err.message);
		process.exitCode = 1;
	}
}

await main();