import http from 'http';
import { WebSocketServer } from 'ws';
import { createClient } from 'redis';
import Ajv from 'ajv';

const DASHBOARD_PORT = Number(process.env.DASHBOARD_PORT || 3001);
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const EVENTS_CHANNEL = process.env.EVENTS_CHANNEL || 'vc:events';
const AUTH_TOKEN = process.env.DASHBOARD_AUTH_TOKEN || '';

const ajv = new Ajv({ removeAdditional: true, useDefaults: true });
const eventSchema = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		stage: { type: 'string' },
		status: { type: 'string' },
		progress: { type: 'number' },
		message: { type: 'string' },
		timestamp: { type: 'string' },
		metrics: { type: 'object', additionalProperties: true },
		severity: { type: 'string' },
	},
	required: ['id', 'stage', 'status', 'timestamp'],
};
const validateEvent = ajv.compile(eventSchema);

function renderHtml() {
	return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>VC Pipeline Dashboard</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; background: #0b1020; color: #e6e8ef; }
    header { padding: 16px 24px; background: #0f1530; border-bottom: 1px solid #1e254a; position: sticky; top: 0; z-index: 10; }
    h1 { margin: 0; font-size: 18px; }
    main { display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; padding: 16px; }
    .card { background: #121836; border: 1px solid #1e254a; border-radius: 10px; overflow: hidden; }
    .card h2 { margin: 0; padding: 12px 16px; font-size: 14px; background: #0f1530; border-bottom: 1px solid #1e254a; }
    #events { height: 380px; overflow: auto; padding: 12px 16px; font-size: 13px; line-height: 1.5; }
    .row { display: grid; grid-template-columns: 110px 70px 1fr; gap: 10px; padding: 6px 0; border-bottom: 1px dashed #1e254a; }
    .row:last-child { border-bottom: 0; }
    .ok { color: #72f1b8; }
    .warn { color: #ffd866; }
    .err { color: #ff6e6e; }
    footer { padding: 8px 16px; text-align: right; opacity: 0.7; font-size: 12px; }
    .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 12px 16px; }
    .kpi { background: #0b1020; border: 1px solid #1e254a; border-radius: 8px; padding: 12px; text-align: center; }
    .kpi h3 { margin: 0; font-size: 12px; opacity: 0.8; }
    .kpi p { margin: 8px 0 0; font-size: 20px; font-weight: 700; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <header>
    <h1>VC Pipeline — Real-time Dashboard</h1>
  </header>
  <main>
    <section class="card">
      <h2>Throughput (jobs/min)</h2>
      <div style="padding:12px 16px"><canvas id="throughput"></canvas></div>
      <div class="kpis">
        <div class="kpi"><h3>In Flight</h3><p id="kpi-inflight">0</p></div>
        <div class="kpi"><h3>Completed</h3><p id="kpi-completed">0</p></div>
        <div class="kpi"><h3>Failed</h3><p id="kpi-failed">0</p></div>
        <div class="kpi"><h3>Error Rate</h3><p id="kpi-error">0%</p></div>
      </div>
    </section>
    <section class="card">
      <h2>Events</h2>
      <div id="events"></div>
    </section>
  </main>
  <footer>Secure • Scalable • Observable</footer>
  <script>
    const wsUrl = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws' + (location.search || '');
    const ws = new WebSocket(wsUrl);
    const events = document.getElementById('events');
    const inflight = document.getElementById('kpi-inflight');
    const completed = document.getElementById('kpi-completed');
    const failed = document.getElementById('kpi-failed');
    const errorRate = document.getElementById('kpi-error');

    const ctx = document.getElementById('throughput').getContext('2d');
    const dataPoints = [];
    const labels = [];
    const chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Jobs/min', data: dataPoints, borderColor: '#72f1b8', tension: .2 }] },
      options: { scales: { y: { beginAtZero: true } } }
    });

    const stats = { inflight: 0, completed: 0, failed: 0, window: [] };
    function addEventRow(e) {
      const row = document.createElement('div');
      row.className = 'row';
      const ts = new Date(e.timestamp).toLocaleTimeString();
      const status = e.status || 'info';
      const cls = status === 'ok' || status === 'completed' ? 'ok' : (status === 'failed' || status === 'error' ? 'err' : 'warn');
      row.innerHTML = `<span>${ts}</span><span class="${cls}">${status}</span><span>[${e.id}] ${e.stage} — ${e.message || ''}</span>`;
      events.prepend(row);
    }

    function updateStats(e) {
      if (e.stage === 'job' && e.status === 'started') stats.inflight++;
      if (e.stage === 'job' && (e.status === 'completed' || e.status === 'failed')) stats.inflight = Math.max(0, stats.inflight - 1);
      if (e.status === 'completed') stats.completed++; if (e.status === 'failed') stats.failed++;
      inflight.textContent = String(stats.inflight);
      completed.textContent = String(stats.completed);
      failed.textContent = String(stats.failed);
      const total = stats.completed + stats.failed; errorRate.textContent = total ? Math.round((stats.failed / total) * 100) + '%': '0%';
    }

    function tickThroughput() {
      const now = new Date();
      const minuteKey = now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0');
      const last = labels[labels.length - 1];
      if (last !== minuteKey) { labels.push(minuteKey); dataPoints.push(0); if (labels.length > 30) { labels.shift(); dataPoints.shift(); } chart.update(); }
      dataPoints[dataPoints.length - 1] += 1; chart.update();
    }

    ws.onmessage = (msg) => {
      try { const e = JSON.parse(msg.data); addEventRow(e); updateStats(e); if (e.status === 'completed') tickThroughput(); }
      catch(_){}
    };
  </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
	if (req.url === '/healthz') {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ status: 'ok' }));
		return;
	}
	res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
	res.end(renderHtml());
});

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (socket, req) => {
	if (AUTH_TOKEN) {
		const url = new URL(req.url, `http://${req.headers.host}`);
		const token = url.searchParams.get('token') || (req.headers['authorization'] || '').replace('Bearer ', '');
		if (token !== AUTH_TOKEN) {
			socket.close(1008, 'Unauthorized');
			return;
		}
	}
	socket.send(JSON.stringify({ id: 'server', stage: 'system', status: 'ok', message: 'Connected', timestamp: new Date().toISOString() }));
});

function broadcast(json) {
	const data = JSON.stringify(json);
	for (const client of wss.clients) {
		if (client.readyState === 1) client.send(data);
	}
}

async function start() {
	const sub = createClient({ url: REDIS_URL });
	sub.on('error', (err) => console.error('[redis] subscriber error', err));
	await sub.connect();
	await sub.subscribe(EVENTS_CHANNEL, (message) => {
		try {
			const evt = JSON.parse(message);
			if (validateEvent(evt)) broadcast(evt);
		} catch (err) {
			// ignore invalid
		}
	});
	server.listen(DASHBOARD_PORT, () => {
		console.log(`Dashboard listening on http://localhost:${DASHBOARD_PORT}`);
	});
}

start().catch((err) => {
	console.error('Failed to start dashboard', err);
	process.exit(1);
});

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));

