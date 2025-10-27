import http from 'http';
import crypto from 'crypto';
import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const JOB_QUEUE_KEY = process.env.JOB_QUEUE_KEY || 'vc:jobs';
const EVENTS_CHANNEL = process.env.EVENTS_CHANNEL || 'vc:events';
const CONCURRENCY = Number(process.env.CONCURRENCY || 4);
const HEALTH_PORT = Number(process.env.HEALTH_PORT || 8081);
const SEED_DEMO_JOBS = (process.env.SEED_DEMO_JOBS || 'true').toLowerCase() === 'true';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const ALERT_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL || '';

class CircuitBreaker {
	constructor({ windowSize = 50, failureThreshold = 0.3, cooldownMs = 15000 } = {}) {
		this.windowSize = windowSize;
		this.failureThreshold = failureThreshold;
		this.cooldownMs = cooldownMs;
		this.events = [];
		this.openUntil = 0;
	}

	mark(success) {
		this.events.push(Boolean(success));
		if (this.events.length > this.windowSize) this.events.shift();
		const failCount = this.events.filter((ok) => !ok).length;
		const rate = this.events.length ? failCount / this.events.length : 0;
		if (rate >= this.failureThreshold) {
			this.openUntil = Date.now() + this.cooldownMs;
		}
	}

	isOpen() {
		return Date.now() < this.openUntil;
	}
}

function piiRedact(text) {
	if (!text) return text;
	return text
		.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, (m) => m.replace(/^[^@]+/, '***'))
		.replace(/\b(\+?\d[\d\s-]{7,}\d)\b/g, (m) => m.slice(0, 2) + '***' + m.slice(-2));
}

function encryptIfNeeded(data) {
	if (!ENCRYPTION_KEY) return data;
	const iv = crypto.randomBytes(12);
	const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
	const enc = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
	const tag = cipher.getAuthTag();
	return { __enc__: 'aes-256-gcm', iv: iv.toString('base64'), tag: tag.toString('base64'), data: enc.toString('base64') };
}

async function postAlert(text) {
	if (!ALERT_WEBHOOK_URL) return;
	try {
		await fetch(ALERT_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
	} catch (_) {}
}

function ms() { return Date.now(); }

function publishEvent(pub, evt) {
	const base = { timestamp: new Date().toISOString(), ...evt };
	return pub.publish(EVENTS_CHANNEL, JSON.stringify(base));
}

async function analyzeVentureCase(job) {
	// Simulated multi-stage analysis pipeline
	const start = ms();
	const stages = [
		{ name: 'market_data', work: 300 + Math.random() * 700 },
		{ name: 'risk_assessment', work: 300 + Math.random() * 700 },
		{ name: 'competitive_analysis', work: 300 + Math.random() * 700 },
		{ name: 'success_modeling', work: 300 + Math.random() * 700 },
	];
	const metrics = {};
	for (const stage of stages) {
		const t0 = ms();
		await new Promise((r) => setTimeout(r, stage.work));
		metrics[stage.name + '_ms'] = ms() - t0;
	}
	const totalMs = ms() - start;
	const score = Math.round(60 + Math.random() * 40);
	const outcome = { score, totalMs, recommendation: score > 75 ? 'proceed' : 'monitor' };
	// Apply PII redaction on free-text fields if present
	if (job.notes) outcome.notes = piiRedact(job.notes);
	return { outcome, metrics };
}

async function workerLoop({ id, cmd, pub, breaker }) {
	while (true) {
		if (breaker.isOpen()) {
			await publishEvent(pub, { id: 'system', stage: 'circuit', status: 'open', message: 'Cooling down' });
			await new Promise((r) => setTimeout(r, 1000));
			continue;
		}
		const qitem = await cmd.brPop(JOB_QUEUE_KEY, 5);
		if (!qitem) continue; // timeout, loop again
		const [, payload] = qitem;
		let job;
		try { job = JSON.parse(payload); } catch { continue; }
		const jobId = job.id || crypto.randomUUID();
		await publishEvent(pub, { id: jobId, stage: 'job', status: 'started', message: job.title || 'analysis' });
		try {
			const { outcome, metrics } = await analyzeVentureCase(job);
			await publishEvent(pub, { id: jobId, stage: 'job', status: 'completed', message: outcome.recommendation, metrics });
			breaker.mark(true);
			// Persist result (encrypted if configured)
			await cmd.hSet(`vc:result:${jobId}`, 'data', JSON.stringify(encryptIfNeeded({ job, outcome })), 'ts', String(Date.now()));
		} catch (err) {
			breaker.mark(false);
			await publishEvent(pub, { id: jobId, stage: 'job', status: 'failed', message: (err && err.message) || 'error' });
			await postAlert(`VC pipeline failure on job ${jobId}: ${(err && err.message) || err}`);
		}
	}
}

async function seedJobs(cmd) {
	const exists = await cmd.lLen(JOB_QUEUE_KEY);
	if (exists > 0) return;
	const demo = [];
	for (let i = 0; i < 10; i++) {
		demo.push(JSON.stringify({ id: crypto.randomUUID(), title: `Company ${i+1}`, notes: 'Contact ceo@example.com for diligence. Phone +1 415-555-1234' }));
	}
	if (demo.length) await cmd.lPush(JOB_QUEUE_KEY, demo);
}

function startHealthServer() {
	const server = http.createServer((req, res) => {
		if (req.url === '/healthz') {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ status: 'ok' }));
			return;
		}
		res.writeHead(404); res.end();
	});
	server.listen(HEALTH_PORT, () => console.log(`Health on :${HEALTH_PORT}`));
}

async function main() {
	const cmd = createClient({ url: REDIS_URL });
	const pub = createClient({ url: REDIS_URL });
	cmd.on('error', (e) => console.error('[redis] cmd', e));
	pub.on('error', (e) => console.error('[redis] pub', e));
	await Promise.all([cmd.connect(), pub.connect()]);
	if (SEED_DEMO_JOBS) await seedJobs(cmd);
	startHealthServer();
	const breaker = new CircuitBreaker();
	const workers = Array.from({ length: CONCURRENCY }, (_, i) => workerLoop({ id: i + 1, cmd, pub, breaker }));
	await Promise.all(workers);
}

main().catch((err) => {
	console.error('Pipeline crashed', err);
	process.exit(1);
});

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

