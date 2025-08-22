# Bugbot Auto-Enable Automation

This repository includes automation to enable Cursor Bugbot across your repositories.

## Files

- `.github/workflows/auto-enable-bugbot.yml`: GitHub Actions workflow (scheduled + manual)
- `scripts/enable-bugbot.mjs`: Node script that scans repos and calls Cursor API

## Required configuration

Add the following in your repository or organization settings:

### Secrets

- `BUGBOT_GITHUB_TOKEN`: GitHub Personal Access Token with scopes:
  - `repo` (for private repos) or `public_repo` (if only public)
  - `read:org` if scanning org repos
- `CURSOR_API_TOKEN`: Token to authenticate against the Cursor automation endpoint

### Variables

- `GITHUB_OWNER`: Owner login to scan (defaults to `github.repository_owner` if not set)
- `CURSOR_API_URL`: Base URL of Cursor automation endpoint (e.g. `https://api.cursor.sh/automation`)

Optional variables/inputs:
- `INCLUDE_REPOS`: Comma-separated repo names to include
- `EXCLUDE_REPOS`: Comma-separated repo names to exclude
- `DRY_RUN`: `true` to log actions without mutating

## Running

- Manual run: Actions → "Auto-Enable Bugbot" → Run workflow
- Scheduled run: Every 6 hours at minute 17 (customize cron in workflow)

## Local usage

```bash
GITHUB_TOKEN=ghp_xxx \
GITHUB_OWNER=my-org \
CURSOR_API_URL=https://api.cursor.sh/automation \
CURSOR_API_TOKEN=cursor_xxx \
node scripts/enable-bugbot.mjs
```

Optional filters:

```bash
INCLUDE_REPOS=repo1,repo2 DRY_RUN=true node scripts/enable-bugbot.mjs
```

## Notes

- The script lists repos under `https://api.github.com/users/{owner}/repos`. For organizations, you can also adapt to `orgs/{org}/repos` if needed.
- The Cursor automation endpoint path used is `POST {CURSOR_API_URL}/bugbot/enable` with body `{ owner, repo }`.
- Safe to re-run; enabling an already-enabled repo is expected to be idempotent.