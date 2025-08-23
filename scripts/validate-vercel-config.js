const fs = require('fs');
const path = require('path');

// Brand compliance validation
function validateBrandCompliance() {
  console.log('🎨 Validating brand compliance...');

  // Check next.config.mjs for brand headers
  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
  if (fs.existsSync(nextConfigPath)) {
    const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

    const requiredHeaders = ['X-NOID-Council', 'X-Brand-Compliant'];
    const missingHeaders = requiredHeaders.filter(header => !nextConfig.includes(header));

    if (missingHeaders.length > 0) {
      console.warn(`⚠️  Brand headers missing in next.config.mjs: ${missingHeaders.join(', ')}`);
    } else {
      console.log('✅ Brand headers validated in next.config.mjs');
    }
  }

  // Validate landing page has brand elements (basic check)
  const landingPagePath = path.join(process.cwd(), 'src/app/page.tsx');
  if (fs.existsSync(landingPagePath)) {
    const landingContent = fs.readFileSync(landingPagePath, 'utf8');

    const brandElements = ['NØID', 'Drive Unseen', 'Tap Less', 'Earn Smart'];
    const missingElements = brandElements.filter(element => !landingContent.includes(element));

    if (missingElements.length > 0) {
      console.warn(`⚠️  Landing page missing brand elements: ${missingElements.join(', ')}`);
    } else {
      console.log('✅ Landing page brand elements validated');
    }
  }
}

// CALL the validation function at the end:
validateBrandCompliance();