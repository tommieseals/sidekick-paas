# Germany Trip - Gateway Reliability Checklist

## PRE-DEPARTURE (DO BEFORE LEAVING)

### 1. Load Crash Monitor ⚠️ CRITICAL
```bash
launchctl load ~/Library/LaunchAgents/com.clawd.crash-monitor.plist
launchctl list | grep crash-monitor  # Verify it's loaded
```

### 2. Choose Configuration (Pick ONE)

#### Option A: SAFEST - Disable Typing (RECOMMENDED)
```bash
# Edit config
nano ~/.clawdbot/config.yaml

# Add these lines:
channels:
  telegram:
    typingIntervalSeconds: 0

# Save and restart
clawdbot gateway restart
```

#### Option B: Reduce Risk - Longer TTL
```bash
# Edit config
nano ~/.clawdbot/config.yaml

# Add these lines:
channels:
  telegram:
    typingTtlMs: 600000  # 10 minutes

# Save and restart
clawdbot gateway restart
```

#### Option C: Monitor Only (Higher Risk)
```bash
# No config change - just rely on crash monitor
# Accept 7-second downtime during crashes
```

### 3. Test Monitoring
```bash
# Run monitor manually
bash /Users/tommie/clawd/agents/security/crash-monitor.sh

# Check you got a message (might say "no crashes" - that's OK)
cat /tmp/crash-monitor.log
```

### 4. Document Access
Save this in a safe place (phone notes, etc.):

```
Mac IP: [Check with: ifconfig | grep "inet "]
SSH Port: 22
Gateway Port: 18789
Crash Log: /tmp/clawd-recent.log
Monitor Log: /tmp/crash-monitor.log

Recovery Commands:
- Restart gateway: clawdbot gateway restart
- Check status: clawdbot gateway status
- View crashes: grep AbortError /tmp/clawd-recent.log
- Disable typing: Edit ~/.clawdbot/config.yaml
```

### 5. Final Verification
```bash
# Verify gateway is running
clawdbot gateway status

# Verify crash monitor is running
launchctl list | grep crash-monitor

# Send test message to yourself
clawdbot message send --target @tommie77bot --message "Gateway test - leaving for Germany"

# Verify config was applied
grep -A 5 "telegram:" ~/.clawdbot/config.yaml
```

---

## DURING TRIP

### Daily Health Check
Send via Telegram:
```
/status
```

Or:
```
What's your uptime?
```

### If You Get Crash Alert
1. Don't panic - LaunchAgent auto-restarts in ~7 seconds
2. Check if pattern continues (multiple alerts in short time)
3. If unstable, SSH in and disable typing:
   ```bash
   ssh tommie@<your-mac-ip>
   clawdbot gateway stop
   nano ~/.clawdbot/config.yaml
   # Set typingIntervalSeconds: 0
   clawdbot gateway start
   ```

### Emergency Disable Typing (Remote)
```bash
# Via SSH:
ssh tommie@<your-mac-ip> "echo 'channels:
  telegram:
    typingIntervalSeconds: 0' >> ~/.clawdbot/config.yaml && clawdbot gateway restart"
```

---

## AFTER RETURN

### 1. Review Crash Logs
```bash
# Check how many crashes occurred
grep "Crash detected" /tmp/crash-monitor.log | wc -l

# Review crash contexts
cat /tmp/crash-monitor.log
```

### 2. File Bug Report
If crashes occurred, file issue at: https://github.com/anthropics/clawdbot/issues

Include:
- Version: 2026.1.24-3
- Error logs from `/tmp/clawd-recent.log`
- Note: PR #1639 fixed long-polling but not typing TTL cleanup
- Analysis: `/Users/tommie/clawd/agents/security/memory/gateway-crash-analysis-2026-01-31.md`

### 3. Check for Updates
```bash
npm view clawdbot version
# If newer than 2026.1.24-3:
npm install -g clawdbot
clawdbot gateway restart
```

### 4. Re-enable Typing (If Disabled)
```bash
# Edit config
nano ~/.clawdbot/config.yaml
# Remove or comment out: typingIntervalSeconds: 0
# Save and restart
clawdbot gateway restart
```

---

## QUICK REFERENCE

### Commands
| Task | Command |
|------|---------|
| Check status | `clawdbot gateway status` |
| Restart | `clawdbot gateway restart` |
| View crashes | `grep AbortError /tmp/clawd-recent.log` |
| View monitor log | `cat /tmp/crash-monitor.log` |
| Check config | `cat ~/.clawdbot/config.yaml` |

### Files
| File | Purpose |
|------|---------|
| `~/.clawdbot/config.yaml` | Main configuration |
| `/tmp/clawd-recent.log` | Gateway logs |
| `/tmp/crash-monitor.log` | Crash monitor activity |
| `~/clawd/agents/security/crash-monitor.sh` | Monitor script |

### Monitoring
- **Crash alerts**: Sent to `@tommie77bot` via Telegram
- **Check interval**: Every 5 minutes
- **Auto-restart**: ~7 seconds after crash via LaunchAgent

---

## DECISION HELPER

**If you want**: SAFEST → Choose Option A (Disable Typing)  
**If you want**: Balance → Choose Option B (Longer TTL)  
**If you want**: No UX change + accept risk → Choose Option C (Monitor Only)

**My recommendation**: **Option A** for Germany trip, re-enable after return

---

Generated: 2026-01-31
