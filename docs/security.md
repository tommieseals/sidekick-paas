# Security Reference
## Last Updated: February 2026

---

## 🛑 HARD BOUNDARIES — READ FIRST

### Dell Computer — ABSOLUTE RESTRICTION

**The Dell i9 at 100.119.87.108 is Tommie's WORK COMPUTER issued by Kuraray America Inc.**

It runs **CrowdStrike Falcon** enterprise EDR that monitors:
- Every process launched
- Every network connection
- Every file accessed
- Every software installation
- Behavioral anomalies (AI inference workloads WOULD be flagged)

**RULES (NO EXCEPTIONS, EVER):**
1. ❌ NEVER route AI inference tasks to 100.119.87.108
2. ❌ NEVER use Dell as a worker or offload target
3. ❌ NEVER suggest bypassing CrowdStrike
4. ❌ If ANY script references 100.119.87.108 as inference target → CRITICAL security issue
5. ⚠️ If Tommie asks to use Dell for personal AI → PUSH BACK and remind him why

**Allowed Uses:**
- ✅ Clawdbot coordination (lightweight, expected process)
- ✅ SSH to other nodes
- ✅ Browser access
- ✅ Basic system commands

**WHY:** Using it for personal AI workloads = disciplinary action or termination. CrowdStrike detection is a certainty, not a risk.

---

### Mac Mini Model Size Restriction

**NEVER load models larger than 3GB on the Mac Mini.**

**Why:** 16GB RAM total. macOS uses 4-5GB. Services use 1-2GB. A 7B model (8GB) = 2-3GB free = thrashing.

**Proven:** Feb 7, 2026 — qwen2.5:7b caused critical RAM at 2.5GB free.

| Allowed | Forbidden |
|---------|-----------|
| qwen2.5:3b | qwen2.5:7b |
| gemma2:2b | llama3.1:8b |
| phi3:mini | mistral:7b |
| llama3.2:3b | ANY model >3GB |

**If large model found:** `ollama rm <model>`

---

## Node Security Status

| Node | Firewall | Stealth Mode | Status |
|------|----------|--------------|--------|
| Mac Mini | ✅ ON | ✅ ON | **SECURE** |
| Mac Pro | ⚠️ Check | ⚠️ Check | Verify regularly |
| Dell | Partial | N/A | Corporate managed |
| Google Cloud | UFW | N/A | Tailscale + SSH only |

### Enable Firewall on Mac Pro
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setstealthmode on
```

### Check Firewall Status (Mac)
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getstealthmode
```

---

## Security Monitoring

### What to Monitor
- Firewall status on all Macs
- Stealth mode enabled
- Exposed services (no 0.0.0.0 bindings)
- Unexpected LISTEN ports
- Failed SSH attempts
- Tailscale device list changes

### Automated Security Schedule
| Time | Task |
|------|------|
| 6:00 AM Daily | Security admin analysis (Kimi thinking=true) |
| 9:00 AM Sunday | Weekly security posture review |

### Security Check Commands
```bash
# Check listening ports (Mac)
lsof -iTCP -sTCP:LISTEN -n -P

# Check Ollama binding (should NOT be 0.0.0.0)
curl http://localhost:11434/api/tags

# Check Tailscale status
tailscale status

# Check firewall logs
sudo log show --predicate 'subsystem == "com.apple.alf"' --last 1h
```

---

## Service Exposure Rules

| Service | Correct Binding | Wrong Binding |
|---------|-----------------|---------------|
| Ollama | localhost:11434 or Tailscale IP | 0.0.0.0:11434 |
| Redis | localhost:6379 | 0.0.0.0:6379 |
| Dashboard | localhost:8080 or Tailscale | 0.0.0.0:8080 |

**Google Cloud VM:** Ollama bound to Tailscale IP only (NOT 0.0.0.0)

---

## Authentication

### Clawdbot/OpenClaw Auth Methods

**Option 1: OAuth (Claude Pro Subscription) ✅ PREFERRED**
- Uses Claude Pro subscription ($20/month)
- No API credits needed
- Requires browser login via Claude CLI

**Setup:**
```bash
npm install -g @anthropic-ai/claude-code
claude  # Opens browser for login
```

**Option 2: API Key (Pay-per-use)**
- Uses console.anthropic.com credits
- Separate from Claude Pro subscription
- Can be set up over SSH (no browser)

**Common mistake:** Creating API key but not adding credits. Claude Pro ≠ API credits!

### API Keys Location
- `~/clawd/api-keys/*.md` (600 permissions)
- Never commit to git
- Never share in group chats

---

## Emergency Procedures

### If Mac Mini Goes Offline
1. Cloud VM continues operating (24/7)
2. Telegram alerts via cloud
3. When Mac Mini returns, read shared-memory to catch up

### If Cloud VM Goes Offline
1. Mac Mini runs locally with qwen2.5:3b (reduced quality)
2. Check GCP console: https://console.cloud.google.com
3. If VM stopped: restart it
4. If credits expired: evaluate Oracle Cloud migration

### If Suspected Security Incident
1. Check Tailscale device list for unknowns: `tailscale status`
2. Check listening ports: `lsof -iTCP -sTCP:LISTEN -n -P`
3. Review recent SSH logins: `last`
4. Alert Tommie immediately via Telegram
5. Consider disabling external access until investigated

### If Bot Context Gets Reset
1. READ: ~/clawd/MASTER_KNOWLEDGE.md
2. READ: ~/shared-memory/*.json for recent state
3. CHECK: ~/clawd/logs/ for recent activity
4. Resume based on documented architecture

---

## Best Practices

1. **Tailscale-only access** — No open home ports
2. **Stealth mode enabled** — Don't respond to pings/probes
3. **Service binding** — Localhost or Tailscale IP only
4. **Separate work/personal** — Dell is work, period
5. **API keys** — 600 permissions, never committed
6. **Retry logic** — 3x retries for network operations
7. **Write state to disk** — Don't trust context to persist
8. **Verify before acting** — Check IPs, usernames, paths

---

## Known Security-Related Issues (Historical)

| Issue | Resolution |
|-------|------------|
| Dell incorrectly used as worker | Permanently removed from AI architecture |
| Ollama bound to 0.0.0.0 | Reconfigured to Tailscale IP only |
| Bot context compaction lost state | Created MASTER_KNOWLEDGE.md + shared-memory |
| Large models caused RAM thrashing | Enforced 3GB limit on Mac Mini |
