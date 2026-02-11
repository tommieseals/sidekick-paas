# HEARTBEAT.md

## FIRST PRIORITY: Read Admin Reports & Act

**BEFORE ANYTHING ELSE:**
1. **Read shared-memory reports** - network.json, systems.json, security.json
2. **Act on issues immediately:**
   - RAM < 5GB → Spawn sub-agent to fix
   - Disk > 85% → Alert and clean up
   - Network issues → Investigate
3. **Don't wait for user** - Fix problems proactively

**Run proactive monitor:**
```bash
bash /Users/tommie/clawd/scripts/proactive-monitor.sh
```

## SECOND PRIORITY: Group Chat Monitoring

**Check "The Bot Chat" group:**
1. Check for @ mentions (chatId: -5052671848)
2. Respond immediately to any questions
3. User has warned 3 times - IT IS CRITICAL

```bash
curl -s "https://api.telegram.org/bot8392398778:AAH5lan45kR-VT74d3OiXAAIxlPyR4skGzU/getUpdates"
```

## Security Officer Checks

Every few heartbeats (2-4 times per day), check for security audit reports:

1. **Check latest security audit** (`memory/security-audit-*.md`)
   - If today's report exists and shows issues → alert immediately
   - Track last check in `memory/heartbeat-state.json`
   - Only alert once per report (don't spam)

2. **What to report:**
   - Number of issues found
   - Summary of issue types (hardcoded secrets, git exposure, network, etc.)
   - Location of full report

**When NOT to alert:**
- Report shows 0 issues (all clean)
- Already alerted about this report
- Late night (23:00-08:00) unless critical (10+ issues)
