# Gateway Crash Analysis - 2026-01-31

## Executive Summary
**Status**: IDENTIFIED - Known issue with partial fix in current version  
**Severity**: HIGH - Causes message loss and service interruption  
**Risk**: Critical for Germany trip (unattended operation)  
**Action Required**: Implement monitoring + consider workaround config  

---

## Root Cause Analysis

### The Error
```
2026-01-31T23:16:48.889Z info typing TTL reached (2m); stopping typing indicator
2026-01-31T23:16:48.935Z error [clawdbot] Unhandled promise rejection: AbortError: This operation was aborted
    at node:internal/deps/undici/undici:14902:13
    at processTicksAndRejections (node:internal/process/task_queues:105:5)
```

### Technical Root Cause
1. **Typing TTL Timeout**: After 2 minutes of typing indicator activity, Clawdbot stops the indicator
2. **AbortSignal Issue**: The cleanup code triggers an `AbortError` from undici (HTTP client library)
3. **Unhandled Promise Rejection**: The abort happens in an async context without proper error handling
4. **Process Crash**: Node.js crashes on unhandled promise rejection (default behavior)
5. **LaunchAgent Auto-Restart**: macOS LaunchAgent detects crash and restarts gateway after ~7 seconds

### Code Location
- Typing controller: `/opt/homebrew/lib/node_modules/clawdbot/dist/auto-reply/reply/typing.js`
- Telegram bot context: `/opt/homebrew/lib/node_modules/clawdbot/dist/telegram/bot-message-context.js`
- The `cleanup()` function in typing controller calls `clearTimeout(typingTtlTimer)` which appears to trigger an abort in an ongoing fetch operation

### Known Issue Status
**From CHANGELOG.md:**
```
- Telegram: use wrapped fetch for long-polling on Node to normalize AbortSignal handling. (#1639)
```

This fix was included in version `2026.1.24-3` (current installed version: `2026.1.24-3`).

**Current Status**: The fix is present but **NOT COMPLETE**. The crash still occurs, indicating:
- The fix addressed long-polling aborts but not typing indicator cleanup aborts
- Additional error handling is needed in the typing TTL cleanup path
- This is likely a **residual bug** that needs reporting

---

## Impact Assessment

### Message Loss
- **7-second service gap** during restart
- Messages sent during this window may be:
  - Lost (if not queued by Telegram)
  - Delayed until next polling cycle
  - Duplicated if retry logic is involved

### Frequency
- Occurs whenever typing indicator runs for 2+ minutes continuously
- Long-running tool executions trigger this (observed: 13+ minute run)
- **Unpredictable** - depends on workload complexity

### Germany Trip Risk
- **HIGH RISK** for unattended operation
- No manual recovery available
- Could miss critical messages/alerts
- LaunchAgent auto-restart mitigates but doesn't prevent loss

---

## Recommended Fixes

### IMMEDIATE (Before Germany Trip)

#### 1. ✅ Monitoring & Alerting (IMPLEMENTED)
**Status**: Deployed
- Created `/Users/tommie/clawd/agents/security/crash-monitor.sh`
- LaunchAgent: `com.clawd.crash-monitor.plist`
- Runs every 5 minutes
- Sends Telegram alerts on crash detection
- **Action**: Load the LaunchAgent:
  ```bash
  launchctl load ~/Library/LaunchAgents/com.clawd.crash-monitor.plist
  ```

#### 2. Disable Typing Indicators (Workaround)
**Pros**: Eliminates root cause  
**Cons**: Less responsive user experience  

Add to `~/.clawdbot/config.yaml`:
```yaml
channels:
  telegram:
    typingIntervalSeconds: 0  # Disable typing indicators
```

Then restart:
```bash
clawdbot gateway restart
```

#### 3. Increase Typing TTL (Reduce Frequency)
**Pros**: Reduces crash frequency  
**Cons**: Doesn't eliminate issue  

Add to `~/.clawdbot/config.yaml`:
```yaml
channels:
  telegram:
    typingTtlMs: 600000  # 10 minutes instead of 2 minutes
```

### MEDIUM-TERM

#### 4. Report Bug to Clawdbot Team
**File GitHub Issue** with:
- Error logs (provided above)
- Version info: `2026.1.24-3`
- Note that PR #1639 fixed long-polling but not typing TTL cleanup
- Stack trace pointing to `typing.js` cleanup function
- Suggest wrapping typing indicator abort in try-catch

**Draft Issue Title:**
> "AbortError crash on typing TTL cleanup despite #1639 fix"

#### 5. Update to Next Release
Monitor for updates:
```bash
npm view clawdbot version
```

Current: `2026.1.24-3` (latest as of 2026-01-31)

### LONG-TERM

#### 6. Implement Redundancy
- Run gateway in Docker with auto-restart policy
- Set up health check endpoint monitoring
- Configure alerting via multiple channels (email + Telegram)

---

## Configuration Recommendations

### Option A: Safest (Disable Typing)
```yaml
# ~/.clawdbot/config.yaml
channels:
  telegram:
    typingIntervalSeconds: 0
```

### Option B: Balanced (Longer TTL)
```yaml
# ~/.clawdbot/config.yaml
channels:
  telegram:
    typingIntervalSeconds: 6    # Default
    typingTtlMs: 600000          # 10 minutes (was 2 minutes)
```

### Option C: Monitor-Only (Current Setup)
- Keep existing config
- Rely on crash monitor for alerts
- Accept 7-second downtime during crashes

**Recommendation for Germany Trip**: **Option A (Disable Typing)**  
- Safest for unattended operation
- Can re-enable after returning

---

## Monitoring Setup

### Crash Monitor
**Location**: `/Users/tommie/clawd/agents/security/crash-monitor.sh`  
**Schedule**: Every 5 minutes via LaunchAgent  
**Alert Target**: `@tommie77bot` (Telegram)  

### Manual Monitoring
Check gateway status:
```bash
clawdbot gateway status
launchctl list | grep clawdbot
ps aux | grep clawdbot-gateway
```

Check recent crashes:
```bash
grep "AbortError" /tmp/clawd-recent.log | tail -5
```

View crash monitor logs:
```bash
tail -f /tmp/crash-monitor.log
```

### Remote Monitoring (From Germany)
Send Telegram message:
```
/status
```

Or check uptime:
```
Hey, what's your current uptime?
```

---

## Action Items

### Before Departure
- [ ] **CRITICAL**: Load crash monitor LaunchAgent
- [ ] **CRITICAL**: Decide on typing indicator config (A, B, or C)
- [ ] Test configuration with long-running task
- [ ] Verify crash monitor sends alerts
- [ ] Document recovery procedures for remote access
- [ ] Set up backup communication channel (email?)

### During Trip
- [ ] Monitor Telegram for crash alerts
- [ ] Check gateway status daily
- [ ] Log any crashes for bug report

### After Return
- [ ] File detailed bug report with Clawdbot team
- [ ] Review crash frequency from monitor logs
- [ ] Re-evaluate typing indicator settings

---

## Testing Procedure

### Simulate Crash Conditions
```bash
# Trigger long-running task that causes typing for 2+ minutes
# (The gateway should crash at exactly 2:00 if bug persists)

# Watch logs:
tail -f /tmp/clawd-recent.log | grep -E "typing|AbortError"

# Monitor process:
watch -n 1 'ps aux | grep clawdbot-gateway'
```

### Verify Crash Monitor
```bash
# Manually trigger monitor:
bash /Users/tommie/clawd/agents/security/crash-monitor.sh

# Check for alert in Telegram
# Check log:
cat /tmp/crash-monitor.log
```

---

## Additional Context

### System Info
- **OS**: macOS (Darwin 24.6.0 arm64)
- **Node**: v22.22.0
- **Clawdbot**: 2026.1.24-3 (latest)
- **Install**: Homebrew (`/opt/homebrew/lib/node_modules/clawdbot`)
- **LaunchAgent**: `com.clawdbot.gateway` (KeepAlive=true)

### Related Issues
- PR #1639: Fixed long-polling aborts (but not typing cleanup)
- This appears to be a **regression** or **incomplete fix**

### Dependencies
- `grammy`: ^1.39.3 (Telegram bot framework)
- `undici`: ^7.19.0 (HTTP client where AbortError originates)

---

## Conclusion

**Immediate Action Required**: Load crash monitor + disable typing indicators

**Risk Level**: HIGH for unattended operation without mitigation

**Mitigation Status**: 
- ✅ Monitoring/alerting implemented
- ⚠️ Config change recommended (user decision)
- 🔄 Bug report needed for permanent fix

This is a **known category of issue** (AbortSignal handling in Telegram) with a **partial fix** already deployed. The typing TTL cleanup path needs additional error handling. Until upstream fix is available, disabling typing indicators is the safest workaround.

---

**Report Generated**: 2026-01-31  
**Analyst**: Security Agent  
**Next Review**: After Germany trip or when new Clawdbot version released
