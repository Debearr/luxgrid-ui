#!/usr/bin/env node
const fs = require('fs');
const path = 'packages/config/brand.json';
const ok = (msg)=>console.log('✔️', msg), bad=(m)=>console.error('❌', m);
const b = JSON.parse(fs.readFileSync(path,'utf8'));
let fail = false;
if (b.colors.gold !== '#FFD700') { bad('Gold must be #FFD700'); fail=true; } else ok('Gold token ok');
['A_institutional','B_disruptor'].forEach(m => { if(!b.modes.includes(m)){ bad(`Missing mode ${m}`); fail=true; }});
if (!Array.isArray(b.motion.durationMs) || b.motion.durationMs[0] < 150) { bad('Motion tokens invalid'); fail=true; } else ok('Motion tokens ok');
process.exit(fail?1:0);
