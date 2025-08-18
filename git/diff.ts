import fs from 'fs';
import { execSync } from 'child_process';

function run(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function resolveBaseRef(stateFile: string): string {
  try {
    if (fs.existsSync(stateFile)) {
      const raw = fs.readFileSync(stateFile, 'utf8');
      const parsed = JSON.parse(raw || '{}');
      if (parsed.lastCommit) return parsed.lastCommit as string;
    }
  } catch {}
  // fallback to one commit behind HEAD when available
  const head = run('git rev-parse --verify HEAD');
  const hasPrev = run('git rev-parse --verify HEAD~1');
  if (head && hasPrev) return 'HEAD~1';
  // otherwise compare against empty tree (initial commit)
  const emptyTree = run('git hash-object -t tree /dev/null') || '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
  return emptyTree;
}

export function getDiffSummary(sinceTsFile = '.oneclick-last.json') {
  const baseRef = resolveBaseRef(sinceTsFile);
  const head = run('git rev-parse --verify HEAD');
  if (!head) {
    return { changed: [] as string[], deleted: [] as string[], added: [] as string[] };
  }
  const diff = run(`git diff --name-status ${baseRef}..${head}`);
  const lines = diff.split('\n').filter(Boolean);
  const changed: string[] = [];
  const deleted: string[] = [];
  const added: string[] = [];
  for (const line of lines) {
    const parts = line.split(/\s+/);
    const status = parts[0] ?? '';
    const path = parts[parts.length - 1] ?? '';
    switch (status[0]) {
      case 'A':
        added.push(path);
        break;
      case 'D':
        deleted.push(path);
        break;
      case 'R':
      case 'C':
      case 'M':
      default:
        if (path) changed.push(path);
    }
  }
  return { changed, deleted, added };
}

export function markRunComplete(sinceTsFile = '.oneclick-last.json') {
  try {
    const head = run('git rev-parse --verify HEAD');
    const payload = { lastCommit: head, updatedAt: new Date().toISOString() };
    fs.writeFileSync(sinceTsFile, JSON.stringify(payload, null, 2));
  } catch {}
}

