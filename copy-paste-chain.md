# Copy-Paste Chain: Extension → VOAI → Cursor

## Step 1: Claude Extension RAW Scan
**Target:** `noidlux.com`  
**Paste this into Claude Extension sidebar:**

```txt
RAW audit this page. Return findings under EXACT headers:
[Console Errors]
[Network Failures]
[Performance]
[Accessibility]
[Security]
Rules: include full error text, request URL+status, selectors, and metrics. No summaries, no advice, no paraphrase.
```

---

## Step 2: VOAI Formatting
**Take Extension RAW output → paste into VOAI with:**

```txt
Format Extension RAW into buckets with Issue/File:Line/Impact/Fix fields.
```

---

## Step 3: Cursor Fix Mode
**Take VOAI clean buckets → paste into Cursor with:**

```txt
Fix Mode: Apply VOAI buckets to Noidlux Next.js. Minimal diffs with file:line, run build, open PR from cursor/apply-scan-report-patches-and-build.
```

---

## Ready State
✅ Cursor is prepped and waiting for VOAI buckets  
✅ Will apply fixes with minimal diffs  
✅ Will run build validation  
✅ Will create PR from `cursor/apply-scan-report-patches-and-build`  

**Next:** Run Extension scan → VOAI format → paste buckets here for fixes.