# FULL PROJECT AUDIT
**Date:** February 28, 2026  
**Auditor:** Clawd Subagent  

---

## 📊 EXECUTIVE SUMMARY

| Machine | Total Size | File Count | Primary Purpose |
|---------|-----------|------------|-----------------|
| **Mac Mini** (100.88.105.106) | 1.8 GB | 45,493 | Production dashboard, project-vault |
| **Windows Dell** (100.119.87.108) | 683 MB | 76,066 | Development, taskbot, arbitrage |

**Total across all machines:** ~2.5 GB, ~121,559 files

---

## 🖥️ MAC MINI (100.88.105.106)

### Folder Breakdown (by size)
| Folder | Size | Notes |
|--------|------|-------|
| `backups/` | 608 MB | ⚠️ 3 huge tar.gz files (142MB, 180MB, 316MB) |
| `project-vault/` | 218 MB | Active trading system |
| `projects/` | 165 MB | 5 project folders |
| `logs/` | 138 MB | Daily backup logs |
| `dashboard/` | 30 MB | **PRODUCTION** - includes node_modules |
| `dashboard.backup-failed-*` | 29 MB | ⚠️ CLEANUP CANDIDATE |
| `dashboard.backup-*` | 12 MB | ⚠️ CLEANUP CANDIDATE |
| `skills/` | 4.6 MB | 9 skill modules |
| `memory/` | 2.7 MB | Daily memory files |
| `scripts/` | 428 KB | Utility scripts |
| `metrics/` | 276 KB | System metrics |
| `dashboard-v2/` | 36 KB | Minimal v2 (7 files) |

### Dashboard (Production) - ~/clawd/dashboard/
**105 items** | Last modified: Feb 28, 2026

| File | Size | Last Modified |
|------|------|---------------|
| index.html | 28,698 | Feb 28 |
| infrastructure.html | 49,247 | Feb 28 |
| legion.html | 59,390 | Feb 28 |
| shared-brain.html | 52,171 | Feb 28 |
| fort-knox.html | 51,294 | Feb 28 |
| arbitrage-pharma.html | 51,640 | Feb 28 |
| taskbot.html | 47,698 | Feb 28 |
| project-vault.html | 47,275 | Feb 28 |
| swarm-monitor.html | 42,681 | Feb 28 |
| agents.html | 35,667 | Feb 28 |
| fiverr.html | 38,477 | Feb 28 |
| achievements.html | 32,577 | Feb 28 |
| legion-tracker.html | 33,262 | Feb 27 |

**Backup files in dashboard/ (redundant):**
- agents.html.backup, agents.html.bak
- apis.html.bak
- index.html.backup, index.html.bak, index.html.bak2, index.html.original, index.html.with-redirect
- infrastructure.html.backup, infrastructure.html.bak, infrastructure.html.bak-feb17
- projects.html.bak, projects.html.bak-20260224
- tools.html.backup, tools.html.bak
- legion-tracker.html.bak, legion-tracker.html.bak2
- server.js.bak, server.js.bak-swarm, server.js.http-backup
- swarm-monitor.html.bak2
- taskbot.html.backup-20260228-105626

### Dashboard-v2 - ~/clawd/dashboard-v2/
**9 files** | 36 KB total | Status: MINIMAL/INACTIVE

| File | Size |
|------|------|
| index.html | 7,793 |
| MEMORY.md | 4,741 |
| status.json | 473 |

### Backup Folders (CLEANUP CANDIDATES)
| Folder | Size | Date | Status |
|--------|------|------|--------|
| `dashboard.backup-20260217_172856/` | 12 MB | Feb 17 | ⚠️ OLD |
| `dashboard.backup-failed-20260219-202756/` | 29 MB | Feb 19 | ⚠️ FAILED BACKUP |
| `backups/job-hunter-*-20260217.tar.gz` | 142 MB | Feb 17 | ⚠️ OLD |
| `backups/job-hunter-*-20260218.tar.gz` | 180 MB | Feb 18 | ⚠️ OLD |
| `backups/job-hunter-*-20260226.tar.gz` | 316 MB | Feb 26 | ✅ KEEP (most recent) |

### Project Vault - ~/clawd/project-vault/
**218 MB** | Trading system with strategies, backtests, agents

Key components:
- `/strategies/` - 12 trading strategy files
- `/agents/` - regime_filter, cfo, risk_officer
- `/backtest/` - Engine, data loader, cache (33 ticker caches)
- `/intel/` - insider_tracker, earnings_calendar, news_sentiment
- `/options/` - wheel, iron_condor, leaps_scanner
- `/crypto/` - defi_yields, arbitrage_finder, funding_rates

### Projects - ~/clawd/projects/
| Project | Files |
|---------|-------|
| ai-infrastructure | 19 |
| investrain-ai | 10 |
| sidekick-paas | 10 |
| tascosaur-nlp | 12 |
| teams-un-translator | 16 |

### Root MD Files (78 files)
Notable documentation scattered in root:
- AGENTS.md, SOUL.md, TOOLS.md, MEMORY.md, USER.md (core)
- PROJECT_LEGION*.md (8 files)
- API_INTEGRATION*.md (3 files)
- DASHBOARD*.md (3 files)
- Various dated reports and logs

---

## 💻 WINDOWS DELL (100.119.87.108)

### Folder Breakdown
| Folder | Size | Files | Notes |
|--------|------|-------|-------|
| `taskbot/` | ~70 MB* | 70,410 | Node.js app (most in node_modules) |
| `arbitrage-pharma/` | 84.6 MB | 4,650 | Large project |
| `temp/` | 9.2 MB | 82 | ⚠️ CLEANUP CANDIDATE |
| `project-vault/` | 9.9 MB | 498 | Local copy |
| `projects/` | 730 KB | 131 | 5 project folders |
| `skills/` | 607 KB | 23 | 8 skill modules |
| `dashboard/` | 205 KB | 9 | **DIFFERENT from Mac** |
| `linkedin-assets/` | 602 KB | 6 | Profile assets |
| `memory/` | 121 KB | 33 | Daily files |

*Taskbot excluding node_modules: **1.77 MB, 100 files**

### Dashboard (Dell) - C:\Users\tommi\clawd\dashboard\
**9 files** | 205 KB | Infrastructure-focused

| File | Size | Last Modified |
|------|------|---------------|
| infrastructure.html | 61,936 | Feb 28 |
| 10-mcp.html | 33,006 | Feb 28 |
| 05-pharma.html | 27,799 | Feb 28 |
| 07-brain.html | 16,968 | Feb 28 |
| 09-llm.html | 14,564 | Feb 28 |
| projects-status.html | 13,354 | Feb 27 |
| 08-security.html | 13,144 | Feb 28 |
| 06-fortknox.html | 12,491 | Feb 28 |
| infrastructure-updated.html | 11,610 | Feb 27 |

**⚠️ NOTE:** Dell dashboard is DIFFERENT from Mac Mini dashboard!
- Mac: 105 files, 30 MB (full dashboard)
- Dell: 9 files, 205 KB (infrastructure sections only)

### Taskbot - C:\Users\tommi\clawd\taskbot\
**100 source files** (1.77 MB excluding node_modules)

### Temp Files (CLEANUP CANDIDATES)
Located in `C:\Users\tommi\clawd\`:
- temp_*.py files (12 files): detector, gatherer, health, etc.
- temp/ folder: 82 files, 9.2 MB

---

## 🔄 DUPLICATE DETECTION

### Confirmed Duplicates (Same Folder Structure)
| Folder | Mac Mini | Dell | Status |
|--------|----------|------|--------|
| projects/ai-infrastructure | ✅ | ✅ | Needs sync check |
| projects/investrain-ai | ✅ | ✅ | Needs sync check |
| projects/sidekick-paas | ✅ | ✅ | Needs sync check |
| projects/tascosaur-nlp | ✅ | ✅ | Needs sync check |
| projects/teams-un-translator | ✅ | ✅ | Needs sync check |
| skills/* | ✅ | ✅ | Missing 'asana' on Dell |
| project-vault/ | ✅ (218MB) | ✅ (9.9MB) | **DIFFERENT SIZES** |

### File Hash Comparison
| File | Mac Mini | Dell |
|------|----------|------|
| dashboard/index.html | 24c42bf1... | N/A (doesn't exist) |
| dashboard/infrastructure.html | 84976922... | 4D87CE4B... | **DIFFERENT** |

### Dashboard Version Confusion
- **Mac Mini ~/clawd/dashboard/** = Production (28KB index.html)
- **Mac Mini ~/clawd/dashboard-v2/** = Minimal (8KB index.html)
- **Dell C:\clawd\dashboard/** = Infrastructure sections only

---

## 🧹 CLEANUP RECOMMENDATIONS

### HIGH PRIORITY (Immediate savings: ~370 MB)

1. **Delete old backups on Mac Mini:**
   ```bash
   rm ~/clawd/dashboard.backup-failed-20260219-202756/ -rf  # 29 MB
   rm ~/clawd/dashboard.backup-20260217_172856/ -rf         # 12 MB
   rm ~/clawd/backups/job-hunter-system-backup-20260217*.tar.gz  # 142 MB
   rm ~/clawd/backups/job-hunter-system-backup-20260218*.tar.gz  # 180 MB
   ```

2. **Clean .bak files in dashboard/ (Mac Mini):**
   ```bash
   rm ~/clawd/dashboard/*.bak*
   rm ~/clawd/dashboard/*.backup*
   rm ~/clawd/dashboard/*.original
   rm ~/clawd/dashboard/*-backup*.html
   ```

3. **Delete temp files on Dell:**
   ```powershell
   Remove-Item C:\Users\tommi\clawd\temp_*.py
   Remove-Item C:\Users\tommi\clawd\temp\ -Recurse
   ```

### MEDIUM PRIORITY (Organizational)

4. **Consolidate dashboards:**
   - Dell dashboard/ appears to be infrastructure sections only
   - Consider moving to `dashboard/sections/` on Mac
   - Or delete if generated from main dashboard

5. **Sync project-vault:**
   - Mac: 218 MB (authoritative)
   - Dell: 9.9 MB (outdated/partial)
   - Action: Either sync or remove Dell copy

6. **Archive old documentation:**
   - 78 MD files in Mac Mini root
   - Many are dated reports (Feb 2026)
   - Move to `docs/archive/2026-02/`

### LOW PRIORITY (Nice to have)

7. **Review logs/ folder (138 MB)**
   - Daily backup logs from Feb 20-28
   - Consider log rotation/compression

8. **Skills folder alignment:**
   - Mac has `asana` skill, Dell doesn't
   - Sync if needed

---

## 📁 AUTHORITATIVE SOURCES

| Component | Primary Location | Notes |
|-----------|-----------------|-------|
| **Dashboard (Production)** | Mac Mini ~/clawd/dashboard/ | 30 MB, serves tommieseals.com |
| **Project Vault** | Mac Mini ~/clawd/project-vault/ | 218 MB, trading system |
| **Taskbot** | Dell C:\clawd\taskbot/ | Node.js app |
| **Arbitrage Pharma** | Dell C:\clawd\arbitrage-pharma/ | 84 MB, active project |
| **Core Config** | Both | AGENTS.md, SOUL.md, etc. synced |
| **Daily Memory** | Both | memory/YYYY-MM-DD.md |

---

## 📈 STORAGE PROJECTIONS

**If cleanup performed:**
- Mac Mini: 1.8 GB → ~1.4 GB (save ~400 MB)
- Dell: 683 MB → ~580 MB (save ~100 MB)

**Growth concerns:**
- project-vault/backtest/cache/ growing (33 ticker caches @ 94KB each)
- logs/ growing ~15 MB/week
- backups/ manual tarballs need rotation

---

## ✅ AUDIT COMPLETE

**Summary:**
- Production dashboard lives on Mac Mini
- Dell is development/specialized (taskbot, arbitrage)
- ~370 MB recoverable from old backups
- Dashboard files NOT synced (different content)
- Project-vault has significant version skew between machines

**Next steps:**
1. Run cleanup commands above
2. Decide on dashboard consolidation strategy
3. Establish backup rotation policy
4. Consider rsync for projects/ folder
