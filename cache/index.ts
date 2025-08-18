import fs from 'fs';
import path from 'path';

export function loadPreviousSummary(): string {
  const p = path.join('reports', 'latest', 'summary.json');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

export function maybeReuse(planJson: any, runMode: 'full' | 'diff') {
  if (runMode === 'diff') {
    // TODO: Merge previous plan intelligently by category + task title for untouched categories
    return planJson;
  }
  return planJson;
}

