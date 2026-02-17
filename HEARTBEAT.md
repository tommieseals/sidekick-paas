# HEARTBEAT.md

## PRIORITY ZERO: All-Node Health Check

**Check ALL nodes on every heartbeat:**

### Dell (This Machine - 100.119.87.108)
```powershell
$os = Get-CimInstance Win32_OperatingSystem
$pct = [math]::Round((($os.TotalVisibleMemorySize - $os.FreePhysicalMemory) / $os.TotalVisibleMemorySize) * 100, 0)
```

### Mac Mini (100.82.234.66) - Via SSH
```bash
ssh tommie@100.82.234.66 "vm_stat | head -5; df -h / | tail -1; uptime"
```

### Mac Pro (100.67.192.21) - Via SSH
```bash
ssh administrator@100.67.192.21 "vm_stat | head -5; df -h / | tail -1; uptime"
```

**Alert Thresholds (ANY NODE):**
| Metric | Warning | Critical |
|--------|---------|----------|
| RAM | > 80% | > 85% |
| Disk | > 80% | > 90% |
| Load | > 4.0 | > 8.0 |

**If ANY node exceeds thresholds: ALERT IMMEDIATELY**
- Tell Rusty which node and current usage
- For RAM: List top 5 processes
- For Disk: Check large files/logs
- Suggest fixes

---

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

---

## TOKEN-SAVING REMINDERS

**On every heartbeat, remember:**
- Use Ollama local (FREE) for simple checks
- Batch operations - don't make separate requests
- Spawn sub-agents for heavy research tasks
- Check `session_status` if usage seems high

**NVIDIA API Budget:** 50 calls/day total (shared across Kimi, Llama, Qwen)

**Cost hierarchy:**
1. 🆓 Ollama local → Always try first
2. 💰 NVIDIA/Gemini → For specialized tasks
3. 💰💰💰 Claude → Only when necessary
