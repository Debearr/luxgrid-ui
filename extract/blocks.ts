export type FencedBlock = {
  language: string;
  content: string;
  startIndex: number;
  endIndex: number;
};

const FENCE_REGEX = /```([a-zA-Z0-9_-]+)\n([\s\S]*?)\n```/g;

export function extractFencedBlocks(text: string): FencedBlock[] {
  const blocks: FencedBlock[] = [];
  let match: RegExpExecArray | null;
  while ((match = FENCE_REGEX.exec(text)) !== null) {
    blocks.push({
      language: match[1],
      content: match[2],
      startIndex: match.index,
      endIndex: FENCE_REGEX.lastIndex,
    });
  }
  return blocks;
}

export function extractFirstByLanguage(text: string, language: string): string | undefined {
  return extractFencedBlocks(text).find(b => b.language.toLowerCase() === language.toLowerCase())?.content;
}

export function extractAllByLanguage(text: string, language: string): string[] {
  return extractFencedBlocks(text)
    .filter(b => b.language.toLowerCase() === language.toLowerCase())
    .map(b => b.content);
}

export function extractSummaryJson(text: string): string | undefined {
  return extractFirstByLanguage(text, 'json');
}

export function extractCategoryJsons(text: string): string[] {
  return extractAllByLanguage(text, 'json').slice(1); // naive: assuming first json is summary
}

export function extractPlanJson(text: string): string | undefined {
  const jsonBlocks = extractAllByLanguage(text, 'json');
  return jsonBlocks.length > 1 ? jsonBlocks[jsonBlocks.length - 1] : jsonBlocks[0];
}

export function extractTrackerCsv(text: string): string | undefined {
  return extractFirstByLanguage(text, 'csv');
}

export function extractChecklistMd(text: string): string | undefined {
  return extractFirstByLanguage(text, 'md');
}

