# HEARTBEAT.md

## PRIORITY ZERO: All-Node Health Check (EFFICIENT VERSION)

**Run batched check script when available:**
```bash
bash ~/clawd/scripts/check-all-nodes.sh
```

**Or quick manual checks:**

### Dell (This Machine - 100.119.87.108)
```powershell
wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value
```

### Mac Mini + Mac Pro (Batched SSH)
```bash
# Single command checks both nodes efficiently
for host in tommie@100.88.105.106 administrator@100.89.67.10; do
  ssh -o ConnectTimeout=10 $host 'echo "$(hostname):"; memory_pressure 2>/dev/null | grep "free percentage"; df -h / | tail -1; uptime' 2>/dev/null
done
```

**Alert Thresholds (ANY NODE):**
| Metric | Warning | Critical |
|--------|---------|----------|
| RAM | > 80% | > 85% |
| Disk | > 80% | > 90% |
| Load | > 4.0 | > 8.0 |

**If ANY node exceeds thresholds: ALERT IMMEDIATELY**
- Tell Rusty which node and current usage
- For RAM: List top 5 processes (`ps aux -m | head -6`)
- For Disk: Check large files (`du -sh /var/log/* 2>/dev/null | sort -hr | head -5`)
- Run auto-remediation if available: `bash ~/clawd/scripts/auto-cleanup.sh`

---

## PRIORITY ONE: Service Health

**Check key services are running:**
```bash
# Mac Mini
ssh tommie@100.88.105.106 'pgrep -x ollama && pgrep -f clawdbot-gateway'

# Mac Pro  
ssh administrator@100.89.67.10 'pgrep -x ollama && pgrep -f openclaw'
```

**If service is down:** Run `bash ~/clawd/scripts/auto-restart-services.sh`

---

## PRIORITY TWO: NVIDIA API Budget

**Check daily usage (50 calls/day limit):**
```bash
ssh tommie@100.88.105.106 'bash ~/dta/gateway/track-nvidia-usage.sh status 2>/dev/null || echo "Tracker not set up"'
```

- If > 40 calls: Warn about approaching limit
- If > 45 calls: Suggest switching to local Ollama

---

## PRIORITY THREE: Admin Reports & Group Chat

**Check shared-memory reports (on Mac Mini):**
```bash
ssh tommie@100.88.105.106 'cat ~/shared-memory/*.json 2>/dev/null | head -50'
```

**Check "The Bot Chat" group:**
```bash
curl -s "https://api.telegram.org/bot8392398778:AAH5lan45kR-VT74d3OiXAAIxlPyR4skGzU/getUpdates?offset=-10"
```

---

## PRIORITY FOUR: Security Checks (2-4x daily)

**Check for security audit reports:**
```bash
ssh tommie@100.88.105.106 'ls -la ~/clawd/memory/security-audit-*.md 2>/dev/null | tail -3'
```

**Verify firewall status:**
```bash
# Mac Mini
ssh tommie@100.88.105.106 'sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null || echo "needs sudo"'

# Mac Pro (⚠️ CURRENTLY OFF - needs manual fix)
ssh administrator@100.89.67.10 '/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null'
```

---

## TOKEN-SAVING REMINDERS

**On every heartbeat, remember:**
- Use Ollama local (FREE) for simple checks
- Batch SSH commands - don't make separate connections
- Spawn sub-agents for heavy research tasks
- Check `session_status` if usage seems high

**NVIDIA API Budget:** 50 calls/day total (shared across Kimi, Llama, Qwen)

---

## MANUAL ACTION REQUIRED

### ⚠️ Mac Pro Firewall (Needs Rusty)
Run these commands on Mac Pro with sudo password:
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setstealthmode on
```

---

---

## PRIORITY FIVE: Trading P&L Check

**TerminatorBot Paper Positions:**
```powershell
python C:\Users\tommi\clawd\TerminatorBot\track_resolved.py
```

**Project Vault (if market hours):**
```bash
ssh tommie@100.88.105.106 "cd ~/clawd/project-vault && source venv/bin/activate && python3 vault.py status"
```

**Track:**
- Open positions count
- Any resolved markets (check daily at 7 AM cron)
- Realized P&L when markets close

---

## PRIORITY SIX: GitHub Portfolio Updates (3x Daily) 🔥

**Goal:** Keep GitHub updated with successful projects to impress employers.

**What to push (PUBLIC - employer-friendly):**
- ✅ Infrastructure scripts (monitoring, automation, health checks)
- ✅ React sites and web projects
- ✅ Dashboard code
- ✅ Automation tools
- ✅ CLI utilities
- ✅ Clean, documented code

**What to NEVER push (PRIVATE - personal info):**
- ❌ API keys, tokens, passwords
- ❌ Personal data (emails, phone numbers, addresses)
- ❌ Memory files with private conversations
- ❌ Financial account info
- ❌ Job application data with personal details

**Check 3x daily:**
1. **Morning (6 AM)** - Scan for new completions overnight
2. **Midday (12 PM)** - Check for projects worked on
3. **Evening (6 PM)** - End of day push

**Actions:**
```bash
# SSH to Mac Mini where gh CLI is configured
ssh tommie@100.88.105.106

# Check what repos exist
gh repo list tommieseals

# Check local projects not yet on GitHub
ls ~/clawd/ | grep -v memory | grep -v private

# For each good project:
# 1. Sanitize (remove secrets/personal data)
# 2. Add README.md
# 3. Push to GitHub
```

**Track in:** `memory/github-updates.md`

---

## State Tracking

Track check timestamps in `memory/heartbeat-state.json`:
```json
{
  "lastChecks": {
    "fullHealth": null,
    "security": null,
    "nvidia": null
  },
  "alerts": []
}
```
