# Security Officer System

Automated security auditing system running daily to protect against exposed secrets and vulnerabilities.

## What It Scans For

### 1. **Hardcoded Secrets**
- API keys (OpenAI, AWS, etc.)
- Tokens (Telegram bots, OAuth, etc.)
- Passwords and credentials
- Private keys

### 2. **Git Protection**
- Missing `.gitignore` entries
- Sensitive files in git history
- Accidental secret commits

### 3. **Network Exposure**
- Open ports (especially databases)
- Privileged port listeners
- Unexpected services

## Scan Schedule

- **Daily:** 5:00 AM local time (quick scan)
- **Weekly:** Sunday 5:00 AM (deep audit)

## How It Works

```bash
# Manual run
/Users/tommie/clawd/scripts/security-audit.sh

# View latest report
cat /Users/tommie/clawd/memory/security-audit-$(date +%Y-%m-%d).md
```

## Reports

All audit reports are saved to: `/Users/tommie/clawd/memory/security-audit-YYYY-MM-DD.md`

## Findings & Remediation

When issues are found:

### Hardcoded Secrets
```bash
# Move to 1Password vault
op item create --category="API Credential" \
    --title="OpenAI API Key" \
    --vault="Automation" \
    api_key=sk-...

# Use in code via op CLI
export OPENAI_API_KEY=$(op read "op://Automation/OpenAI API Key/api_key")
```

### Git History Cleaning
```bash
# Remove sensitive files from git history
git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch path/to/secret/file' \
    --prune-empty --tag-name-filter cat -- --all
```

### Network Exposure
```bash
# Check what's listening
lsof -iTCP -sTCP:LISTEN -n -P

# Close unnecessary ports
# Kill the process or configure firewall
```

## Integration with 1Password

The system assumes 1Password CLI (`op`) is configured:

```bash
# Check op CLI status
op whoami

# Set up if needed (see skills/1password/SKILL.md)
```

## Automation Setup

Current setup uses system cron. To view:
```bash
crontab -l
```

## Current Status

Last audit: Check `/Users/tommie/clawd/memory/` for latest report

## Tools Used

- **grep/awk** - Pattern matching for secrets
- **git** - History analysis
- **lsof** - Network port scanning
- **1Password CLI** - Secret management

## Adding Custom Patterns

Edit `/Users/tommie/clawd/scripts/security-audit.sh` and add your own grep patterns:

```bash
# Example: Scan for custom API key format
grep -rn -E "myapi_[a-z0-9]{32}" . 2>/dev/null
```

## Automated Alerting

When security issues are found:

1. **Immediate Alert via Telegram**
   - Audit runs at 5 AM daily
   - Issues detected → Alert queued
   - Clawdbot sends Telegram notification on next heartbeat (within hours)
   - Alert includes issue count and summary

2. **Heartbeat Checks**
   - Clawdbot reviews security reports 2-4 times per day
   - Automatic notification if new issues found
   - Only alerts once per report (no spam)
   - Silent during late night (23:00-08:00) unless critical (10+ issues)

3. **Alert Tracking**
   - State tracked in `memory/heartbeat-state.json`
   - Prevents duplicate notifications
   - Manual reset: Delete the state file to re-alert

### Manual Check
```bash
# Check for pending alerts
/Users/tommie/clawd/scripts/check-security-alerts.sh

# View today's report
cat /Users/tommie/clawd/memory/security-audit-$(date +%Y-%m-%d).md
```

---

**Security is a continuous process. Review findings promptly and keep secrets in vaults, not code.**
