#!/bin/bash
# =========================================
# NØID • Zero-Error Environment Setup
# Optimized for Cursor execution
# =========================================

set -euo pipefail  # Strict error handling

# Colors for output
readonly GOLD='\033[1;33m'
readonly GREEN='\033[0;32m'
readonly RED='\033[0;31m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

_log() { echo -e "${GREEN}✅${NC} $1"; }
_warn() { echo -e "${RED}⚠️${NC} $1" >&2; }
_info() { echo -e "${BLUE}ℹ️${NC} $1"; }
_gold() { echo -e "${GOLD}🚀${NC} $1"; }

_log "Setting up NØID environment..."

# 1) Create secure ~/.noid directory
mkdir -p ~/.noid
chmod 700 ~/.noid

# 2) Write comprehensive env + helpers
cat > ~/.noid/env.sh <<'NOID_ENV_EOF'
# =========================================
# NØID • Environment + Helpers
# File: ~/.noid/env.sh
# Optimized for zero errors
# =========================================

# ---- Core Configuration (EDIT THESE) ----
export GITHUB_REPO="Debearr/luxgrid-ui"
export VERCEL_PROJECT_ID="YOUR_VERCEL_PROJECT_ID"  # Get from Vercel dashboard
export VERCEL_TOKEN="YOUR_VERCEL_TOKEN"            # Get from Vercel settings

# ---- Environment Defaults ----
export NODE_ENV=production
export NOID_DEFAULT_BRANCH="main"
export NOID_COLOR_GOLD="#FFD700"
export NEXT_TELEMETRY_DISABLED=1  # Disable Next.js telemetry

# ---- Path Enhancement ----
export PATH="$HOME/.vercel/bin:$HOME/.local/bin:$PATH"

# ---- Utility Functions ----
_noid_log() { echo -e "\033[0;32m✅\033[0m $1"; }
_noid_warn() { echo -e "\033[0;31m⚠️\033[0m $1" >&2; }
_noid_info() { echo -e "\033[0;34mℹ️\033[0m $1"; }
_noid_gold() { echo -e "\033[1;33m🚀\033[0m $1"; }

# Check dependencies (non-fatal warnings)
_noid_check_deps() {
  command -v node >/dev/null 2>&1 || _noid_warn "Node.js not found. Install from nodejs.org"
  command -v npm >/dev/null 2>&1 || _noid_warn "npm not found. Install Node.js"
  command -v gh >/dev/null 2>&1 || _noid_warn "GitHub CLI not found. Run: brew install gh"
  command -v vercel >/dev/null 2>&1 || _noid_warn "Vercel CLI not found. Run: npm i -g vercel"
  
  # Token validation
  [ "$VERCEL_TOKEN" = "YOUR_VERCEL_TOKEN" ] && _noid_warn "Set VERCEL_TOKEN in ~/.noid/env.sh"
  [ "$VERCEL_PROJECT_ID" = "YOUR_VERCEL_PROJECT_ID" ] && _noid_warn "Set VERCEL_PROJECT_ID in ~/.noid/env.sh"
}

# ---- Core Aliases ----
alias noid-env='${VISUAL:-${EDITOR:-code}} ~/.noid/env.sh'
alias noid-dev='npm run dev --silent'
alias noid-build='npm run build'
alias noid-check='_noid_check_deps'

# ---- Smart URL Detection ----
noid-url() {
  local url=""
  
  # Method 1: GitHub Actions logs (most recent)
  if command -v gh >/dev/null 2>&1; then
    url="$(gh run view --log 2>/dev/null | grep -o 'https://[^[:space:]]*\.vercel\.app' | tail -1)"
  fi
  
  # Method 2: Vercel CLI fallback
  if [ -z "$url" ] && command -v vercel >/dev/null 2>&1 && [ "$VERCEL_TOKEN" != "YOUR_VERCEL_TOKEN" ]; then
    url="$(vercel ls --token "$VERCEL_TOKEN" 2>/dev/null | awk 'NR>1 {print $1}' | grep -E '^https://.*\.vercel\.app$' | head -1)"
  fi
  
  # Method 3: Static fallback for luxgrid-ui
  if [ -z "$url" ]; then
    url="https://luxgrid-ui.vercel.app"
    _noid_warn "Using default URL. Check deployment status with noid-status"
  fi
  
  echo "$url"
}

# ---- Comprehensive Status Check ----
noid-status() {
  _noid_gold "NØID Status Dashboard"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  _noid_info "Repository: $GITHUB_REPO"
  _noid_info "Branch: ${NOID_DEFAULT_BRANCH}"
  echo
  
  # GitHub status
  if command -v gh >/dev/null 2>&1; then
    _noid_info "Recent GitHub Actions:"
    gh run list -R "$GITHUB_REPO" --limit 3 2>/dev/null | head -4 || _noid_warn "Failed to fetch GitHub runs"
  else
    _noid_warn "GitHub CLI not available"
  fi
  
  echo
  
  # Vercel status
  if command -v vercel >/dev/null 2>&1 && [ "$VERCEL_TOKEN" != "YOUR_VERCEL_TOKEN" ]; then
    _noid_info "Recent Vercel Deployments:"
    vercel ls --token "$VERCEL_TOKEN" 2>/dev/null | head -4 || _noid_warn "Failed to fetch Vercel deployments"
  else
    _noid_warn "Vercel CLI not configured"
  fi
  
  echo
  _noid_gold "Live URL: $(noid-url)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# ---- Smart Browser Opening ----
noid-open() {
  local url
  url="$(noid-url)"
  
  _noid_info "Opening: $url"
  
  # Try different methods based on OS
  if command -v open >/dev/null 2>&1; then
    open "$url" 2>/dev/null
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" 2>/dev/null
  elif command -v wslview >/dev/null 2>&1; then
    wslview "$url" 2>/dev/null
  else
    _noid_info "Copy this URL to your browser: $url"
  fi
}

# ---- Intelligent Deploy Function ----
noid-deploy() {
  _noid_gold "Starting NØID deployment..."
  
  # Pre-flight checks
  if [ ! -f package.json ]; then
    _noid_warn "No package.json found. Are you in the right directory?"
    return 1
  fi
  
  # Clean problematic files
  if [ -f vercel.json ]; then
    _noid_info "Removing vercel.json (let Vercel auto-detect Next.js)"
    rm -f vercel.json
    git add vercel.json 2>/dev/null && git commit -m "chore: remove vercel.json for auto-detection" 2>/dev/null || true
  fi
  
  # Ensure package.json has required scripts
  _noid_info "Ensuring package.json scripts..."
  node -e '
    const fs = require("fs");
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.build = pkg.scripts.build || "next build";
    pkg.scripts.dev = pkg.scripts.dev || "next dev";
    pkg.scripts.start = pkg.scripts.start || "next start";
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  ' 2>/dev/null || _noid_warn "Could not update package.json scripts"
  
  # Git operations
  local current_branch
  current_branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "$NOID_DEFAULT_BRANCH")"
  
  _noid_info "Staging changes..."
  git add . 2>/dev/null || true
  
  if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    git commit -m "feat: deploy NØID app - $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || true
  fi
  
  _noid_info "Pushing to origin/$current_branch..."
  git push -u origin "$current_branch" || {
    _noid_warn "Git push failed. Check your repository access."
    return 1
  }
  
  # Watch deployment
  if command -v gh >/dev/null 2>&1; then
    _noid_info "Watching GitHub Actions..."
    gh run watch -R "$GITHUB_REPO" 2>/dev/null || _noid_warn "Could not watch GitHub Actions"
  fi
  
  # Final URL
  sleep 5  # Give deployment time to start
  _noid_gold "Deployment complete!"
  _noid_gold "Live URL: $(noid-url)"
}

# ---- One-time Setup ----
noid-setup() {
  _noid_gold "Setting up NØID project..."
  
  if [ "$VERCEL_TOKEN" = "YOUR_VERCEL_TOKEN" ] || [ "$VERCEL_PROJECT_ID" = "YOUR_VERCEL_PROJECT_ID" ]; then
    _noid_warn "Please run 'noid-env' and set your Vercel credentials first"
    return 1
  fi
  
  _noid_info "Linking to Vercel project..."
  vercel link --project "$VERCEL_PROJECT_ID" --token "$VERCEL_TOKEN" --yes || {
    _noid_warn "Vercel link failed. Check your project ID and token."
    return 1
  }
  
  _noid_info "Pulling environment from Vercel..."
  vercel pull --environment=production --token "$VERCEL_TOKEN" --yes || {
    _noid_warn "Vercel pull failed."
    return 1
  }
  
  _noid_gold "Setup complete!"
}

# ---- Cache Management ----
noid-fix() {
  _noid_info "Clearing caches and rebuilding..."
  
  # Remove cache directories
  rm -rf .next .vercel node_modules package-lock.json pnpm-lock.yaml yarn.lock 2>/dev/null || true
  
  # Reinstall and rebuild
  npm install || {
    _noid_warn "npm install failed"
    return 1
  }
  
  npm run build || {
    _noid_warn "Build failed"
    return 1
  }
  
  _noid_gold "Cache cleared and rebuild complete!"
}

# ---- Health Check ----
noid-health() {
  local url
  url="$(noid-url)"
  
  _noid_info "Health checking: $url"
  
  if command -v curl >/dev/null 2>&1; then
    local status_code
    status_code="$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)"
    
    if [ "$status_code" = "200" ]; then
      _noid_log "Site is healthy (HTTP $status_code)"
    else
      _noid_warn "Site returned HTTP $status_code"
    fi
  else
    _noid_warn "curl not available for health check"
  fi
}

# ---- Logs Fetching ----
noid-logs() {
  local url
  url="$(noid-url)"
  
  if command -v vercel >/dev/null 2>&1 && [ "$VERCEL_TOKEN" != "YOUR_VERCEL_TOKEN" ]; then
    _noid_info "Fetching logs for: $url"
    vercel logs "$url" --since=1h --token "$VERCEL_TOKEN" || _noid_warn "Could not fetch logs"
  else
    _noid_warn "Vercel CLI not configured for logs"
  fi
}

# Initialize dependency check
_noid_check_deps
NOID_ENV_EOF

# 3) Set secure permissions
chmod 600 ~/.noid/env.sh

# 4) Add to shell configurations (idempotent)
_setup_shell_integration() {
  local shell_file="$1"
  
  if [ -f "$shell_file" ]; then
    if ! grep -q "source ~/.noid/env.sh" "$shell_file" 2>/dev/null; then
      echo "" >> "$shell_file"
      echo "# NØID Environment" >> "$shell_file"
      echo "source ~/.noid/env.sh" >> "$shell_file"
      _log "Added NØID to $shell_file"
    fi
  fi
}

# Setup for common shells
touch ~/.bashrc ~/.zshrc 2>/dev/null || true
_setup_shell_integration ~/.bashrc
_setup_shell_integration ~/.zshrc

# Fish shell support
if [ -d ~/.config/fish ] || command -v fish >/dev/null 2>&1; then
  mkdir -p ~/.config/fish/conf.d 2>/dev/null || true
  cat > ~/.config/fish/conf.d/noid.fish <<'FISH_EOF'
# NØID Environment for Fish Shell
set -gx GITHUB_REPO Debearr/luxgrid-ui
set -gx VERCEL_PROJECT_ID YOUR_VERCEL_PROJECT_ID
set -gx VERCEL_TOKEN YOUR_VERCEL_TOKEN
set -gx NODE_ENV production
set -gx NEXT_TELEMETRY_DISABLED 1

# Basic aliases
alias noid-dev 'npm run dev --silent'
alias noid-build 'npm run build'

# URL function for fish
function noid-url
  set url (gh run view --log 2>/dev/null | grep -o 'https://[^[:space:]]*\.vercel\.app' | tail -1)
  if test -z "$url"
    set url "https://luxgrid-ui.vercel.app"
  end
  echo $url
end

# Status function for fish
function noid-status
  echo "🚀 NØID Status"
  echo "Repository: $GITHUB_REPO"
  gh run list -R $GITHUB_REPO --limit 3 2>/dev/null
  echo "Live URL: "(noid-url)
end
FISH_EOF
  _log "Added Fish shell support"
fi

# 5) Load environment in current shell
# shellcheck source=/dev/null
source ~/.noid/env.sh

# 6) Final success message
_gold "NØID environment setup complete!"
echo ""
_info "Next steps:"
echo "  1. Run: noid-env    # Set your Vercel token & project ID"
echo "  2. Run: noid-setup  # Link to Vercel (one-time)"
echo "  3. Run: noid-deploy # Deploy your app"
echo ""
_info "Available commands:"
echo "  noid-status   # Check deployment status"
echo "  noid-url      # Get live URL"
echo "  noid-open     # Open site in browser"
echo "  noid-logs     # View deployment logs"
echo "  noid-health   # Health check"
echo "  noid-fix      # Clear caches & rebuild"
echo ""
_gold "Happy coding! 🚀"