#!/usr/bin/env node
import http from 'http';

const url = process.argv[2] || 'http://localhost:3000';
const healthUrl = `${url.replace(/\/$/, '')}/health`;

http.get(healthUrl, (res) => {
	if (res.statusCode === 200) {
		process.stdout.write('Smoke OK\n');
		process.exit(0);
	} else {
		process.stderr.write(`Smoke FAIL — status ${res.statusCode}\n`);
		process.exit(1);
	}
}).on('error', (e) => {
	process.stderr.write(`Smoke FAIL — ${e.message}\n`);
	process.exit(1);
});