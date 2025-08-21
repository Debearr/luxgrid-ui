# Slack Notifications — Deploy Pass/Fail + Rollout/Rollback

These templates are Block Kit–compatible and ready for incoming webhooks. Replace $VARS at runtime in CI.

---

## ✅ Deploy Passed (Performance Budgets Met)

```json
{
  "blocks": [
    { "type": "header", "text": { "type": "plain_text", "text": "✅ Deploy Passed: $REPO", "emoji": true } },
    { "type": "section", "fields": [
      { "type": "mrkdwn", "text": "*PR:* #$PR_NUMBER" },
      { "type": "mrkdwn", "text": "*Branch:* $BRANCH" },
      { "type": "mrkdwn", "text": "*Env:* $ENV" },
      { "type": "mrkdwn", "text": "*Commit:* `$SHORT_SHA`" }
    ]},
    { "type": "section", "text": { "type": "mrkdwn", "text": "*Budgets*\n- Lighthouse: $LH_SCORE ≥ 90\n- LCP: $LCP s (≤ 2.0)\n- CLS: $CLS (≤ 0.1)" } },
    { "type": "actions", "elements": [
      { "type": "button", "text": { "type": "plain_text", "text": "Open PR" }, "url": "$PR_URL" },
      { "type": "button", "text": { "type": "plain_text", "text": "Preview/Prod" }, "url": "$DEPLOY_URL" },
      { "type": "button", "text": { "type": "plain_text", "text": "CI Run" }, "url": "$RUN_URL" }
    ]}
  ]
}
```

---

## ❌ Gate Failed (Auto-Rollback Triggered)

```json
{
  "blocks": [
    { "type": "header", "text": { "type": "plain_text", "text": "❌ Rollback Triggered: $REPO", "emoji": true } },
    { "type": "section", "fields": [
      { "type": "mrkdwn", "text": "*PR:* #$PR_NUMBER" },
      { "type": "mrkdwn", "text": "*Branch:* $BRANCH" },
      { "type": "mrkdwn", "text": "*Env:* $ENV" },
      { "type": "mrkdwn", "text": "*Commit:* `$SHORT_SHA`" }
    ]},
    { "type": "section", "text": { "type": "mrkdwn", "text": "*Failed Gates*\n- Lighthouse: $LH_SCORE (< 90)\n- LCP: $LCP s (> 2.0)\n- CLS: $CLS (> 0.1)\n\n*Action:* Auto-rolled back to `$ROLLBACK_SHA`." } },
    { "type": "actions", "elements": [
      { "type": "button", "text": { "type": "plain_text", "text": "Open Failure Issue" }, "url": "$ISSUE_URL" },
      { "type": "button", "text": { "type": "plain_text", "text": "View Artifacts" }, "url": "$ARTIFACTS_URL" }
    ]}
  ]
}
```

---

## Rollout Announce (Manual/Auto)

```json
{
  "blocks": [
    { "type": "section", "text": { "type": "mrkdwn", "text": "🚀 *Rollout Started* — $REPO@$BRANCH to $ENV" } },
    { "type": "context", "elements": [ { "type": "mrkdwn", "text": "Triggered by: $ACTOR • Commit: `$SHORT_SHA`" } ] }
  ]
}
```

## Rollback Announce (Manual/Auto)

```json
{
  "blocks": [
    { "type": "section", "text": { "type": "mrkdwn", "text": "↩️ *Rollback Executed* — $REPO ($ENV) to `$ROLLBACK_SHA`" } },
    { "type": "context", "elements": [ { "type": "mrkdwn", "text": "Reason: $REASON" } ] }
  ]
}
```

---

## cURL Examples

```bash
curl -X POST -H 'Content-type: application/json' --data @payload.json "$SLACK_WEBHOOK_URL"
```

Suggested variable mapping in CI:
- $REPO, $PR_NUMBER, $BRANCH, $ENV, $SHORT_SHA
- $LH_SCORE, $LCP, $CLS, $PR_URL, $DEPLOY_URL, $RUN_URL
- $ISSUE_URL, $ARTIFACTS_URL, $ROLLBACK_SHA, $ACTOR, $REASON, $SLACK_WEBHOOK_URL

