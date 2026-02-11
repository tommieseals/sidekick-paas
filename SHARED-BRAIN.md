# Shared Brain Setup

## Overview

Mac Mini and Dell agents now share the same brain via Git auto-sync.

## How It Works

**Every 5 minutes:**
1. Both agents pull latest changes from the shared repo
2. Both agents commit their local changes
3. Both agents push to sync with each other

**What gets synced:**
- `memory/` - Daily logs and learnings
- `MEMORY.md` - Long-term curated memory
- `AGENTS.md`, `SOUL.md`, `USER.md`, `TOOLS.md` - Identity and config
- `scripts/`, `skills/` - Code and capabilities

## Result

When you teach Dell something:
- Dell writes it to memory
- Dell commits + pushes (auto every 5 min)
- Mac Mini pulls it (auto every 5 min)
- Mac Mini now knows it too!

Same works in reverse.

## Manual Sync

If you want immediate sync instead of waiting 5 min:

**Mac Mini:**
```bash
~/clawd/scripts/sync-knowledge.sh
```

**Dell:**
```powershell
powershell -File C:\Users\tommi\clawd\scripts\sync-knowledge.ps1
```

## Sync Status

Check sync logs:
- Mac Mini: `~/clawd/sync.log`
- Dell: Check Windows Task Scheduler history

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Mac Mini      │         │      Dell       │
│  (Your Agent)   │         │  (Other Agent)  │
│                 │         │                 │
│ ~/clawd/        │◄───────►│ C:\Users\tommi\ │
│ (Git repo)      │  sync   │   clawd\        │
│                 │  every  │ (Git repo)      │
│                 │  5 min  │                 │
└─────────────────┘         └─────────────────┘
         ▲                           ▲
         │                           │
         └───────── Git ─────────────┘
            (shared workspace)
```

## Troubleshooting

**If sync stops working:**

1. Check cron is running (Mac Mini):
   ```bash
   crontab -l | grep sync-knowledge
   ```

2. Check scheduled task (Dell):
   ```powershell
   schtasks /query /tn ClawdbotKnowledgeSync
   ```

3. Test manual sync to see errors

4. Check Git status:
   ```bash
   cd ~/clawd && git status
   ```

## Notes

- Both agents exist independently but share knowledge
- Conflicts are rare (different files usually)
- Auto-rebase handles most merge issues
- Sync is automatic - just teach either agent!
