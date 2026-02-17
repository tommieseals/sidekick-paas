# Infrastructure Automation System

**Created:** 2026-02-17  
**Last Updated:** 2026-02-17

This document describes the automated infrastructure management system running on Mac Mini (100.82.234.66).

---

## Overview

Three automated tasks run via the Clawdbot cron system:

| Job | Schedule | Purpose |
|-----|----------|---------|
| Daily Health Report | 9 AM CT daily | System health check → Telegram |
| Weekly Security Audit | 6 AM CT Sunday | Security scan → memory file + Telegram |
| Auto-commit Memory | Every 6 hours | Git commit memory/ changes |

---

## 1. Daily Health Report

**Cron ID:** `829693cb-7aa7-43f7-8dc0-31ee15b65562`  
**Schedule:** `0 9 * * *` (9:00 AM Central Time, daily)  
**Script:** `~/clawd/scripts/enhanced-monitor.sh`

### What It Checks:
- **System metrics:** Hostname, uptime, load average
- **Memory:** Free percentage via `memory_pressure`
- **Disk:** Usage percentage on root volume
- **Docker:** Running containers, unhealthy containers
- **Ollama:** Status and loaded models
- **Network:** Tailscale, Google Cloud, Dell connectivity
- **Git:** Uncommitted changes, last commit time

### Output:
- Sends comprehensive Markdown report to Telegram
- Alerts if: memory < 15% free, disk > 85%, unhealthy containers

### Log File:
`~/clawd/logs/daily-health.log`

---

## 2. Weekly Security Audit

**Cron ID:** `89c511c8-3b00-4351-9ecc-e77a013f58ef`  
**Schedule:** `0 6 * * 0` (6:00 AM Central Time, every Sunday)  
**Script:** `~/clawd/scripts/security-audit-cron.sh`

### What It Scans:
1. **Hardcoded secrets** - API keys, tokens, passwords in code
2. **.gitignore coverage** - Ensures .env files are protected
3. **Git history** - Checks for accidentally committed sensitive files
4. **Network exposure** - Identifies listening ports
5. **Firewall status** - macOS Application Firewall state
6. **Exposed ports** - Full netstat listing
7. **SSH activity** - Recent login attempts

### Output:
- Full report saved to: `~/clawd/memory/security-audit-YYYY-MM-DD.md`
- Summary sent to Telegram
- Report auto-committed to git

### Log File:
`~/clawd/logs/security-audit.log`

---

## 3. Auto-commit Memory Files

**Cron ID:** `87636d94-fe65-4a38-8ccd-9d1269986894`  
**Schedule:** Every 6 hours  
**Script:** `~/clawd/scripts/auto-commit-memory.sh`

### What It Does:
1. Checks for changes in `~/clawd/memory/` directory
2. If changes found:
   - Stages all memory files
   - Creates commit with timestamp
   - Attempts to push to origin/main
3. If no changes: logs "No changes to commit"

### Purpose:
- Preserves daily notes and context
- Ensures memory files are backed up regularly
- Prevents loss of important session data

### Log File:
`~/clawd/logs/auto-commit.log`

---

## Script Locations

All scripts are located on Mac Mini at:

```
~/clawd/scripts/
├── enhanced-monitor.sh      # Daily health report
├── security-audit-cron.sh   # Weekly security audit wrapper
├── security-audit.sh        # Core security scanning logic
└── auto-commit-memory.sh    # Memory file git commits
```

---

## Manual Execution

To run any job manually:

```bash
# Via Clawdbot
clawdbot cron run --name daily-health-report
clawdbot cron run --name weekly-security-audit
clawdbot cron run --name auto-commit-memory

# Via SSH directly
ssh tommie@100.82.234.66 "~/clawd/scripts/enhanced-monitor.sh"
ssh tommie@100.82.234.66 "~/clawd/scripts/security-audit-cron.sh"
ssh tommie@100.82.234.66 "~/clawd/scripts/auto-commit-memory.sh"
```

---

## Managing Jobs

```bash
# List all cron jobs
clawdbot cron list

# Disable a job
clawdbot cron disable --name daily-health-report

# Enable a job
clawdbot cron enable --name daily-health-report

# Remove a job
clawdbot cron rm --name <job-name>

# View run history
clawdbot cron runs
```

---

## Telegram Notifications

Reports are sent to:
- **Chat ID:** `-1003779327245` (Clawd Infrastructure channel)
- **Bot:** Standard Clawdbot Telegram integration

---

## Related Documentation

- [MASTER_KNOWLEDGE.md](../MASTER_KNOWLEDGE.md) - Full infrastructure overview
- [TOOLS.md](../TOOLS.md) - Tool reference including SSH aliases
- [Security Audit Reports](../memory/) - Generated weekly in memory/

---

## Troubleshooting

### Job Not Running?
1. Check Clawdbot gateway status: `clawdbot gateway status`
2. Verify job is enabled: `clawdbot cron list`
3. Check Mac Mini is reachable: `ping 100.82.234.66`

### Script Failing?
1. Check logs on Mac Mini: `tail -50 ~/clawd/logs/daily-health.log`
2. Test script manually: `~/clawd/scripts/enhanced-monitor.sh`
3. Verify permissions: `ls -la ~/clawd/scripts/`

### Telegram Not Receiving?
1. Check bot token validity
2. Verify chat ID is correct
3. Test curl command manually from Mac Mini
