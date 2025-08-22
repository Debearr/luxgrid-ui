const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function parseCurrencyToNumber(token) {
  if (!token) return NaN;
  const cleaned = token.replace(/[$,\s]/g, '');
  const match = cleaned.match(/^(\d+(?:\.\d+)?)([mk])?$/i) || cleaned.match(/^(\d+)$/);
  if (!match) return NaN;
  let value = parseFloat(match[1]);
  const suffix = match[2]?.toLowerCase();
  if (suffix === 'm') value *= 1_000_000;
  if (suffix === 'k') value *= 1_000;
  return Math.round(value);
}

function extractFinanceSection(markdown) {
  const startMatch = markdown.match(/^##\s*Finance[\s\S]*?$/mi);
  if (!startMatch) return '';
  const startIndex = startMatch.index;
  const afterStartIndex = startIndex + startMatch[0].length;
  const rest = markdown.slice(afterStartIndex);
  const nextHeadingIdx = rest.search(/^##\s+/m);
  const section = nextHeadingIdx === -1 ? rest : rest.slice(0, nextHeadingIdx);
  return section;
}

function parseScenarioLine(line) {
  // Example lines:
  // - Base: ARR $1.2M, burn $150k/mo, break-even month 16.
  // - Bear: ARR $700k, burn $160k/mo, runway 12 months; no break-even within horizon.
  // - Bull: ARR $3.0M, burn $180k/mo, break-even month 9.
  const headerMatch = line.match(/^\s*-\s*(Base|Bear|Bull)\s*:\s*(.*)$/i);
  if (!headerMatch) return null;
  const name = headerMatch[1].toLowerCase();
  const rest = headerMatch[2];

  const arrMatch = rest.match(/ARR\s*\$?([^,\s]+)/i);
  const burnMatch = rest.match(/burn\s*\$?([^,\s/]+)(?:\/(?:mo|month))?/i);
  const breakevenMatch = rest.match(/break-?even\s*month\s*(\d+)/i);
  const hasNoBreakeven = /no\s*break[- ]?even/i.test(rest);
  const runwayMatch = rest.match(/runway\s*(\d+)\s*months?/i);

  return {
    scenario: name, // base | bear | bull
    arr: arrMatch ? parseCurrencyToNumber(arrMatch[1]) : undefined,
    burn: burnMatch ? parseCurrencyToNumber(burnMatch[1]) : undefined,
    breakevenMonth: breakevenMatch ? Number(breakevenMatch[1]) : (hasNoBreakeven ? null : undefined),
    hasNoBreakeven,
    runwayMonths: runwayMatch ? Number(runwayMatch[1]) : undefined,
    raw: line.trim()
  };
}

function main() {
  const mdPath = path.resolve(__dirname, '..', 'reports', 'noid_board_review.md');
  const jsonPath = path.resolve(__dirname, '..', 'reports', 'noid_financials.json');

  if (!fs.existsSync(mdPath)) {
    fail(`Missing markdown report at ${mdPath}`);
    return;
  }
  if (!fs.existsSync(jsonPath)) {
    fail(`Missing financials JSON at ${jsonPath}`);
    return;
  }

  const md = fs.readFileSync(mdPath, 'utf8');
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Check for literal "\n" characters (indicative of one-line file with escaped newlines)
  if (md.includes('\\n')) {
    fail("Markdown contains literal \\n sequences; convert to real newlines.");
  }

  const section = extractFinanceSection(md);
  if (!section || !section.trim()) {
    fail('Finance section not found or empty.');
  }

  const scenarioLines = section
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.startsWith('-'));

  const parsed = scenarioLines
    .map(parseScenarioLine)
    .filter(Boolean);

  const expected = json.scenarios || {};
  const errors = [];

  function checkScenario(name) {
    const lower = name.toLowerCase();
    const p = parsed.find(x => x.scenario === lower);
    const j = expected[lower];
    if (!j) {
      errors.push(`JSON missing scenario '${name}'.`);
      return;
    }
    if (!p) {
      errors.push(`Markdown missing scenario line for '${name}'.`);
      return;
    }

    if (p.arr !== j.arr) {
      errors.push(`${name}: ARR mismatch (md=${p.arr}, json=${j.arr}). line: "${p.raw}"`);
    }
    if (p.burn !== j.burn) {
      errors.push(`${name}: burn mismatch (md=${p.burn}, json=${j.burn}). line: "${p.raw}"`);
    }

    if (j.breakeven_month == null) {
      // Should not claim a numeric break-even; allow explicit "no break-even"
      if (typeof p.breakevenMonth === 'number') {
        errors.push(`${name}: breakeven present in markdown (${p.breakevenMonth}) but JSON is null.`);
      }
    } else {
      if (p.breakevenMonth !== j.breakeven_month) {
        errors.push(`${name}: breakeven mismatch (md=${p.breakevenMonth}, json=${j.breakeven_month}). line: "${p.raw}"`);
      }
    }

    if (j.runway_months != null) {
      if (p.runwayMonths !== j.runway_months) {
        errors.push(`${name}: runway mismatch (md=${p.runwayMonths}, json=${j.runway_months}). line: "${p.raw}"`);
      }
    }
  }

  ['Base', 'Bear', 'Bull'].forEach(checkScenario);

  if (errors.length) {
    console.error('--- Report Validation Errors ---');
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  console.log('Reports validation passed ✅');
}

main();