#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const vercelPath = path.join(repoRoot, 'vercel.json');

function fail(message) {
	console.error(`vercel.json guard: ${message}`);
	process.exit(1);
}

if (!fs.existsSync(vercelPath)) {
	fail('vercel.json is missing at repo root');
}

let content;
try {
	content = fs.readFileSync(vercelPath, 'utf8').trim();
} catch (err) {
	fail(`unable to read vercel.json: ${err.message}`);
}

try {
	const json = JSON.parse(content);
	const allowedKeys = ['framework'];
	const allowedFrameworkValue = 'nextjs';
	const keys = Object.keys(json);

	// Ensure only one key and it is framework
	if (keys.length !== 1 || keys[0] !== 'framework') {
		fail(`must contain exactly one key "framework"; found keys: [${keys.join(', ')}]`);
	}

	if (json.framework !== allowedFrameworkValue) {
		fail(`framework must be "${allowedFrameworkValue}", found "${json.framework}"`);
	}
} catch (err) {
	fail(`invalid JSON or schema: ${err.message}`);
}

// Search for other vercel.json files outside root
function* walk(dir) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (entry.name === '.git' || entry.name === 'node_modules') continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			yield* walk(full);
		} else if (entry.isFile() && entry.name === 'vercel.json' && full !== vercelPath) {
			yield full;
		}
	}
}

const duplicates = Array.from(walk(repoRoot));
if (duplicates.length > 0) {
	fail(`found additional vercel.json files: ${duplicates.join(', ')}`);
}

console.log('vercel.json guard: OK');