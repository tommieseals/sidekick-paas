# 🏦 FORT KNOX - BACKUP SYSTEM DOCUMENTATION 🏦
## CRITICAL: Read Before Any Backup Operations

**Last Updated:** 2026-03-07
**Status:** FIXED - MAX_VERSIONS increased to 30

---

## 🚨 WHAT WENT WRONG (March 2026)

### The Disaster
- **Feb 27 backups were AUTO-DELETED**
- **skynet_loading.gif was LOST**
- Only 3 versions were being kept

### Root Cause
The `deploy.sh` script had:
```bash
MAX_VERSIONS=3  # WAY TOO LOW!
```

The `cleanup_old_versions()` function automatically deleted anything older than 3 versions without warning.

### The Fix Applied
```bash
MAX_VERSIONS=30  # Now keeps 30 versions
```

---

## 🔒 BACKUP POLICY (UPDATED)

### Version Backups (~/clawd-versions/)
- **Retention:** 30 versions (was 3 - FIXED)
- **Created by:** deploy.sh on each deployment
- **Contains:** Full ~/clawd/ snapshot (excludes logs, node_modules, .git)

### Daily Backups (~/backups/)
- **Retention:** 7 days
- **Created by:** backup.sh at 2 AM
- **Contains:** ~/clawd/, ~/.clawdbot/, system configs

### Shared Memory Backups
- **Location:** ~/backups/shared_memory_*.tar.gz
- **Retention:** Hourly backups throughout day

---

## ❌ WHAT NOT TO DO

1. **NEVER reduce MAX_VERSIONS below 30**
2. **NEVER manually delete from ~/clawd-versions/** without approval
3. **NEVER run cleanup scripts without checking what they delete**
4. **NEVER assume "old" means "unimportant"**

---

## ✅ PROTECTION RULES

### Before Any Cleanup
1. **List what will be deleted:** `ls -la ~/clawd-versions/`
2. **Check for important dates** (especially dates Rusty mentions)
3. **If in doubt, DON'T DELETE**

### Critical Files to NEVER Delete
- Any backup Rusty specifically references
- Backups from major feature releases
- Backups from days with significant work

### Fort Knox Vault (NEW)
Create a "never delete" vault for critical backups:
```bash
mkdir -p ~/fort-knox-vault
# Copy critical backups here - they will NEVER be auto-deleted
```

---

## 🔧 SCRIPTS

### deploy.sh
- Location: `~/clawd/scripts/deploy.sh`
- Creates version backup before each deploy
- Cleans up old versions (NOW keeps 30)
- Has rollback functionality

### backup.sh
- Location: `~/clawd/scripts/backup.sh`
- Runs nightly at 2 AM
- Creates daily full backups
- Keeps 7 days

---

## 📊 MONITORING

### Check Backup Count
```bash
echo "Version backups: $(ls ~/clawd-versions/ | wc -l)"
echo "Daily backups: $(ls ~/backups/backup-*.tar.gz 2>/dev/null | wc -l)"
```

### Verify Critical Backups Exist
Before any risky operation, verify you have recovery options:
```bash
ls -la ~/clawd-versions/ | head -10
ls -la ~/backups/ | tail -10
```

---

## 📝 LESSONS LEARNED

1. **3 versions is NOT enough** - Important work from 8 days ago was lost
2. **Auto-cleanup is dangerous** - No human approval before deletion
3. **Fort Knox wasn't protecting anything** - Just a dashboard, not actual protection
4. **Backups only work if they EXIST when you need them**

---

## 🔮 FUTURE IMPROVEMENTS

1. [ ] Create ~/fort-knox-vault/ for "never delete" backups
2. [ ] Add backup verification in heartbeat checks
3. [ ] Alert when backup count drops below threshold
4. [ ] Implement backup integrity checks
5. [ ] Cloud backup for critical files (Mac Pro or Google Cloud)

---

**REMEMBER:** Fort Knox means NOTHING gets deleted without explicit approval. 
The name "Fort Knox" implies MAXIMUM SECURITY, not "keep 3 copies and auto-purge."
