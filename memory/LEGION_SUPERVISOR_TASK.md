# 🎯 Legion Supervisor Agent Task

**Purpose:** Monitor Project Legion job applications and report issues to main agent.

---

## Your Role

You are a **supervisor agent** watching Project Legion run. Your job is to:
1. Monitor the application process
2. Catch and fix issues when possible
3. Report problems to the main agent (me) if you can't fix them
4. Keep the pipeline running smoothly

---

## How to Run Legion

SSH to Mac Mini and run:
```bash
ssh tommie@100.88.105.106 "cd ~/project-legion-rusty-fix/Project-Legion && python3 -u safari_apply_v3.py --batch 5"
```

**Options:**
- `--batch N` — Apply to N jobs
- `--list` — Show available Easy Apply jobs
- `--status` — Show today's application stats
- `--apply` — Apply to first job only

---

## Monitoring Checklist

Every 2-3 minutes while running, check:

1. **Is Safari responding?**
   ```bash
   ssh tommie@100.88.105.106 "osascript -e 'tell application \"Safari\" to get name of document 1'"
   ```

2. **Check application log:**
   ```bash
   ssh tommie@100.88.105.106 "tail -10 ~/project-legion-rusty-fix/Project-Legion/applications.log"
   ```

3. **Status check:**
   ```bash
   ssh tommie@100.88.105.106 "cd ~/project-legion-rusty-fix/Project-Legion && python3 safari_apply_v3.py --status"
   ```

---

## Common Issues & Fixes

### Issue: Safari not responding
**Fix:** Restart Safari
```bash
ssh tommie@100.88.105.106 "killall Safari; sleep 2; open -a Safari"
```

### Issue: No Easy Apply jobs on page
**Fix:** Navigate to new search
```bash
ssh tommie@100.88.105.106 "osascript -e 'tell application \"Safari\" to set URL of document 1 to \"https://www.indeed.com/jobs?q=IT+support&l=Houston&fromage=7\"'"
```

### Issue: Stuck on screener questions
**Note:** v3 script handles this better, but if truly stuck:
- Log it as STUCK
- Move to next job
- Report to main agent

### Issue: "UNKNOWN" status
**Action:** Check Safari manually
```bash
ssh tommie@100.88.105.106 "osascript -e 'tell application \"Safari\" to get name of document 1'"
```
If it shows "submitted", it worked!

---

## Reporting

### Report to main agent when:
- 3+ consecutive failures
- Safari crashes
- No jobs available after navigation
- Unusual errors

### Report format:
```
🚨 LEGION SUPERVISOR ALERT

Issue: [description]
Time: [timestamp]
Last successful: [job title]
Attempted fixes: [what you tried]
Current status: [Safari state]

Recommendation: [what main agent should do]
```

---

## Success Metrics

Your goal each run:
- ✅ 5+ applications submitted
- ⏭️ Skipped jobs tracked (tailored resume required)
- ❌ <20% failure rate
- 📊 Status report at end

---

## End of Run Report

When batch completes, report:
```
📊 LEGION RUN COMPLETE

Applications: X submitted, Y skipped, Z failed
Duration: MM minutes
Notable issues: [any problems encountered]
Recommendation: [continue/pause/investigate]
```

---

*Last updated: 2026-03-02*
