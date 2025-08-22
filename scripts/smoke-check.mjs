import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const PUBLIC_DIR = resolve('public');
const PORT = 5050;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

const server = http.createServer((req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = join(PUBLIC_DIR, urlPath);
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  const type = mime[extname(filePath)] || 'application/octet-stream';
  res.writeHead(200, { 'content-type': type });
  createReadStream(filePath).pipe(res);
});

function fail(message) {
  console.error(message);
  try { server.close(); } catch {}
  process.exit(1);
}

server.listen(PORT, async () => {
  try {
    const homeRes = await fetch(`http://localhost:${PORT}/`);
    const homeText = await homeRes.text();
    if (!homeRes.ok) fail(`Home status not OK: ${homeRes.status}`);
    if (!homeText.includes('<main') || !homeText.includes('id="features"')) {
      fail('Homepage body appears empty or missing sections.');
    }

    const healthRes = await fetch(`http://localhost:${PORT}/api/health`);
    const healthJson = await healthRes.json();
    if (!healthRes.ok || !healthJson.ok) fail('Health endpoint failed');

    console.log('Smoke check passed.');
    server.close();
    process.exit(0);
  } catch (err) {
    fail(`Smoke check error: ${err?.message || err}`);
  }
});