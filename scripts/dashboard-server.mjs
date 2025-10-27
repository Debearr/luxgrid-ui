#!/usr/bin/env node
import { WebSocketServer } from 'ws';
import http from 'http';
import url from 'url';

const PORT = Number(process.env.DASHBOARD_PORT || 3001);
const HOST = process.env.DASHBOARD_HOST || '0.0.0.0';
const isDemo = String(process.env.DASHBOARD_DEMO || '0') === '1';

const systemState = {
  activeJobs: 0,
  queuedJobs: 0,
  completedToday: 0,
  avgDuration: 0,
};

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname === '/') {
    const html = generateDashboardHTML(PORT);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }
  if (parsed.pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getSystemStatus()));
    return;
  }
  res.writeHead(404);
  res.end('Not Found');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  try {
    ws.send(JSON.stringify({ type: 'status', data: getSystemStatus() }));
  } catch {}

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(String(raw));
      if (data && data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', ts: Date.now() }));
      }
    } catch {}
  });
});

function broadcast(obj) {
  const msg = JSON.stringify(obj);
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(msg);
  }
}

function getSystemStatus() {
  return {
    activeJobs: systemState.activeJobs,
    queuedJobs: systemState.queuedJobs,
    completedToday: systemState.completedToday,
    avgDuration: systemState.avgDuration,
  };
}

function generateDashboardHTML(port) {
  // Avoid nested template literals by using classic string concatenation for dynamic sections
  const head = '<!DOCTYPE html>'+
  '<html>'+
  '<head>'+
  '<title>VC Pipeline Dashboard</title>'+
  '<meta charset="utf-8" />'+
  '<meta name="viewport" content="width=device-width, initial-scale=1" />'+
  '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>'+
  '<style>'+
  'body{font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;margin:0;padding:20px;background:#0a0e1a;color:#fff}'+
  '.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px}'+
  '.status{display:flex;gap:20px;margin-bottom:30px}'+
  '.metric{background:#1a2332;padding:15px;border-radius:8px;min-width:120px}'+
  '.metric-value{font-size:24px;font-weight:bold;color:#4a9eff}'+
  '.metric-label{font-size:12px;color:#a8b2c7;text-transform:uppercase}'+
  '.jobs{display:grid;grid-template-columns:1fr 1fr;gap:20px}'+
  '.job-card{background:#1a2332;padding:15px;border-radius:8px;border-left:4px solid #4a9eff}'+
  '.job-progress{background:#0a0e1a;height:4px;border-radius:2px;margin:10px 0}'+
  '.job-progress-bar{background:#4a9eff;height:100%;border-radius:2px;transition:width .3s}'+
  '.chart-container{background:#1a2332;padding:20px;border-radius:8px;margin:20px 0}'+
  '</style>'+
  '</head>';

  const bodyOpen = '<body>'+
  '<div class="header">'+
  '<h1>VC Pipeline Dashboard</h1>'+
  '<div id="connection-status">🔴 Disconnected</div>'+
  '</div>'+
  '<div class="status">'+
  '<div class="metric"><div class="metric-value" id="active-jobs">0</div><div class="metric-label">Active Jobs</div></div>'+
  '<div class="metric"><div class="metric-value" id="queued-jobs">0</div><div class="metric-label">Queued</div></div>'+
  '<div class="metric"><div class="metric-value" id="completed-today">0</div><div class="metric-label">Completed Today</div></div>'+
  '<div class="metric"><div class="metric-value" id="avg-duration">0s</div><div class="metric-label">Avg Duration</div></div>'+
  '</div>'+
  '<div class="jobs" id="active-jobs-container"></div>'+
  '<div class="chart-container"><canvas id="performance-chart" width="400" height="200"></canvas></div>';

  const script = '<script>(function(){' +
  'var PORT=' + port + ';' +
  'var reconnectAttempts=0,ws,performanceChart;' +
  'function connect(){' +
    "ws=new WebSocket('ws://'+location.hostname+':'+" + port + ");" +
    'var connectionStatus=document.getElementById("connection-status");' +
    'var activeJobsContainer=document.getElementById("active-jobs-container");' +
    'ws.onopen=function(){reconnectAttempts=0;connectionStatus.textContent="🟢 Connected";connectionStatus.style.color="#4a9eff";};' +
    'ws.onclose=function(){connectionStatus.textContent="🔴 Disconnected";connectionStatus.style.color="#ff4444";setTimeout(connect,Math.min(1000*Math.pow(2,reconnectAttempts++),10000));};' +
    'ws.onmessage=function(event){var message=JSON.parse(event.data);handleRealtimeUpdate(message);};' +
    'function handleRealtimeUpdate(message){switch(message.type){case"status":updateSystemMetrics(message.data);break;case"job_progress":updateJobProgress(message.data);break;case"job_completed":removeJobCard(message.data.jobId);break;}}' +
    'function updateSystemMetrics(data){document.getElementById("active-jobs").textContent=data.activeJobs||0;document.getElementById("queued-jobs").textContent=data.queuedJobs||0;document.getElementById("completed-today").textContent=data.completedToday||0;document.getElementById("avg-duration").textContent=data.avgDuration?Math.round(data.avgDuration/1000)+"s":"0s";appendPerformancePoint(data);}' +
    'function updateJobProgress(data){var jobCard=document.getElementById("job-"+data.jobId);if(!jobCard){jobCard=createJobCard(data);activeJobsContainer.appendChild(jobCard);}var progressBar=jobCard.querySelector(".job-progress-bar");var stageElement=jobCard.querySelector(".job-stage");progressBar.style.width=(data.progress||0)+"%";stageElement.textContent=(data.stage||"").replace("_"," ").toUpperCase();}' +
    'function createJobCard(data){var card=document.createElement("div");card.className="job-card";card.id="job-"+data.jobId;card.innerHTML=' +
      '"<div style=\\"display:flex;justify-content:space-between;align-items:center;\\">"+' +
      '"<strong>"+(data.title||("Job "+data.jobId))+"</strong>"+' +
      '"<span class=\\"job-stage\\">"+((data.stage||"QUEUED").replace("_"," ").toUpperCase())+" </span>"+' +
      '"</div>"+' +
      '"<div class=\\"job-progress\\"><div class=\\"job-progress-bar\\" style=\\"width: "+(data.progress||0)+"%\\"></div></div>"+' +
      '"<div style=\\"font-size:12px;color:#a8b2c7;\\">"+(data.description||"")+" </div>";' +
      'return card;}' +
    'function removeJobCard(jobId){var card=document.getElementById("job-"+jobId);if(card)card.remove();}' +
    'function initChart(){var ctx=document.getElementById("performance-chart").getContext("2d");performanceChart=new Chart(ctx,{type:"line",data:{labels:[],datasets:[{label:"Completion Rate",data:[],borderColor:"#4a9eff",tension:0.3}]},options:{scales:{y:{beginAtZero:true,max:100}}}});}' +
    'function appendPerformancePoint(status){if(!performanceChart)return;var now=new Date();var label=now.toLocaleTimeString();var completionRate=(status.completedToday%100);performanceChart.data.labels.push(label);performanceChart.data.datasets[0].data.push(completionRate);if(performanceChart.data.labels.length>50){performanceChart.data.labels.shift();performanceChart.data.datasets[0].data.shift();}performanceChart.update("none");}' +
    'window.addEventListener("load",initChart);' +
  '}' +
  'connect();' +
  '})();</script>';

  const bodyClose = '</body></html>';
  return head + bodyOpen + script + bodyClose;
}

if (isDemo) {
  setInterval(() => {
    systemState.activeJobs = Math.max(0, Math.min(5, systemState.activeJobs + (Math.random() > 0.5 ? 1 : -1)));
    systemState.queuedJobs = Math.max(0, Math.min(10, systemState.queuedJobs + (Math.random() > 0.6 ? 1 : -1)));
    systemState.completedToday += Math.random() > 0.7 ? 1 : 0;
    systemState.avgDuration = 20000 + Math.floor(Math.random() * 40000);
    broadcast({ type: 'status', data: getSystemStatus() });
    if (Math.random() > 0.5) {
      const jobId = Math.floor(Math.random() * 1000);
      const progress = Math.floor(Math.random() * 100);
      const stage = ['fetching_data', 'processing', 'enriching', 'saving'][Math.floor(Math.random() * 4)];
      broadcast({ type: 'job_progress', data: { jobId, progress, stage, title: 'Demo Job ' + jobId, description: 'Synthetic load' } });
      if (progress > 90) broadcast({ type: 'job_completed', data: { jobId } });
    }
  }, 1200);
}

server.on('listening', () => {
  const address = server.address();
  const urlStr = typeof address === 'string' ? address : `http://${HOST}:${PORT}`;
  console.log('Dashboard server listening on ' + urlStr);
  if (isDemo) console.log('Dashboard running in DEMO mode. Set DASHBOARD_DEMO=0 to disable.');
});

server.on('error', (err) => {
  console.error('Dashboard server error:', err?.message || err);
});

server.listen(PORT, HOST);

