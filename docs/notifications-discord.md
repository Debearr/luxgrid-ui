# Discord Notifications — Deploy Pass/Fail + Rollout/Rollback

These templates use Discord webhook embeds. Replace $VARS at runtime in CI.

---

## ✅ Deploy Passed (Performance Budgets Met)

```json
{
  "embeds": [
    {
      "title": "✅ Deploy Passed: $REPO",
      "url": "$PR_URL",
      "color": 3066993,
      "fields": [
        { "name": "PR", "value": "#$PR_NUMBER", "inline": true },
        { "name": "Branch", "value": "$BRANCH", "inline": true },
        { "name": "Env", "value": "$ENV", "inline": true },
        { "name": "Commit", "value": "`$SHORT_SHA`", "inline": true },
        { "name": "Budgets", "value": "Lighthouse: $LH_SCORE ≥ 90\nLCP: $LCP s (≤ 2.0)\nCLS: $CLS (≤ 0.1)" }
      ]
    }
  ]
}
```

---

## ❌ Gate Failed (Auto-Rollback Triggered)

```json
{
  "embeds": [
    {
      "title": "❌ Rollback Triggered: $REPO",
      "url": "$ISSUE_URL",
      "color": 15158332,
      "fields": [
        { "name": "PR", "value": "#$PR_NUMBER", "inline": true },
        { "name": "Branch", "value": "$BRANCH", "inline": true },
        { "name": "Env", "value": "$ENV", "inline": true },
        { "name": "Commit", "value": "`$SHORT_SHA`", "inline": true },
        { "name": "Failed Gates", "value": "Lighthouse: $LH_SCORE (< 90)\nLCP: $LCP s (> 2.0)\nCLS: $CLS (> 0.1)" },
        { "name": "Rollback To", "value": "`$ROLLBACK_SHA`" }
      ]
    }
  ]
}
```

---

## Rollout / Rollback Announcements

```json
{
  "content": "🚀 Rollout Started — $REPO@$BRANCH to $ENV (by $ACTOR)"
}
```

```json
{
  "content": "↩️ Rollback Executed — $REPO ($ENV) to `$ROLLBACK_SHA` — Reason: $REASON"
}
```

---

## cURL Examples

```bash
curl -X POST -H 'Content-Type: application/json' -d @payload.json "$DISCORD_WEBHOOK_URL"
```

Suggested variable mapping in CI:
- $REPO, $PR_NUMBER, $BRANCH, $ENV, $SHORT_SHA
- $LH_SCORE, $LCP, $CLS, $PR_URL, $ISSUE_URL, $ROLLBACK_SHA
- $ACTOR, $REASON, $DISCORD_WEBHOOK_URL

