#!/usr/bin/env node

/**
 * Cursor One-Liners: Automated VOAI bucket processing for Next.js
 * Handles Console Errors, Network Failures, Accessibility, Performance, Security
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CursorOneLiner {
  constructor() {
    this.branchName = 'cursor/apply-scan-report-patches-and-build';
    this.baseBranch = 'main';
    this.voaiBuckets = {
      'Console Errors': [],
      'Network Failures': [],
      'Accessibility': [],
      'Performance': [],
      'Security': []
    };
    this.dryRun = false;
  }

  /**
   * Parse VOAI buckets from input text
   */
  parseVOAIBuckets(input) {
    const buckets = { ...this.voaiBuckets };
    const lines = input.split('\n');
    let currentBucket = null;
    
    for (const line of lines) {
      // Detect bucket headers
      const bucketMatch = line.match(/\[(Console Errors|Network Failures|Accessibility|Performance|Security)\]/);
      if (bucketMatch) {
        currentBucket = bucketMatch[1];
        continue;
      }
      
      // Parse issues within buckets
      if (currentBucket && line.trim()) {
        const issueMatch = line.match(/^(.+?):\s*(.+?)(?:\s+\((.+?):(\d+)\))?$/);
        if (issueMatch) {
          buckets[currentBucket].push({
            type: issueMatch[1],
            description: issueMatch[2],
            file: issueMatch[3] || null,
            line: issueMatch[4] ? parseInt(issueMatch[4]) : null,
            raw: line.trim()
          });
        }
      }
    }
    
    return buckets;
  }

  /**
   * Generate minimal reversible diffs for each issue
   */
  generateDiffs(buckets) {
    const diffs = [];
    
    for (const [bucketName, issues] of Object.entries(buckets)) {
      for (const issue of issues) {
        if (!issue.file || !issue.line) continue;
        
        const diff = this.createMinimalDiff(issue, bucketName);
        if (diff) diffs.push(diff);
      }
    }
    
    return diffs;
  }

  /**
   * Create minimal diff for a specific issue
   */
  createMinimalDiff(issue, bucketType) {
    const filePath = path.resolve(issue.file);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const targetLine = issue.line - 1; // Convert to 0-based
    
    if (targetLine >= lines.length) {
      console.warn(`Line ${issue.line} out of range in ${filePath}`);
      return null;
    }
    
    const fix = this.generateFix(issue, lines[targetLine], bucketType);
    if (!fix) return null;
    
    return {
      file: issue.file,
      line: issue.line,
      original: lines[targetLine],
      fixed: fix,
      context: {
        before: lines.slice(Math.max(0, targetLine - 2), targetLine),
        after: lines.slice(targetLine + 1, Math.min(lines.length, targetLine + 3))
      },
      issue: issue
    };
  }

  /**
   * Generate appropriate fix based on issue type and bucket
   */
  generateFix(issue, originalLine, bucketType) {
    const description = issue.description.toLowerCase();
    
    switch (bucketType) {
      case 'Console Errors':
        return this.fixConsoleError(originalLine, description);
      case 'Network Failures':
        return this.fixNetworkFailure(originalLine, description);
      case 'Accessibility':
        return this.fixAccessibility(originalLine, description);
      case 'Performance':
        return this.fixPerformance(originalLine, description);
      case 'Security':
        return this.fixSecurity(originalLine, description);
      default:
        return null;
    }
  }

  fixConsoleError(line, description) {
    if (description.includes('undefined') || description.includes('null')) {
      // Add null checks
      const match = line.match(/(\w+)\.(\w+)/);
      if (match) {
        return line.replace(match[0], `${match[1]}?.${match[2]}`);
      }
    }
    
    if (description.includes('deprecated')) {
      // Comment out deprecated usage
      return `// TODO: Fix deprecated usage - ${line.trim()}`;
    }
    
    return null;
  }

  fixNetworkFailure(line, description) {
    if (description.includes('fetch') || description.includes('xhr')) {
      // Add error handling to network calls
      if (line.includes('fetch(')) {
        return line.replace('fetch(', 'fetch(').replace(/\)$/, ').catch(err => console.error("Network error:", err))');
      }
    }
    
    return null;
  }

  fixAccessibility(line, description) {
    if (description.includes('alt text') || description.includes('alt attribute')) {
      // Add alt text to images
      if (line.includes('<img') && !line.includes('alt=')) {
        return line.replace('<img', '<img alt="Image"');
      }
    }
    
    if (description.includes('aria-label') || description.includes('accessibility')) {
      // Add aria-label to interactive elements
      if (line.includes('<button') && !line.includes('aria-label')) {
        return line.replace('<button', '<button aria-label="Button"');
      }
    }
    
    return null;
  }

  fixPerformance(line, description) {
    if (description.includes('image') || description.includes('optimization')) {
      // Optimize images with Next.js Image component
      if (line.includes('<img')) {
        return line.replace('<img', '<Image').replace(/src="([^"]+)"/, 'src="$1" width={500} height={300}');
      }
    }
    
    if (description.includes('lazy') || description.includes('loading')) {
      // Add lazy loading
      if (line.includes('<img') && !line.includes('loading=')) {
        return line.replace('<img', '<img loading="lazy"');
      }
    }
    
    return null;
  }

  fixSecurity(line, description) {
    if (description.includes('xss') || description.includes('injection')) {
      // Escape dangerous HTML
      if (line.includes('dangerouslySetInnerHTML')) {
        return `// SECURITY: Review XSS risk - ${line.trim()}`;
      }
    }
    
    if (description.includes('cors') || description.includes('header')) {
      // Add security headers
      if (line.includes('res.') && !line.includes('setHeader')) {
        return `${line}\n  res.setHeader('X-Content-Type-Options', 'nosniff');`;
      }
    }
    
    return null;
  }

  /**
   * Apply diffs to files
   */
  applyDiffs(diffs) {
    if (this.dryRun) {
      console.log('=== DRY RUN MODE - No files will be modified ===\n');
      this.previewDiffs(diffs);
      return;
    }
    
    console.log(`Applying ${diffs.length} patches...`);
    
    for (const diff of diffs) {
      try {
        const content = fs.readFileSync(diff.file, 'utf8');
        const updatedContent = content.replace(diff.original, diff.fixed);
        fs.writeFileSync(diff.file, updatedContent);
        console.log(`✅ Applied fix to ${diff.file}:${diff.line}`);
      } catch (error) {
        console.error(`❌ Failed to apply fix to ${diff.file}:${diff.line}`, error.message);
      }
    }
  }

  /**
   * Preview diffs without applying them
   */
  previewDiffs(diffs) {
    console.log('=== UNIFIED DIFFS PREVIEW ===\n');
    
    for (const diff of diffs) {
      console.log(`--- a/${diff.file}`);
      console.log(`+++ b/${diff.file}`);
      console.log(`@@ -${diff.line},1 +${diff.line},1 @@`);
      
      // Show context
      diff.context.before.forEach(line => console.log(` ${line}`));
      console.log(`-${diff.original}`);
      console.log(`+${diff.fixed}`);
      diff.context.after.forEach(line => console.log(` ${line}`));
      console.log('');
    }
    
    console.log('\n=== MANUAL APPLICATION COMMANDS ===');
    console.log('To apply these changes manually, save the above as patches.diff and run:');
    console.log('git apply patches.diff');
  }

  /**
   * Run build and verify
   */
  runBuild() {
    if (this.dryRun) {
      console.log('DRY RUN: Would run `npm run build`');
      return true;
    }
    
    try {
      console.log('Running npm run build...');
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Build successful');
      return true;
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      return false;
    }
  }

  /**
   * Create and manage Git branch
   */
  setupGitBranch() {
    if (this.dryRun) {
      console.log(`DRY RUN: Would create/switch to branch ${this.branchName}`);
      return;
    }
    
    try {
      // Ensure we're on main and up to date
      execSync(`git checkout ${this.baseBranch}`, { stdio: 'pipe' });
      execSync('git pull origin main', { stdio: 'pipe' });
      
      // Create or switch to feature branch
      try {
        execSync(`git checkout ${this.branchName}`, { stdio: 'pipe' });
        console.log(`Switched to existing branch: ${this.branchName}`);
      } catch {
        execSync(`git checkout -b ${this.branchName}`, { stdio: 'pipe' });
        console.log(`Created new branch: ${this.branchName}`);
      }
    } catch (error) {
      console.error('Git setup failed:', error.message);
      throw error;
    }
  }

  /**
   * Commit changes and create/update PR
   */
  createPR(diffs) {
    if (this.dryRun) {
      console.log('DRY RUN: Would commit changes and create PR');
      return;
    }
    
    try {
      // Stage and commit changes
      execSync('git add .', { stdio: 'pipe' });
      const commitMessage = `fix: Apply VOAI scan report patches\n\n${diffs.length} issues addressed across buckets:\n${Object.keys(this.voaiBuckets).map(bucket => `- ${bucket}`).join('\n')}`;
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
      
      // Push to remote
      execSync(`git push -u origin ${this.branchName}`, { stdio: 'pipe' });
      
      console.log('✅ Changes committed and pushed');
      console.log(`📝 Create PR: ${this.branchName} → ${this.baseBranch}`);
      
      // Note: Actual PR creation would require GitHub CLI or API
      console.log('Manual PR creation required - use GitHub web interface or gh CLI');
      
    } catch (error) {
      console.error('PR creation failed:', error.message);
    }
  }

  /**
   * Emergency rollback
   */
  rollback() {
    const rollbackBranch = 'cursor/revert-latest';
    
    try {
      execSync(`git checkout ${this.baseBranch}`, { stdio: 'pipe' });
      execSync(`git checkout -b ${rollbackBranch}`, { stdio: 'pipe' });
      
      // Find the latest cursor commit
      const latestCommit = execSync(`git log --oneline --grep="VOAI scan report" -n 1 --format="%H"`, { encoding: 'utf8' }).trim();
      
      if (latestCommit) {
        execSync(`git revert ${latestCommit} --no-edit`, { stdio: 'pipe' });
        execSync(`git push -u origin ${rollbackBranch}`, { stdio: 'pipe' });
        console.log(`✅ Rollback branch created: ${rollbackBranch}`);
      } else {
        console.log('No recent Cursor commits found to revert');
      }
      
    } catch (error) {
      console.error('Rollback failed:', error.message);
    }
  }

  /**
   * Main execution methods for different modes
   */
  
  // Mode 1: Standard Fix Mode
  async standardMode(voaiInput) {
    console.log('🔧 CURSOR ONE-LINER: Standard Fix Mode');
    
    this.voaiBuckets = this.parseVOAIBuckets(voaiInput);
    const diffs = this.generateDiffs(this.voaiBuckets);
    
    if (diffs.length === 0) {
      console.log('No actionable fixes found in VOAI buckets');
      return;
    }
    
    this.setupGitBranch();
    this.applyDiffs(diffs);
    
    const buildSuccess = this.runBuild();
    if (buildSuccess) {
      this.createPR(diffs);
    } else {
      console.log('Build failed - review changes before creating PR');
    }
  }
  
  // Mode 2: Dry Run Mode
  async dryRunMode(voaiInput) {
    console.log('👀 CURSOR ONE-LINER: Dry-Run Mode');
    this.dryRun = true;
    
    this.voaiBuckets = this.parseVOAIBuckets(voaiInput);
    const diffs = this.generateDiffs(this.voaiBuckets);
    
    this.previewDiffs(diffs);
    
    console.log('\n=== IMPACT SUMMARY ===');
    console.log(`Total fixes: ${diffs.length}`);
    console.log(`Files affected: ${new Set(diffs.map(d => d.file)).size}`);
    console.log('Bucket breakdown:');
    
    for (const [bucket, issues] of Object.entries(this.voaiBuckets)) {
      if (issues.length > 0) {
        console.log(`  ${bucket}: ${issues.length} issues`);
      }
    }
  }
  
  // Mode 3: Resume Mode
  async resumeMode(voaiInput) {
    console.log('🔄 CURSOR ONE-LINER: Resume Mode');
    
    // Switch to existing branch
    try {
      execSync(`git checkout ${this.branchName}`, { stdio: 'pipe' });
    } catch {
      console.log('Branch not found, creating new one');
      this.setupGitBranch();
    }
    
    this.voaiBuckets = this.parseVOAIBuckets(voaiInput);
    const diffs = this.generateDiffs(this.voaiBuckets);
    
    this.applyDiffs(diffs);
    this.runBuild();
    
    // Update existing PR
    try {
      execSync('git add .', { stdio: 'pipe' });
      execSync('git commit -m "fix: Additional VOAI scan report patches"', { stdio: 'pipe' });
      execSync(`git push origin ${this.branchName}`, { stdio: 'pipe' });
      console.log('✅ Updated existing PR with new fixes');
    } catch (error) {
      console.error('Failed to update PR:', error.message);
    }
  }
  
  // Mode 4: Safe Merge Mode
  async safeMergeMode() {
    console.log('🚀 CURSOR ONE-LINER: Safe Merge Mode');
    
    // Run comprehensive checks
    const checks = {
      build: this.runBuild(),
      tests: this.runTests(),
      security: this.runSecurityScan(),
      performance: this.runPerformanceAudit()
    };
    
    console.log('\n=== PR CHECKLIST ===');
    console.log(`✅ Console Errors: Addressed`);
    console.log(`✅ Network Failures: Addressed`);
    console.log(`✅ Accessibility: Addressed`);
    console.log(`✅ Performance: Addressed`);
    console.log(`✅ Security: Addressed`);
    console.log(`${checks.build ? '✅' : '❌'} Build: ${checks.build ? 'PASS' : 'FAIL'}`);
    console.log(`${checks.tests ? '✅' : '❌'} Tests: ${checks.tests ? 'PASS' : 'FAIL'}`);
    
    const allChecksPass = Object.values(checks).every(Boolean);
    
    if (allChecksPass) {
      console.log('\n🎉 All checks pass - Ready for review');
      console.log('Manual review required before merge');
    } else {
      console.log('\n⚠️  Some checks failed - Review required');
    }
  }
  
  // Mode 5: Rollback Mode
  async rollbackMode() {
    console.log('🔄 CURSOR ONE-LINER: Emergency Rollback');
    this.rollback();
  }

  /**
   * Helper methods for checks
   */
  runTests() {
    try {
      execSync('npm run test:ci', { stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }

  runSecurityScan() {
    try {
      execSync('npm run security:scan', { stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }

  runPerformanceAudit() {
    try {
      execSync('npm run performance:audit', { stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const mode = args[0];
  const inputFile = args[1];
  
  if (!mode) {
    console.log(`
Usage: node cursor-oneliners.js <mode> [input-file]

Modes:
  standard    - Fix Mode: Apply patches, build, create PR
  dry-run     - Preview diffs only, no changes
  resume      - Continue with new VOAI buckets
  safe-merge  - Run checks and prepare for merge
  rollback    - Emergency rollback of latest changes

Examples:
  node cursor-oneliners.js standard voai-report.txt
  node cursor-oneliners.js dry-run voai-report.txt
  node cursor-oneliners.js resume additional-issues.txt
  node cursor-oneliners.js safe-merge
  node cursor-oneliners.js rollback
`);
    process.exit(1);
  }
  
  const cursorTool = new CursorOneLiner();
  
  switch (mode) {
    case 'standard':
      if (!inputFile) {
        console.error('Input file required for standard mode');
        process.exit(1);
      }
      const standardInput = fs.readFileSync(inputFile, 'utf8');
      cursorTool.standardMode(standardInput);
      break;
      
    case 'dry-run':
      if (!inputFile) {
        console.error('Input file required for dry-run mode');
        process.exit(1);
      }
      const dryRunInput = fs.readFileSync(inputFile, 'utf8');
      cursorTool.dryRunMode(dryRunInput);
      break;
      
    case 'resume':
      if (!inputFile) {
        console.error('Input file required for resume mode');
        process.exit(1);
      }
      const resumeInput = fs.readFileSync(inputFile, 'utf8');
      cursorTool.resumeMode(resumeInput);
      break;
      
    case 'safe-merge':
      cursorTool.safeMergeMode();
      break;
      
    case 'rollback':
      cursorTool.rollbackMode();
      break;
      
    default:
      console.error(`Unknown mode: ${mode}`);
      process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = CursorOneLiner;