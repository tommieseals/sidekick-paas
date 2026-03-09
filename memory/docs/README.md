# 📁 Memory Folder Structure

*This folder is your continuity between sessions. Understand it well.*

---

## Purpose

You wake up fresh each session. **This folder IS your memory.** Read it, write to it, maintain it. It's how you persist across resets, context losses, and session restarts.

---

## Folder Structure

```
memory/
├── docs/                      # 📚 THIS FOLDER - Documentation system
│   ├── README.md              # You are here
│   ├── PROJECT_WORKFLOW.md    # How to manage projects
│   └── MACHINE_ROLES.md       # What each machine is for
│
├── YYYY-MM-DD.md              # 📅 Daily notes (raw logs of what happened)
├── PROJECT_REGISTRY.md        # 📋 Master list of all projects
├── heartbeat-state.json       # 💓 Last heartbeat check timestamps
├── notifications.log          # 🔔 Notification history
│
├── [topic]-YYYY-MM-DD.md      # 📝 Topic-specific notes (e.g., "mac-pro-sleep-fix")
├── security-audit-*.md        # 🔐 Security audit reports
└── soul-archive-*.md          # 🗄️ Archived soul/personality snapshots
```

---

## File Types Explained

### 📅 Daily Notes (`YYYY-MM-DD.md`)
**Purpose:** Raw logs of what happened that day.

**What to include:**
- Tasks completed
- Problems encountered and solutions
- Conversations with Rusty that matter
- Infrastructure changes
- Lessons learned

**Format:**
```markdown
# YYYY-MM-DD

## What Happened
- [timestamps optional]
- Actions taken
- Decisions made

## Issues
- Problems encountered
- How they were resolved

## Notes
- Things to remember
```

---

### 📋 Project Registry (`PROJECT_REGISTRY.md`)
**Purpose:** Single source of truth for ALL projects.

**RULE:** Before creating ANY new project, register it here FIRST.

**Contains:**
- Project locations (primary + backups)
- Status (active, archived, in-development)
- Tech stack
- Cross-machine sync status
- Design references

---

### 💓 Heartbeat State (`heartbeat-state.json`)
**Purpose:** Track when you last checked various services.

**Format:**
```json
{
  "lastChecks": {
    "email": 1703275200,
    "calendar": 1703260800,
    "security": 1703260800
  }
}
```

---

### 📝 Topic-Specific Notes (`[topic]-YYYY-MM-DD.md`)
**Purpose:** Deep-dive documentation on specific issues.

**Examples:**
- `mac-pro-sleep-fix-2026-02-12.md` - Detailed fix for Mac Pro sleep issues
- `quant-mcp-integration-2026-02-09.md` - MCP integration notes
- `ram-fix-report-2026-02-09.md` - RAM optimization report

---

## Memory Hierarchy

```
├── MEMORY.md (root)           # 🧠 Curated long-term memory (MOST IMPORTANT)
├── SOUL.md (root)             # 🎭 Who you are, what you've built
├── MASTER_KNOWLEDGE.md (root) # 📖 Infrastructure index
│
└── memory/                    # 📁 Working memory
    ├── Daily notes            # Raw logs
    ├── PROJECT_REGISTRY.md    # Project tracking
    └── docs/                  # How-to documentation
```

**Maintenance Cycle:**
1. **Daily:** Write to `YYYY-MM-DD.md` with what happened
2. **Weekly:** Review daily notes, update `MEMORY.md` with important learnings
3. **As needed:** Update `PROJECT_REGISTRY.md` for new projects
4. **Quarterly:** Archive old daily notes, clean up stale entries

---

## Rules

### ✅ DO
- Write things down immediately (don't rely on "mental notes")
- Be specific - include IPs, paths, commands
- Date everything
- Link related files
- Update existing docs rather than creating duplicates

### ❌ DON'T
- Let daily notes pile up without processing into MEMORY.md
- Create files outside this structure
- Store secrets in plaintext (use references to secure storage)
- Forget to register new projects

---

## Quick Reference Commands

```bash
# List recent daily notes
Get-ChildItem memory/*.md | Sort-Object LastWriteTime -Descending | Select-Object -First 5

# Find notes about a topic
Select-String -Path memory/*.md -Pattern "topic"

# Check project registry
Get-Content memory/PROJECT_REGISTRY.md
```

---

*This documentation system exists so future-you doesn't lose track of anything.*
*Last updated: 2026-02-28*
