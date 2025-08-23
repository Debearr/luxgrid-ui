const fs = require('fs');

const { VERCEL_TOKEN, GITHUB_OUTPUT } = process.env;

async function makeRequest(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

async function quickStatusCheck(deploymentId) {
  if (!deploymentId) return null;

  try {
    const url = `https://api.vercel.com/v13/deployments/${deploymentId}`;
    const options = {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const data = await makeRequest(url, options);

    if (data.readyState === 'READY' && data.target === 'preview') {
      return `https://${data.url}`;
    }
  } catch (error) {
    // Fallback to polling
    console.log('Quick status check failed, using polling method');
  }

  return null;
}

async function waitWithRetry() {
  const MAX_ATTEMPTS = 24; // 2 minutes (24 * 5s)
  const DELAY = 5000; // 5 seconds

  // Try quick status check first
  console.log('Attempting quick deployment status check...');
  const quickUrl = await quickStatusCheck(process.env.VERCEL_DEPLOYMENT_ID);
  if (quickUrl) {
    console.log(`✅ Quick check found URL: ${quickUrl}`);
    if (GITHUB_OUTPUT) {
      fs.appendFileSync(GITHUB_OUTPUT, `url=${quickUrl}\n`);
    }
    return quickUrl;
  }

  // Continue with existing polling logic...
  let attempts = 0;
  while (attempts < MAX_ATTEMPTS) {
    attempts += 1;
    const url = await quickStatusCheck(process.env.VERCEL_DEPLOYMENT_ID);
    if (url) {
      console.log(`✅ Preview ready: ${url}`);
      if (GITHUB_OUTPUT) {
        fs.appendFileSync(GITHUB_OUTPUT, `url=${url}\n`);
      }
      return url;
    }
    await new Promise(r => setTimeout(r, DELAY));
  }
  throw new Error('Timed out waiting for preview deployment');
}

module.exports = { waitWithRetry, quickStatusCheck };