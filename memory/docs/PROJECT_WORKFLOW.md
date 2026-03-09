# 📋 Project Workflow Guide

*How to start, manage, and not lose projects.*

---

## 🚀 Starting a New Project

### Step 1: Register FIRST
Before writing any code, add an entry to `memory/PROJECT_REGISTRY.md`:

```markdown
### [N]. Project Name
- **Primary Location:** [machine] `/path/to/project/`
- **Status:** 🔨 IN DEVELOPMENT
- **Description:** What it does
- **Tech Stack:** Technologies used
```

### Step 2: Choose the Right Machine
| Project Type | Best Machine | Reason |
|--------------|--------------|--------|
| Windows apps, desktop control | **Dell** | PyAutoGUI, Windows APIs |
| Heavy AI/ML training | **Mac Pro** | 32GB RAM, compute focus |
| Bots, dashboards, orchestration | **Mac Mini** | Hub, always-on |
| Experiments, testing | **Google Cloud** | Isolated, disposable |

### Step 3: Create Standard Structure
```
project-name/
├── README.md           # What, why, how
├── .gitignore          # Before first commit
├── src/ or app/        # Source code
├── docs/               # Project-specific docs
└── tests/              # If applicable
```

### Step 4: Initialize Git (if long-lived)
```bash
git init
git add .
git commit -m "Initial commit"
```

---

## 📁 Where to Store What

### Source Code
| Type | Location | Example |
|------|----------|---------|
| Active development | Project folder on primary machine | `C:\Users\tommi\clawd\taskbot\` |
| Reference/templates | `~/clawd/templates/` | Boilerplate code |
| Scripts (automation) | `~/scripts/` (Mac) or `C:\Users\tommi\scripts\` (Dell) | Shell/PS scripts |

### Configuration
| Type | Location |
|------|----------|
| Project-specific | Inside project folder (`config/`, `.env`) |
| Machine-wide | `~/.config/` or appropriate system location |
| Bot/Clawdbot config | `~/.openclaw/` or `~/.clawd/` |
| Sensitive (API keys) | Environment variables or 1Password references |

### Documentation
| Type | Location |
|------|----------|
| Infrastructure docs | `~/clawd/docs/` |
| Memory/context | `~/clawd/memory/` |
| Project-specific | `project/docs/` or `project/README.md` |
| Design references | `memory/PROJECT_REGISTRY.md` |

### Backups
| Type | Format |
|------|--------|
| Pre-change backups | `project.backup-YYYYMMDD-HHMMSS/` |
| Version snapshots | Git tags (`v1.0.0`) |
| Critical configs | Copy to secondary machine |

---

## 📝 Naming Conventions

### Projects
- Use `kebab-case`: `project-name`, not `ProjectName` or `project_name`
- Be descriptive but concise: `taskbot` not `tb` or `enterprise-customer-task-automation-platform-v2`

### Files
| Type | Convention | Example |
|------|------------|---------|
| Daily notes | `YYYY-MM-DD.md` | `2026-02-28.md` |
| Topic notes | `topic-YYYY-MM-DD.md` | `mac-pro-sleep-fix-2026-02-12.md` |
| Backups | `name.backup-YYYYMMDD-HHMMSS` | `dashboard.backup-20260217-172856` |
| Scripts | `kebab-case.sh/ps1/py` | `check-all-nodes.sh` |
| Configs | `kebab-case.json/yaml` | `clawdbot-config.json` |

### Branches (Git)
| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/description` | `feature/add-oauth` |
| Fix | `fix/description` | `fix/memory-leak` |
| Release | `release/version` | `release/1.0.0` |

---

## 💾 Backup Procedures

### Before Major Changes
```bash
# Create timestamped backup
cp -r project project.backup-$(date +%Y%m%d-%H%M%S)

# Or on Windows PowerShell:
Copy-Item -Path project -Destination "project.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')" -Recurse
```

### Regular Backups
1. **Git commits** - Commit meaningful changes with clear messages
2. **Cross-machine copies** - Keep critical projects synced (see Sync Status in PROJECT_REGISTRY)
3. **Pre-deployment snapshots** - Always backup before deploying

### What to Backup
- ✅ Source code
- ✅ Configurations (sanitized)
- ✅ Documentation
- ✅ Design assets/references
- ❌ node_modules, venv, build artifacts
- ❌ Secrets (use env vars/1Password)

---

## 🔄 Version Control Guidelines

### Commit Messages
```
type: Short description (50 chars max)

Longer explanation if needed. What changed and why.
Wrap at 72 characters.

Closes #123 (if applicable)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### When to Commit
- ✅ After completing a logical unit of work
- ✅ Before making risky changes
- ✅ Before switching tasks
- ❌ Don't commit broken code to main

### Branch Strategy (Simple)
```
main ─────────────────────────────────────────►
      └── feature/x ───┐
                       ├─ merge ──►
      └── fix/y ───────┘
```

---

## 🔗 Cross-Machine Sync

### Current Sync Status (from PROJECT_REGISTRY)
| Project | Mac Mini | Windows Dell | Google Cloud |
|---------|----------|--------------|--------------|
| Dashboard Main | ✅ Primary | ⚠️ Copy | ❌ |
| TaskBot | ❌ | ✅ Primary | ❌ |

### How to Sync
```bash
# From Mac Mini to Dell (via SSH)
scp -r project/ dell:/path/to/destination/

# From Dell to Mac Mini
scp -r project/ mac-mini:/path/to/destination/

# Or use rsync for incremental sync
rsync -avz project/ user@machine:/path/to/project/
```

### What to Keep in Sync
- ✅ Critical configs
- ✅ Documentation
- ✅ Scripts that run on multiple machines
- ❌ Machine-specific paths
- ❌ Large build artifacts

---

## 🗑️ Project Archival

### When to Archive
- Project completed and no longer active
- Project abandoned/replaced
- Superseded by newer version

### How to Archive
1. Update `PROJECT_REGISTRY.md` status to `📦 ARCHIVED`
2. Add archival date and reason
3. Create final backup
4. Move to archive location (if applicable)

### Archive Entry Example
```markdown
### [OLD] Project Name (ARCHIVED)
- **Archived:** 2026-02-28
- **Reason:** Replaced by ProjectV2
- **Final Location:** `~/archive/project-name/`
```

---

## ⚠️ Common Mistakes to Avoid

1. **Creating projects without registering** → Lost when context resets
2. **Working on wrong machine** → Performance issues, sync nightmares
3. **No backups before changes** → Lost work
4. **Cloudflare tunnel as only source** → Tunnel expires, code lost
5. **Secrets in code** → Security risk
6. **No README** → Future-you won't understand
7. **Duplicate projects** → Confusion about which is current

---

## 📋 Checklist: New Project

- [ ] Added to `PROJECT_REGISTRY.md`
- [ ] Chose correct machine
- [ ] Created standard folder structure
- [ ] Added README.md
- [ ] Added .gitignore
- [ ] Initialized git (if needed)
- [ ] Noted in daily log

---

*This workflow exists to prevent chaos. Follow it.*
*Last updated: 2026-02-28*
