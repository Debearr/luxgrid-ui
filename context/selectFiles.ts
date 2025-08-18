export type FileEntry = {
  path: string;
  content: string;
  maxSlice?: number;
};

export const PRIORITY: Array<{ glob: string; weight: number }> = [
  { glob: 'package.json', weight: 100 },
  { glob: 'README.md', weight: 95 },
  { glob: 'tsconfig.json', weight: 90 },
  { glob: 'next.config.js', weight: 90 },
  { glob: 'app/**', weight: 85 },
  { glob: 'lib/**', weight: 80 },
  { glob: 'pages/**', weight: 75 },
  { glob: 'api/**', weight: 75 },
  { glob: 'src/**', weight: 70 },
  { glob: 'docs/**', weight: 60 },
  { glob: '**/*', weight: 10 },
];

type ScoredFileEntry = FileEntry & { score: number };

function matchGlob(filePath: string, glob: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');
  if (glob === '**/*' || glob === '**/**') return true;
  if (glob.endsWith('/**')) {
    const prefix = glob.slice(0, -3); // remove '/**'
    return normalizedPath.startsWith(prefix);
  }
  // exact filename match (allow nested path end-match)
  return (
    normalizedPath === glob ||
    normalizedPath.endsWith('/' + glob) ||
    normalizedPath.endsWith('\\' + glob)
  );
}

export function scoreByPriority(
  files: FileEntry[],
  rules: Array<{ glob: string; weight: number }> = PRIORITY,
): ScoredFileEntry[] {
  return files.map((file) => {
    let score = 0;
    for (const rule of rules) {
      if (matchGlob(file.path, rule.glob)) {
        score = Math.max(score, rule.weight);
      }
    }
    return { ...file, score };
  });
}

export function selectFilesWithBudget(files: FileEntry[], charBudget: number): FileEntry[] {
  const sorted: ScoredFileEntry[] = scoreByPriority(files, PRIORITY).sort(
    (a, b) => b.score - a.score,
  );
  const picked: FileEntry[] = [];
  let used = 0;
  for (const file of sorted) {
    const maxSize = file.maxSlice ?? file.content.length;
    const sliceSize = Math.min(file.content.length, maxSize);
    if (used + sliceSize > charBudget) continue;
    picked.push({ path: file.path, content: file.content.slice(0, sliceSize), maxSlice: file.maxSlice });
    used += sliceSize;
  }
  return picked;
}

