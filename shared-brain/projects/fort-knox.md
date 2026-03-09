# 🏰 Fort Knox — Backup Policy

**Status:** ✅ ACTIVE
**Location:** Mac Pro `~/fort-knox/`
**Lead:** Bottom Bitch

---

## Policy Rules

| Age | Location | Action |
|-----|----------|--------|
| 0-7 days | Origin node | Hot storage (uncompressed) |
| 7-30 days | Mac Pro (Fort Knox) | Compressed .tar.gz |
| 30+ days | — | Auto-deleted |

---

## Fort Knox Structure

```
~/fort-knox/
├── backups/          ← Mac Mini old backups
├── clawd-versions/   ← Mac Mini old deploy versions
└── dell-backups/     ← Dell old backups
```

---

## Scripts

| Node | Script | Schedule |
|------|--------|----------|
| Mac Mini | `~/clawd/scripts/fort-knox-policy.sh` | 3 AM daily |
| Dell | `C:\Users\tommi\clawd\scripts\fort-knox-policy.ps1` | 4 AM daily |

---

## Why It Exists

Mac Mini disk hit 100% (252MB free) on Feb 27 due to:
- 697 failed deploy backups in `clawd-versions/` (71GB!)
- Auto-deploy creating backups but failing on git pull
- No cleanup running because deploy never completed

---

## Commands

```bash
# Manual run (Mac Mini)
~/clawd/scripts/fort-knox-policy.sh

# Check status
launchctl list | grep fort-knox

# View logs
tail -50 ~/clawd/logs/fort-knox.log
```

---

## Dashboard

http://100.88.105.106:8080/fort-knox.html
