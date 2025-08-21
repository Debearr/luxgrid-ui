#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const dir = 'council-reports';
if (!fs.existsSync(dir)) { console.log('No council-reports directory found.'); process.exit(0); }
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
if (!files.length) { console.log('No reports found.'); process.exit(0); }
files.forEach(f => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
    console.log('- '+ (data.seat || f) + ' : ' + (data.status || 'UNKNOWN') + ' (confidence: ' + ((data.confidence ?? 'n/a')) + ' )');
  } catch {
    console.log('- '+ f + ' : unreadable');
  }
});
